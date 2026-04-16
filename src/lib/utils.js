// ── Formatting Utilities ───────────────────────────────────────────

/**
 * Format a number as a compact currency string.
 * e.g. 1_234_567_890 → "$1.23B"
 */
export function formatMarketCap(value) {
  if (!value && value !== 0) return 'N/A';
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

/**
 * Format a token price — handles micro-cap coins with many decimal places.
 */
export function formatPrice(value) {
  if (!value && value !== 0) return 'N/A';
  if (value >= 1000) return `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  if (value >= 1) return `$${value.toFixed(4)}`;
  if (value >= 0.0001) return `$${value.toFixed(6)}`;
  return `$${value.toExponential(4)}`;
}

/**
 * Format token supply — compact notation.
 */
export function formatSupply(value) {
  if (!value && value !== 0) return 'N/A';
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  return value.toLocaleString();
}

/**
 * Format a percentage change, with + sign for positives.
 */
export function formatChange(value) {
  if (value === null || value === undefined) return 'N/A';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Return Tailwind text-color class based on numeric change.
 */
export function changeColor(value) {
  if (!value) return 'text-slate-400';
  return value >= 0 ? 'text-emerald-400' : 'text-red-400';
}

/**
 * Derive risk level object from a numeric score (0–100).
 */
export function getRiskLevel(score) {
  if (score <= 25) return { label: 'Low Risk', color: '#10b981', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
  if (score <= 50) return { label: 'Moderate Risk', color: '#f59e0b', text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
  if (score <= 75) return { label: 'High Risk', color: '#f97316', text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' };
  return { label: 'Very High Risk', color: '#ef4444', text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' };
}

/**
 * Truncate text with ellipsis.
 */
export function truncate(str, length = 60) {
  if (!str) return '';
  return str.length > length ? str.slice(0, length) + '…' : str;
}

/**
 * Format date to locale string.
 */
export function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

/**
 * Detect if a string looks like a contract address.
 */
export function isContractAddress(str) {
  return /^0x[a-fA-F0-9]{40}$/.test(str) || /^[A-Za-z0-9]{32,44}$/.test(str);
}

/**
 * Calculate volume-to-market-cap ratio. Used in AI prompt.
 */
export function volMcapRatio(volume, mcap) {
  if (!volume || !mcap) return 'N/A';
  return ((volume / mcap) * 100).toFixed(2) + '%';
}
