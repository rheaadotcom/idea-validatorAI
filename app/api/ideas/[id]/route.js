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
// Safe param extraction (handles both sync/async params)
// ─────────────────────────────────────────────
async function extractId(context) {
  try {
    const params = await context.params;
    return params?.id;
  } catch {
    return context?.params?.id;
  }
}

// ─────────────────────────────────────────────
// GET /api/ideas/[id]
// ─────────────────────────────────────────────
export async function GET(request, context) {
  try {
    let session;
    try {
      session = await getServerSession(authOptions);
    } catch (authError) {
      console.error('[IDEA GET] Auth error:', authError?.message);
      return safeJsonResponse({ success: false, error: 'Authentication service unavailable' }, 200);
    }

    if (!session) {
      return safeJsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }

    const id = await extractId(context);
    if (!id) {
      return safeJsonResponse({ success: false, error: 'Invalid idea ID' }, 400);
    }

    try {
      await dbConnect();
    } catch (dbError) {
      console.error('[IDEA GET] DB error:', dbError?.message);
      return safeJsonResponse({ success: false, error: 'Database temporarily unavailable' }, 200);
    }

    const idea = await Idea.findOne({ _id: id, userId: session.user.id });
    if (!idea) {
      return safeJsonResponse({ success: false, error: 'Idea not found or unauthorized' }, 404);
    }

    return safeJsonResponse({ success: true, data: idea });
  } catch (error) {
    console.error('[IDEA GET] Unhandled error:', error?.message || error);
    return safeJsonResponse({ success: false, error: 'Failed to load idea. Please try again.' }, 200);
  }
}

// ─────────────────────────────────────────────
// DELETE /api/ideas/[id]
// ─────────────────────────────────────────────
export async function DELETE(request, context) {
  try {
    let session;
    try {
      session = await getServerSession(authOptions);
    } catch (authError) {
      console.error('[IDEA DELETE] Auth error:', authError?.message);
      return safeJsonResponse({ success: false, error: 'Authentication service unavailable' }, 200);
    }

    if (!session) {
      return safeJsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }

    const id = await extractId(context);
    if (!id) {
      return safeJsonResponse({ success: false, error: 'Invalid idea ID' }, 400);
    }

    try {
      await dbConnect();
    } catch (dbError) {
      console.error('[IDEA DELETE] DB error:', dbError?.message);
      return safeJsonResponse({ success: false, error: 'Database temporarily unavailable' }, 200);
    }

    const deletedIdea = await Idea.findOneAndDelete({ _id: id, userId: session.user.id });
    if (!deletedIdea) {
      return safeJsonResponse({ success: false, error: 'Idea not found or unauthorized' }, 404);
    }

    return safeJsonResponse({ success: true, data: {} });
  } catch (error) {
    console.error('[IDEA DELETE] Unhandled error:', error?.message || error);
    return safeJsonResponse({ success: false, error: 'Failed to delete idea. Please try again.' }, 200);
  }
}
