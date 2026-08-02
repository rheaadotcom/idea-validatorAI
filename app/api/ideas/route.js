import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Idea from '@/models/Idea';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authConfig';

// ─────────────────────────────────────────────
// Lazy-loaded Groq client (never crash on import)
// ─────────────────────────────────────────────
let groq = null;
let groqInitAttempted = false;

async function getGroqClient() {
  if (groqInitAttempted) return groq;
  groqInitAttempted = true;
  try {
    const { Groq } = await import('groq-sdk');
    if (process.env.GROQ_API_KEY) {
      groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      console.log('[IDEAS API] Groq client initialized.');
    } else {
      console.warn('[IDEAS API] No GROQ_API_KEY found — demo mode active.');
    }
  } catch (e) {
    console.warn('[IDEAS API] Groq SDK not available, running in demo mode:', e?.message);
  }
  return groq;
}

// ─────────────────────────────────────────────
// Circuit Breaker: Skip OpenAI after failure
// Retries after 5 minutes
// ─────────────────────────────────────────────
let circuitOpen = false;
let circuitOpenedAt = 0;
const CIRCUIT_RESET_MS = 5 * 60 * 1000; // 5 minutes

function isCircuitOpen() {
  if (!circuitOpen) return false;
  if (Date.now() - circuitOpenedAt > CIRCUIT_RESET_MS) {
    circuitOpen = false;
    console.log('[CIRCUIT] Reset — will retry OpenAI on next request.');
    return false;
  }
  return true;
}

function tripCircuit(reason) {
  circuitOpen = true;
  circuitOpenedAt = Date.now();
  console.log(`[CIRCUIT] Opened — skipping OpenAI for 5 minutes. Reason: ${reason}`);
}

