// GET /api/search?q=bitcoin
// Returns autocomplete results from CoinGecko

import { NextResponse } from 'next/server';
import { searchTokens } from '@/lib/api/coingecko';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchTokens(q);
    return NextResponse.json({ results });
  } catch (err) {
    console.error('[/api/search]', err.message);
    return NextResponse.json({ error: 'Search failed', results: [] }, { status: 500 });
  }
}
