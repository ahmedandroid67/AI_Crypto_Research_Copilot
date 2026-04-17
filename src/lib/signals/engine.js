// ── Signal Engine ──────────────────────────────────────────────────
// Deterministic signal analysis — no AI, pure formulas.

/**
 * @typedef {Object} SignalResult
 * @property {number}   riskScore
 * @property {string[]} signals
 * @property {Object}   metrics
 * @property {number}   metrics.liquidityRatio
 * @property {number|null} metrics.realLiquidityUsd
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
 * @param {number|null} [data.realLiquidityUsd] - DexScreener real aggregated USD liquidity over pools
 * @returns {SignalResult}
 */
export function analyzeTokenSignals(data) {
  const { total_volume = 0, market_cap = 0, whaleConcentration = null, realLiquidityUsd = null } = data;

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

  // ── 2. Real Liquidity (On-Chain USD) or Volume Proxy ─────────────
  // If we successfully fetched real USD liquidity from DexScreener, we use hard tiers.
  const hasRealLiquidity = realLiquidityUsd !== null && realLiquidityUsd !== undefined;
  let liquidityRatio = volumeToMarketCap; // Fallback value

  if (hasRealLiquidity) {
    if (realLiquidityUsd < 50000) {
      signals.push('⚠️ Dangerously low on-chain liquidity (<$50K) — HIGH RISK');
      riskScore += 40;
    } else if (realLiquidityUsd < 500000) {
      signals.push('⚡ Moderate on-chain liquidity ($50K-$500K)');
      riskScore += 15;
    } else {
      signals.push('✅ Healthy on-chain liquidity (>$500K)');
    }
  } else {
    // Fallback: If no real liquidity exists (e.g., native coin, coin not on DEX, API error), use volume ratio proxy
    if (liquidityRatio < 0.02) {
      signals.push('⚠️ Very low liquidity proxy (Volume/MCap) — HIGH RISK');
      riskScore += 30;
    } else if (liquidityRatio < 0.1) {
      signals.push('⚡ Moderate liquidity proxy');
    } else {
      signals.push('✅ Healthy liquidity proxy');
    }
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
      realLiquidityUsd, // Pass to UI to know whether to display Real $ or the proxy
      liquidityRatio: parseFloat(liquidityRatio.toFixed(6)),
      volumeToMarketCap: parseFloat(volumeToMarketCap.toFixed(6)),
      whaleConcentration,
    },
  };
}