// ─────────────────────────────────────────────
// Demo Mode: Generates intelligent fallback analysis
// based on user's actual title & description
// ─────────────────────────────────────────────
function generateDemoAnalysis(title, description) {
  const text = `${title} ${description}`.toLowerCase();

  // Detect domain keywords for relevant competitors
  const domainMap = {
    food: {
      competitors: [
        { name: 'DoorDash', difference: 'Your idea focuses on a niche food segment with personalized recommendations.' },
        { name: 'Swiggy', difference: 'You target a more localized market with AI-driven customization.' },
        { name: 'Zomato', difference: 'Your approach adds unique tech differentiation beyond simple delivery.' },
      ],
      tech: ['React Native', 'Node.js', 'MongoDB', 'Stripe', 'Google Maps API'],
      market: 'The online food and delivery market is valued at $300B+ globally, with rapid growth in hyper-local and AI-personalized segments.',
      customer: 'Urban millennials and Gen-Z consumers (18-35) who value convenience, personalization, and quality dining experiences.',
    },
    health: {
      competitors: [
        { name: 'Headspace', difference: 'Your platform offers more personalized, data-driven health insights.' },
        { name: 'Fitbit', difference: 'You focus on holistic wellness rather than just fitness tracking.' },
        { name: 'Noom', difference: 'Your AI coaching provides real-time adaptive recommendations.' },
      ],
      tech: ['Flutter', 'Python/FastAPI', 'PostgreSQL', 'TensorFlow Lite', 'AWS HealthLake'],
      market: 'The digital health market is projected to reach $660B by 2027, driven by wearables, telehealth, and AI diagnostics.',
      customer: 'Health-conscious adults (25-55) seeking proactive wellness solutions and personalized health monitoring.',
    },
    education: {
      competitors: [
        { name: 'Coursera', difference: 'Your platform uses adaptive AI to create truly personalized learning paths.' },
        { name: 'Duolingo', difference: 'You extend gamification beyond language to broader skill development.' },
        { name: 'Khan Academy', difference: 'Your model integrates mentor matching alongside self-paced content.' },
      ],
      tech: ['Next.js', 'Python', 'PostgreSQL', 'OpenAI API', 'WebRTC'],
      market: 'The global EdTech market is expected to reach $400B by 2028, with AI-powered personalized learning as the fastest growing segment.',
      customer: 'Students (16-30), working professionals seeking upskilling, and lifelong learners in developing markets.',
    },
    finance: {
      competitors: [
        { name: 'Robinhood', difference: 'Your platform provides deeper AI-driven financial advisory beyond simple trading.' },
        { name: 'Mint', difference: 'You offer predictive budgeting using ML rather than just tracking past expenses.' },
        { name: 'Stripe', difference: 'Your focus is on end-user finance management, not payment infrastructure.' },
      ],
      tech: ['React', 'Node.js', 'PostgreSQL', 'Plaid API', 'TensorFlow'],
      market: 'The fintech market is projected to exceed $700B by 2030, with personal finance AI tools growing at 25% CAGR.',
      customer: 'Young professionals (22-40) seeking automated, intelligent financial planning and investment guidance.',
    },
    ai: {
      competitors: [
        { name: 'Jasper AI', difference: 'Your tool targets a more specific use-case with deeper domain expertise.' },
        { name: 'ChatGPT', difference: 'You offer a specialized workflow rather than general-purpose conversation.' },
        { name: 'Copy.ai', difference: 'Your solution integrates with existing business tools for seamless adoption.' },
      ],
      tech: ['Next.js', 'Python/FastAPI', 'Redis', 'OpenAI/Claude API', 'Vercel'],
      market: 'The generative AI market is expected to reach $1.3T by 2032, with enterprise AI tools being the dominant segment.',
      customer: 'SMBs, content creators, and enterprise teams looking to automate knowledge-intensive workflows.',
    },
    default: {
      competitors: [
        { name: 'Existing Market Leader', difference: 'Your approach introduces a novel technology or business model twist.' },
        { name: 'Well-funded Startup', difference: 'You focus on an underserved niche within the broader market.' },
        { name: 'Traditional Alternative', difference: 'Your digital-first approach offers superior convenience and scalability.' },
      ],
      tech: ['Next.js', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Vercel'],
      market: 'The global SaaS market is growing at 18% CAGR, with increasing demand for AI-enhanced and niche vertical solutions.',
      customer: 'Tech-savvy early adopters and SMBs seeking efficient, modern solutions to traditional industry pain points.',
    },
  };

  // Pick the best matching domain
  let domain = 'default';
  const keywords = {
    food: ['food', 'restaurant', 'delivery', 'cook', 'meal', 'recipe', 'chef', 'eat', 'kitchen', 'grocery'],
    health: ['health', 'fitness', 'medical', 'doctor', 'wellness', 'mental', 'therapy', 'hospital', 'pharma', 'workout'],
    education: ['education', 'learn', 'study', 'course', 'tutor', 'school', 'university', 'student', 'teach', 'skill'],
    finance: ['finance', 'money', 'bank', 'invest', 'payment', 'fintech', 'budget', 'loan', 'crypto', 'trading'],
    ai: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'llm', 'gpt', 'chatbot', 'automation', 'neural', 'deep learning'],
  };

  for (const [key, words] of Object.entries(keywords)) {
    if (words.some((w) => text.includes(w))) {
      domain = key;
      break;
    }
  }

  const data = domainMap[domain];

  // Generate a variable profitability score based on description length & detail
  const descLength = (description || '').length;
  const baseScore = 45;
  const lengthBonus = Math.min(descLength / 20, 25);
  const keywordBonus = data === domainMap.default ? 0 : 10;
  const profitabilityScore = Math.min(Math.round(baseScore + lengthBonus + keywordBonus + (Math.random() * 10)), 95);

  // Determine risk
  let riskLevel = 'Medium';
  if (profitabilityScore >= 75) riskLevel = 'Low';
  else if (profitabilityScore < 50) riskLevel = 'High';

  return {
    problem: `Many users face challenges related to "${title}". Current solutions are fragmented, expensive, or lack personalization. There is a clear gap in the market for a streamlined, AI-enhanced approach that addresses this problem holistically.`,
    customer: data.customer,
    market: data.market,
    competitor: data.competitors,
    tech_stack: data.tech,
    risk_level: riskLevel,
    profitability_score: profitabilityScore,
    justification: `"${title}" addresses a real market need. The concept shows ${profitabilityScore >= 70 ? 'strong' : profitabilityScore >= 50 ? 'moderate' : 'early-stage'} potential. Key to success will be rapid user acquisition, a clear monetization strategy, and differentiation from existing players. Focus on building an MVP and validating with early adopters before scaling.`,
    _demo: true,
  };
}

// ─────────────────────────────────────────────
// Safe JSON response helper — ALWAYS returns valid JSON
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
// GET /api/ideas — List all ideas for the user
// ─────────────────────────────────────────────
export async function GET() {
  try {
    let session;
    try {
      session = await getServerSession(authOptions);
    } catch (authError) {
      console.error('[IDEAS GET] Auth error:', authError?.message);
      return safeJsonResponse({ success: false, error: 'Authentication service unavailable' }, 200);
    }

    if (!session) {
      return safeJsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }

    try {
      await dbConnect();
    } catch (dbError) {
      console.error('[IDEAS GET] DB connection error:', dbError?.message);
      return safeJsonResponse({ success: true, data: [], message: 'Database temporarily unavailable' }, 200);
    }

    const ideas = await Idea.find({ userId: session.user.id }).sort({ createdAt: -1 });
    return safeJsonResponse({ success: true, data: ideas });
  } catch (error) {
    console.error('[IDEAS GET] Unhandled error:', error?.message || error);
    return safeJsonResponse({ success: false, error: 'Failed to load ideas. Please try again.', data: [] }, 200);
  }
}

