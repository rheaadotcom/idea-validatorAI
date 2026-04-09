import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Idea from '@/models/Idea';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// ─────────────────────────────────────────────
// Safe JSON response helper
// ─────────────────────────────────────────────
function safeJsonResponse(data, status = 200) {
  try {
    return NextResponse.json(data, { status });
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// ─────────────────────────────────────────────
// Lazy-loaded OpenAI client
// ─────────────────────────────────────────────
let openai = null;
let openaiInitAttempted = false;

async function getOpenAIClient() {
  if (openaiInitAttempted) return openai;
  openaiInitAttempted = true;
  try {
    const { default: OpenAI } = await import('openai');
    if (process.env.OPENAI_API_KEY) {
      openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
  } catch (e) {
    console.warn('[PITCH API] OpenAI SDK not available:', e?.message);
  }
  return openai;
}

// ─────────────────────────────────────────────
// Circuit Breaker for Pitch API
// ─────────────────────────────────────────────
let pitchCircuitOpen = false;
let pitchCircuitOpenedAt = 0;
const PITCH_CIRCUIT_RESET_MS = 5 * 60 * 1000;

function isPitchCircuitOpen() {
  if (!pitchCircuitOpen) return false;
  if (Date.now() - pitchCircuitOpenedAt > PITCH_CIRCUIT_RESET_MS) {
    pitchCircuitOpen = false;
    return false;
  }
  return true;
}

function tripPitchCircuit(reason) {
  pitchCircuitOpen = true;
  pitchCircuitOpenedAt = Date.now();
  console.log(`[PITCH CIRCUIT] Opened — skipping OpenAI for 5 minutes. Reason: ${reason}`);
}

// ─────────────────────────────────────────────
// Demo Pitch Deck Fallback
// ─────────────────────────────────────────────
function generateDemoPitchDeck(idea) {
  return {
    slides: [
      { slide_number: 1, title: 'Title Slide', content: `${idea.title} — ${(idea.description || '').slice(0, 120)}...` },
      { slide_number: 2, title: 'The Problem', content: idea.analysis?.problem || 'Millions of users face this problem daily, yet existing solutions remain fragmented, expensive, and unintuitive.' },
      { slide_number: 3, title: 'Our Solution', content: `${idea.title} provides a streamlined, AI-enhanced platform that solves this problem end-to-end with a focus on user experience and automation.` },
      { slide_number: 4, title: 'Target Market', content: idea.analysis?.market || 'A rapidly growing multi-billion dollar market with clear demand signals and low digital penetration.' },
      { slide_number: 5, title: 'Business Model', content: 'Freemium SaaS model with tiered pricing. Free tier for individual users, Pro tier ($19/mo) for teams, Enterprise tier with custom pricing. Expected LTV:CAC ratio of 4:1.' },
      { slide_number: 6, title: 'Competitive Landscape', content: `Key competitors include ${idea.analysis?.competitor?.map((c) => c.name).join(', ') || 'several market players'}. Our differentiation lies in AI-powered personalization and a superior user experience.` },
      { slide_number: 7, title: 'Go-to-Market Strategy', content: 'Phase 1: Launch on Product Hunt & target early adopters via content marketing. Phase 2: Partnerships with industry influencers. Phase 3: Paid acquisition with proven unit economics.' },
      { slide_number: 8, title: 'Technology', content: `Built with ${idea.analysis?.tech_stack?.join(', ') || 'modern web technologies'}. Scalable microservices architecture designed for rapid iteration and global deployment.` },
      { slide_number: 9, title: 'Traction & Milestones', content: 'MVP launched. Initial user validation complete. Next milestones: 1K users in 3 months, seed round, and first enterprise pilot.' },
      { slide_number: 10, title: 'The Ask', content: 'Seeking $500K in pre-seed funding to scale engineering, acquire first 10K users, and establish product-market fit within 12 months.' },
    ],
  };
}

// ─────────────────────────────────────────────
// POST /api/ideas/[id]/pitch
// ─────────────────────────────────────────────
export async function POST(request, context) {
  try {
    let session;
    try {
      session = await getServerSession(authOptions);
    } catch (authError) {
      console.error('[PITCH POST] Auth error:', authError?.message);
      return safeJsonResponse({ success: false, error: 'Authentication service unavailable' }, 200);
    }

    if (!session) {
      return safeJsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }

    // Safe param extraction
    let id;
    try {
      const resolvedParams = await context.params;
      id = resolvedParams?.id;
    } catch {
      id = context?.params?.id;
    }

    if (!id) {
      return safeJsonResponse({ success: false, error: 'Invalid idea ID' }, 400);
    }

    try {
      await dbConnect();
    } catch (dbError) {
      console.error('[PITCH POST] DB error:', dbError?.message);
      return safeJsonResponse({ success: false, error: 'Database temporarily unavailable' }, 200);
    }

    const idea = await Idea.findOne({ _id: id, userId: session.user.id });
    if (!idea) {
      return safeJsonResponse({ success: false, error: 'Idea not found' }, 404);
    }

    // Return cached pitch deck if it exists
    if (idea.pitchDeck && idea.pitchDeck.slides && idea.pitchDeck.slides.length > 0) {
      return safeJsonResponse({ success: true, data: idea.pitchDeck });
    }

    let pitchDeck = null;

    // ── Attempt OpenAI call (with circuit breaker + timeout) ──
    const client = await getOpenAIClient();
    if (client && !isPitchCircuitOpen()) {
      try {
        const prompt = `
          You are an expert VC and startup founder. Based on the following startup idea analysis, generate a 10-slide Pitch Deck Outline.
          Return STRICT JSON matching this structure:
          {
            "slides": [
              { "slide_number": 1, "title": "Title", "content": "..." },
              ...
            ]
          }

          Context:
          Title: ${idea.title}
          Description: ${idea.description}
          Analysis: ${JSON.stringify(idea.analysis)}
        `;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const completion = await client.chat.completions.create({
          messages: [
            { role: 'system', content: 'You are an expert VC. ONLY return valid JSON.' },
            { role: 'user', content: prompt },
          ],
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
        }, { signal: controller.signal });

        clearTimeout(timeout);

        const rawContent = completion?.choices?.[0]?.message?.content;
        if (rawContent) {
          pitchDeck = JSON.parse(rawContent);
          console.log('[PITCH POST] OpenAI pitch deck generated for:', idea.title);
        } else {
          throw new Error('Empty response from OpenAI');
        }
      } catch (aiError) {
        const errMsg = aiError?.message || aiError?.code || 'Unknown error';
        tripPitchCircuit(errMsg);
        console.warn('[PITCH POST] OpenAI failed, falling back to demo:', errMsg);
      }
    }

    // ── Fallback: Demo pitch deck ──
    if (!pitchDeck) {
      console.log('[PITCH POST] Using DEMO pitch deck for:', idea.title);
      pitchDeck = generateDemoPitchDeck(idea);
    }

    // ── Save to database ──
    try {
      idea.pitchDeck = pitchDeck;
      await idea.save();
    } catch (saveError) {
      console.error('[PITCH POST] DB save error:', saveError?.message);
      // Still return the pitch deck even if save fails
    }

    return safeJsonResponse({ success: true, data: pitchDeck });
  } catch (error) {
    console.error('[PITCH POST] Unhandled error:', error?.message || error);
    return safeJsonResponse(
      { success: false, error: 'Failed to generate pitch deck. Please try again.' },
      200
    );
  }
}
