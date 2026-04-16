// GET /api/trending
// Returns trending tokens from CoinGecko

import { NextResponse } from 'next/server';
import { getTrendingTokens } from '@/lib/api/coingecko';

export async function GET() {
  try {
    const tokens = await getTrendingTokens();
    return NextResponse.json({ tokens });
  } catch (err) {
    console.error('[/api/trending]', err.message);
    return NextResponse.json({ error: 'Failed to fetch trending tokens', tokens: [] }, { status: 500 });
  }
}
