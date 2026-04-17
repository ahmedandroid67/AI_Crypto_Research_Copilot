// ── Signal Engine ──────────────────────────────────────────────────
// Deterministic signal analysis — no AI, pure formulas.

/**
 * @typedef {Object} SignalResult
 * @property {number}   riskScore
 * @property {string[]} signals
 * @property {Object}   metrics
 * @property {number}   metrics.liquidityRatio
 * @property {number}   metrics.volumeToMarketCap
 * @property {number|null} metrics.whaleConcentration
 */

/**
 * Analyze token data and produce deterministic risk signals.
 *
 * @param {Object} data
 * @param {number} data.total_volume   - 24h trading volume (USD)
 * @param {number} data.market_cap     - Market cap (USD)
 * @param {number|null} [data.whaleConcentration] - Top-10 holders % (0–100), null if unavailable
 * @returns {SignalResult}
 */
export function analyzeTokenSignals(data) {
  const { total_volume = 0, market_cap = 0, whaleConcentration = null } = data;

  const signals = [];
  let riskScore = 0;

  // ── 1. Volume / Market Cap Ratio ──────────────────────────────────
  const volumeToMarketCap = market_cap > 0 ? total_volume / market_cap : 0;

  if (volumeToMarketCap > 0.5) {
    signals.push('🔥 High trading activity (possible hype or breakout)');
  }
  if (volumeToMarketCap < 0.05) {
    signals.push('📉 Low market activity');
  }

  // ── 2. Liquidity Proxy ────────────────────────────────────────────
  const liquidityRatio = volumeToMarketCap; // same formula, different risk bands

  if (liquidityRatio < 0.02) {
    signals.push('⚠️ Very low liquidity — HIGH RISK');
    riskScore += 30;
  } else if (liquidityRatio < 0.1) {
    signals.push('⚡ Moderate liquidity');
  } else {
    signals.push('✅ Healthy liquidity');
  }

  // ── 3. Whale Concentration ────────────────────────────────────────
  if (whaleConcentration !== null && whaleConcentration !== undefined) {
    if (whaleConcentration > 50) {
      signals.push('🐋 High whale concentration (>50% held by top 10)');
      riskScore += 30;
    } else if (whaleConcentration >= 30) {
      signals.push('🐋 Moderate whale concentration (30–50%)');
    } else {
      signals.push('👥 Healthy token distribution (<30% top holders)');
    }
  } else {
    signals.push('📊 Whale concentration data unavailable');
  }

  // ── 4. Additional Volume Risk Adjustments ─────────────────────────
  if (volumeToMarketCap > 0.7) {
    signals.push('🚨 Unusual trading volume spike');
    riskScore += 20;
  }
  if (volumeToMarketCap < 0.03) {
    riskScore += 10;
  }

  // ── 5. Clamp ──────────────────────────────────────────────────────
  riskScore = Math.min(riskScore, 100);

  return {
    riskScore,
    signals,
    metrics: {
      liquidityRatio: parseFloat(liquidityRatio.toFixed(6)),
      volumeToMarketCap: parseFloat(volumeToMarketCap.toFixed(6)),
      whaleConcentration,
    },
  };
}
