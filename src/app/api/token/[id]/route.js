// GET /api/token/[id]
// Returns full token data from CoinGecko

import { NextResponse } from 'next/server';
import { getTokenData, resolveContractAddress } from '@/lib/api/coingecko';
import { isContractAddress } from '@/lib/utils';

export async function GET(request, { params }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Token ID is required' }, { status: 400 });
  }

  try {
    let tokenId = decodeURIComponent(id);

    // If it looks like a contract address, resolve it first
    if (isContractAddress(tokenId)) {
      tokenId = await resolveContractAddress(tokenId);
    }

    const token = await getTokenData(tokenId);
    return NextResponse.json({ token });
  } catch (err) {
    console.error('[/api/token]', err.message);

    if (err.message.includes('404') || err.message.includes('not found')) {
      return NextResponse.json({ error: 'Token not found. Please check the name or address.' }, { status: 404 });
    }

    return NextResponse.json({ error: err.message || 'Failed to fetch token data' }, { status: 500 });
  }
}
