import { cacheGet, cacheSet } from '@/lib/cache';

const DEXSCREENER_BASE = 'https://api.dexscreener.com/latest/dex';

/**
 * Fetch real aggregate USD liquidity from DexScreener for a specific token contract address.
 * 
 * @param {string} contractAddress - Token contract address
 * @returns {Promise<number|null>} Total USD liquidity across all pools, or null if failed/not found
 */
export async function getRealLiquidity(contractAddress) {
  if (!contractAddress) return null;

  const cacheKey = `dexscreener:${contractAddress.toLowerCase()}`;
  const cached = cacheGet(cacheKey);
  if (cached !== undefined) return cached; // Can be a number or null

  try {
    const url = `${DEXSCREENER_BASE}/tokens/${contractAddress}`;
    const res = await fetch(url, {
      next: { revalidate: 0 },
    });

    if (!res.ok) {
        throw new Error(`DexScreener API error: ${res.status}`);
    }

    const data = await res.json();
    
    // Determine the sum of USD liquidity across all pairs that have the liquidity property
    if (!data.pairs || !Array.isArray(data.pairs) || data.pairs.length === 0) {
      cacheSet(cacheKey, null, 300); // cache misses for 5 minutes
      return null;
    }

    // Aggregate liquidity
    const totalUsdLiquidity = data.pairs.reduce((sum, pair) => {
        const poolUsd = pair.liquidity?.usd || 0;
        return sum + poolUsd;
    }, 0);

    const safeLiquidity = parseFloat(totalUsdLiquidity.toFixed(2));
    cacheSet(cacheKey, safeLiquidity, 300); // 5 minutes TTL
    return safeLiquidity;

  } catch (err) {
    console.warn(`[DexScreener] Failed to fetch liquidity for ${contractAddress}:`, err.message);
    // Don't cache on actual fetch error, return null to fallback
    return null;
  }
}
