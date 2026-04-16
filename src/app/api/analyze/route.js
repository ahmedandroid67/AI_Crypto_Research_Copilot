// POST /api/analyze
// Runs AI analysis on a token. Accepts tokenId or full token object.

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getTokenData } from '@/lib/api/coingecko';
import { analyzeToken } from '@/lib/ai/client';

export async function POST(request) {
  const { userId, sessionClaims } = await auth();

  // If you want to require login to use the AI:
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in to analyze tokens.' }, { status: 401 });
  }

  // Example: Enforce Pro plan for certain actions
  // const isPro = sessionClaims?.metadata?.plan === 'pro';

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { tokenId, tokenData } = body;

  if (!tokenId && !tokenData) {
    return NextResponse.json({ error: 'tokenId or tokenData is required' }, { status: 400 });
  }

  try {
    // Use provided tokenData or fetch fresh
    const token = tokenData || (await getTokenData(tokenId));

    const analysis = await analyzeToken(token);
    return NextResponse.json({ analysis, token });
  } catch (err) {
    console.error('[/api/analyze]', err.message);

    // Provide more specific error messages
    if (err.message.includes('AI_API_KEY')) {
      return NextResponse.json({ error: 'AI API key not configured. Please set AI_API_KEY in .env.local' }, { status: 503 });
    }
    if (err.message.includes('AI API 429')) {
      return NextResponse.json({ error: 'AI API rate limit reached. Please try again in a moment.' }, { status: 429 });
    }
    if (err.message.includes('timeout') || err.message.includes('AbortError')) {
      return NextResponse.json({ error: 'AI analysis timed out. Please try again.' }, { status: 504 });
    }

    return NextResponse.json({ error: err.message || 'AI analysis failed' }, { status: 500 });
  }
}
