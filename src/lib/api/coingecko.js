// ── CoinGecko API Client ───────────────────────────────────────────
// All CoinGecko requests are server-side only (API key stays private).

import { cacheGet, cacheSet } from '@/lib/cache';
import { COINGECKO_BASE, CACHE_TTL } from '@/lib/constants';

/** Build request headers — add key header if Pro key is configured */
function buildHeaders() {
  const headers = { Accept: 'application/json' };
  if (process.env.COINGECKO_API_KEY) {
    headers['x-cg-demo-api-key'] = process.env.COINGECKO_API_KEY;
  }
  return headers;
}

/**
 * Generic fetch with error handling.
 * @param {string} path - CoinGecko API path
 * @param {Record<string, string>} params - Query parameters
 */
async function cgFetch(path, params = {}) {
  const url = new URL(`${COINGECKO_BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: buildHeaders(),
    next: { revalidate: 0 }, // We handle caching ourselves
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Unknown error');
    throw new Error(`CoinGecko ${res.status}: ${errorText}`);
  }

  return res.json();
}

// ── Public API Functions ──────────────────────────────────────────

/**
 * Search tokens by name or symbol.
 * @param {string} query
 */
export async function searchTokens(query) {
  const cacheKey = `search:${query.toLowerCase()}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const data = await cgFetch('/search', { query });
  const result = (data.coins || []).slice(0, 10).map((c) => ({
    id: c.id,
    name: c.name,
    symbol: c.symbol?.toUpperCase(),
    thumb: c.thumb,
    marketCapRank: c.market_cap_rank,
  }));

  cacheSet(cacheKey, result, CACHE_TTL.SEARCH);
  return result;
}

/**
 * Fetch full token data including market info.
 * @param {string} id - CoinGecko token ID (e.g. "bitcoin")
 */
export async function getTokenData(id) {
  const cacheKey = `token:${id}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const data = await cgFetch(`/coins/${id}`, {
    localization: 'false',
    tickers: 'false',
    community_data: 'false',
    developer_data: 'false',
    sparkline: 'true',
  });

  const md = data.market_data || {};

  const result = {
    id: data.id,
    name: data.name,
    symbol: data.symbol?.toUpperCase(),
    image: data.image?.large || data.image?.small,
    description: data.description?.en?.replace(/<[^>]*>/g, '').slice(0, 500) || '',
    categories: data.categories?.slice(0, 4) || [],
    marketCapRank: md.market_cap_rank || data.market_cap_rank,

    // Price
    price: md.current_price?.usd,
    priceChange24h: md.price_change_percentage_24h,
    priceChange7d: md.price_change_percentage_7d,
    priceChange30d: md.price_change_percentage_30d,
    ath: md.ath?.usd,
    athDate: md.ath_date?.usd,
    athChangePercent: md.ath_change_percentage?.usd,
    atl: md.atl?.usd,
    atlDate: md.atl_date?.usd,

    // Market
    marketCap: md.market_cap?.usd,
    fullyDilutedValuation: md.fully_diluted_valuation?.usd,
    volume24h: md.total_volume?.usd,

    // Supply
    circulatingSupply: md.circulating_supply,
    totalSupply: md.total_supply,
    maxSupply: md.max_supply,

    // Sparkline (7-day)
    sparkline: md.sparkline_7d?.price || [],

    // Contract address for DEX screener/Etherscan
    contractAddress: data.platforms ? Object.values(data.platforms).find(addr => addr && addr.trim().length > 0) || null : null,

    // Timestamps
    genesisDate: data.genesis_date,
    lastUpdated: data.last_updated,
  };

  cacheSet(cacheKey, result, CACHE_TTL.TOKEN);
  return result;
}

/**
 * Fetch 30-day price chart data.
 * @param {string} id - CoinGecko token ID
 * @param {number} days - Number of days (default 30)
 */
export async function getTokenChart(id, days = 30) {
  const cacheKey = `chart:${id}:${days}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const data = await cgFetch(`/coins/${id}/market_chart`, {
    vs_currency: 'usd',
    days: String(days),
    interval: days <= 1 ? 'hourly' : 'daily',
  });

  // data.prices is [[timestamp, price], ...]
  const result = (data.prices || []).map(([ts, price]) => ({
    date: new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price: parseFloat(price.toFixed(price >= 1 ? 4 : 8)),
    timestamp: ts,
  }));

  cacheSet(cacheKey, result, CACHE_TTL.CHART);
  return result;
}

/**
 * Fetch currently trending tokens (top 15 on CoinGecko).
 */
export async function getTrendingTokens() {
  const cacheKey = 'trending';
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const data = await cgFetch('/search/trending');

  const result = (data.coins || []).slice(0, 12).map((entry) => {
    const c = entry.item;
    return {
      id: c.id,
      name: c.name,
      symbol: c.symbol?.toUpperCase(),
      thumb: c.small,
      marketCapRank: c.market_cap_rank,
      priceChange24h: c.data?.price_change_percentage_24h?.usd || null,
      price: c.data?.price || null,
    };
  });

  cacheSet(cacheKey, result, CACHE_TTL.TRENDING);
  return result;
}

/**
 * Resolve a contract address to a CoinGecko coin ID.
 * Tries Ethereum first, then falls back to a general search.
 * @param {string} address
 */
export async function resolveContractAddress(address) {
  // Try common platforms
  const platforms = ['ethereum', 'binance-smart-chain', 'polygon-pos', 'solana'];
  for (const platform of platforms) {
    try {
      const data = await cgFetch(`/coins/${platform}/contract/${address}`);
      if (data?.id) return data.id;
    } catch {
      // Not on this platform, try next
    }
  }
  throw new Error('Contract address not found on supported chains (ETH, BSC, Polygon, Solana)');
}