// ─────────────────────────────────────────────
// POST /api/ideas — Create & analyze a new idea
// ─────────────────────────────────────────────
export async function POST(request) {
  try {
    // ── Auth ──
    let session;
    try {
      session = await getServerSession(authOptions);
    } catch (authError) {
      console.error('[IDEAS POST] Auth error:', authError?.message);
      return safeJsonResponse({ success: false, error: 'Authentication service unavailable' }, 200);
    }

    if (!session) {
      return safeJsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }

    // ── Parse body ──
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return safeJsonResponse({ success: false, error: 'Invalid request body' }, 200);
    }

    const { title, description } = body || {};

    if (!title || !description) {
      return safeJsonResponse({ success: false, error: 'Title and description are required' }, 200);
    }

    // ── DB Connection ──
    let dbConnected = false;
    try {
      await dbConnect();
      dbConnected = true;
    } catch (dbError) {
      console.error('[IDEAS POST] DB connection error:', dbError?.message);
      // Continue without DB — will return analysis without saving
    }

    let analysis = null;
    let isDemo = false;

    // ── Attempt Groq call (with circuit breaker + timeout) ──
    const client = await getGroqClient();
    if (client && !isCircuitOpen()) {
      try {
        const prompt = `
          You are a senior startup consultant and VC analyst.
          Analyze the startup idea and return STRICT JSON:

          Idea Title: ${title}
          Idea Description: ${description}

          {
            "problem": "",
            "customer": "",
            "market": "",
            "competitor": [
              {"name": "", "difference": ""},
              {"name": "", "difference": ""},
              {"name": "", "difference": ""}
            ],
            "tech_stack": [],
            "risk_level": "Low | Medium | High",
            "profitability_score": 0,
            "justification": ""
          }

          Rules:
          - Be realistic, not optimistic
          - Keep answers concise
          - Competitors must be real
          - Tech stack must be practical
          - Profitability score must be between 0–100

          ONLY RETURN JSON
        `;

        // 10-second timeout so we fail fast
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const completion = await client.chat.completions.create({
          messages: [
            { role: 'system', content: 'You are a senior startup consultant and VC analyst. ONLY return valid JSON.' },
            { role: 'user', content: prompt },
          ],
          model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
          response_format: { type: 'json_object' },
        }, { signal: controller.signal });

        clearTimeout(timeout);

        const rawContent = completion?.choices?.[0]?.message?.content;
        if (rawContent) {
          analysis = JSON.parse(rawContent);
          console.log('[IDEAS POST] OpenAI analysis successful for:', title);
        } else {
          throw new Error('Empty response from OpenAI');
        }
      } catch (aiError) {
        const errMsg = aiError?.message || aiError?.code || 'Unknown error';
        // Trip circuit on quota/rate-limit/network errors
        if (
          errMsg.includes('429') ||
          errMsg.includes('insufficient_quota') ||
          errMsg.includes('rate_limit') ||
          errMsg.includes('timeout') ||
          errMsg.includes('abort') ||
          errMsg.includes('ECONNREFUSED') ||
          errMsg.includes('fetch failed')
        ) {
          tripCircuit(errMsg);
        }
        console.warn('[IDEAS POST] OpenAI failed, falling back to demo mode:', errMsg);
      }
    }

    // ── Fallback: Demo mode analysis ──
    if (!analysis) {
      console.log('[IDEAS POST] Using DEMO analysis for:', title);
      analysis = generateDemoAnalysis(title, description);
      isDemo = true;
    }

    // ── Ensure analysis has all required fields ──
    analysis = {
      problem: analysis.problem || 'Analysis pending.',
      customer: analysis.customer || 'General consumers.',
      market: analysis.market || 'Market analysis pending.',
      competitor: Array.isArray(analysis.competitor) ? analysis.competitor : [],
      tech_stack: Array.isArray(analysis.tech_stack) ? analysis.tech_stack : [],
      risk_level: ['Low', 'Medium', 'High'].includes(analysis.risk_level) ? analysis.risk_level : 'Medium',
      profitability_score: typeof analysis.profitability_score === 'number' ? analysis.profitability_score : 50,
      justification: analysis.justification || 'Further analysis recommended.',
      ...(isDemo ? { _demo: true } : {}),
    };

    // ── Save to database (if connected) ──
    let idea;
    if (dbConnected) {
      try {
        idea = await Idea.create({
          title,
          description,
          analysis,
          userId: session.user.id,
        });
      } catch (dbSaveError) {
        console.error('[IDEAS POST] DB save error:', dbSaveError?.message);
        // Return analysis without saving — still useful to the user
        idea = {
          _id: `demo_${Date.now()}`,
          title,
          description,
          analysis,
          createdAt: new Date().toISOString(),
        };
      }
    } else {
      // No DB — return a virtual idea object
      idea = {
        _id: `demo_${Date.now()}`,
        title,
        description,
        analysis,
        createdAt: new Date().toISOString(),
      };
    }

    return safeJsonResponse(
      {
        success: true,
        data: idea,
        demo: isDemo,
        message: isDemo ? '⚡ Analysis generated in Demo Mode (AI API unavailable). Results are illustrative.' : undefined,
      },
      201
    );
  } catch (error) {
    console.error('[IDEAS POST] Unhandled error:', error?.message || error);
    return safeJsonResponse(
      { success: false, error: 'Something went wrong. Please try again.' },
      200
    );
  }
}
