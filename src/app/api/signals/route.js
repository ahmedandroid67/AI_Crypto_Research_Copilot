// ── Signals API Route ──────────────────────────────────────────────
// POST /api/signals  { tokenId: "bitcoin" }
// Returns deterministic signal analysis for a token.

import { getTokenData } from '@/lib/api/coingecko';
import { getWhaleConcentration } from '@/lib/api/etherscan';
import { analyzeTokenSignals } from '@/lib/signals/engine';

export async function POST(request) {
  try {
    const body = await request.json();
    const { tokenId } = body;

    if (!tokenId || typeof tokenId !== 'string') {
      return Response.json(
        { error: 'Missing or invalid "tokenId" parameter.' },
        { status: 400 }
      );
    }

    // ── Fetch token data from CoinGecko ───────────────────────────
    let tokenData;
    try {
      tokenData = await getTokenData(tokenId.toLowerCase().trim());
    } catch (err) {
      return Response.json(
        { error: `Token "${tokenId}" not found. Try using the CoinGecko ID (e.g. "bitcoin", "ethereum").` },
        { status: 404 }
      );
    }

    // ── Try Etherscan for whale data (non-blocking) ───────────────
    let whaleConcentration = null;
    // We'd need the contract address — CoinGecko often provides it
    // For now, this is a best-effort lookup
    try {
      // Only attempt for ERC-20 tokens (not BTC, etc.)
      if (tokenData.id && tokenData.id !== 'bitcoin' && tokenData.id !== 'ethereum') {
        // You could extend getTokenData to expose platforms.ethereum contract address
        // For now, whale data falls back to null gracefully
        whaleConcentration = null;
      }
    } catch {
      // Fallback silently
    }

    // ── Run signal engine ─────────────────────────────────────────
    const signalInput = {
      total_volume: tokenData.volume24h || 0,
      market_cap: tokenData.marketCap || 0,
      whaleConcentration,
    };

    const result = analyzeTokenSignals(signalInput);

    return Response.json({
      token: {
        id: tokenData.id,
        name: tokenData.name,
        symbol: tokenData.symbol,
        image: tokenData.image,
        price: tokenData.price,
        priceChange24h: tokenData.priceChange24h,
        marketCap: tokenData.marketCap,
        volume24h: tokenData.volume24h,
        circulatingSupply: tokenData.circulatingSupply,
        totalSupply: tokenData.totalSupply,
      },
      analysis: result,
    });
  } catch (err) {
    console.error('[Signals API]', err);
    return Response.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
