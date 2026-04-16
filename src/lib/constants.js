// ── Constants ──────────────────────────────────────────────────────
// App-wide constants for API endpoints, cache TTLs, and config

/** CoinGecko API base URL */
export const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

/** Cache TTLs in seconds */
export const CACHE_TTL = {
  SEARCH: 600,       // 10 min
  TOKEN: 300,        // 5 min
  ANALYSIS: 900,     // 15 min
  TRENDING: 600,     // 10 min
  CHART: 300,        // 5 min
};

/** Risk level thresholds */
export const RISK_LEVELS = {
  LOW: { max: 25, label: 'Low', color: '#10b981', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  MODERATE: { max: 50, label: 'Moderate', color: '#f59e0b', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  HIGH: { max: 75, label: 'High', color: '#f97316', bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
  VERY_HIGH: { max: 100, label: 'Very High', color: '#ef4444', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
};

/** Sentiment colours */
export const SENTIMENT_CONFIG = {
  bullish: { label: 'Bullish', color: '#10b981', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', emoji: '🐂' },
  bearish: { label: 'Bearish', color: '#ef4444', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', emoji: '🐻' },
  neutral: { label: 'Neutral', color: '#f59e0b', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', emoji: '⚖️' },
};

/** Number of recent searches to persist */
export const MAX_HISTORY = 8;
