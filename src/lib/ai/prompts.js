// ── AI Prompt Templates ────────────────────────────────────────────

import { formatMarketCap, formatSupply, formatPrice, volMcapRatio } from '@/lib/utils';

/**
 * Build the structured analysis prompt for a given token.
 * Returns an array of OpenAI chat messages.
 *
 * @param {Object} token - Token data from CoinGecko
 * @returns {Array<{role: string, content: string}>}
 */
export function buildAnalysisPrompt(token) {
  const supplyRatio =
    token.circulatingSupply && token.maxSupply
      ? `${((token.circulatingSupply / token.maxSupply) * 100).toFixed(1)}% of max supply in circulation`
      : token.maxSupply === null
      ? 'Unlimited supply (no max cap)'
      : 'Max supply unknown';

  const athDistance = token.athChangePercent
    ? `${Math.abs(token.athChangePercent).toFixed(1)}% below ATH`
    : 'N/A';

  const systemPrompt = `You are a professional cryptocurrency analyst with expertise in tokenomics, on-chain metrics, and market dynamics. Your analysis is data-driven, objective, and critical — you never engage in hype or price speculation. You always highlight real risks and base conclusions on the provided data.`;

  const userPrompt = `Analyze the following cryptocurrency and return a structured JSON response.

## Token Data
- **Name**: ${token.name} (${token.symbol})
- **Market Cap Rank**: #${token.marketCapRank || 'Unranked'}
- **Current Price**: ${formatPrice(token.price)}
- **Market Cap**: ${formatMarketCap(token.marketCap)}
- **Fully Diluted Valuation**: ${formatMarketCap(token.fullyDilutedValuation)}
- **24h Volume**: ${formatMarketCap(token.volume24h)}
- **Volume/Market Cap Ratio**: ${volMcapRatio(token.volume24h, token.marketCap)}
- **24h Price Change**: ${token.priceChange24h?.toFixed(2) ?? 'N/A'}%
- **7d Price Change**: ${token.priceChange7d?.toFixed(2) ?? 'N/A'}%
- **30d Price Change**: ${token.priceChange30d?.toFixed(2) ?? 'N/A'}%
- **Circulating Supply**: ${formatSupply(token.circulatingSupply)}
- **Total Supply**: ${formatSupply(token.totalSupply) || 'N/A'}
- **Max Supply**: ${token.maxSupply ? formatSupply(token.maxSupply) : 'Unlimited'}
- **Supply Circulation**: ${supplyRatio}
- **All-Time High**: ${formatPrice(token.ath)} (${athDistance})
- **Categories**: ${token.categories?.join(', ') || 'N/A'}
${token.description ? `- **Description**: ${token.description.slice(0, 300)}` : ''}

## Required Output Format
Respond ONLY with valid JSON matching this exact schema (no markdown, no explanation outside JSON):

{
  "summary": "string — 2-3 sentence project overview: what it does, its market position, and notable characteristics",
  "tokenomics": {
    "analysis": "string — comprehensive tokenomics assessment covering supply dynamics, inflation risk, circulating vs total supply, FDV vs market cap, and token utility",
    "supply_health": "healthy | concerning | risky",
    "key_points": ["string", "string", "string"]
  },
  "risk_score": {
    "score": number,
    "level": "low | moderate | high | very_high",
    "factors": ["string — specific risk factor", "string", "string"]
  },
  "sentiment": {
    "direction": "bullish | bearish | neutral",
    "confidence": "low | medium | high",
    "reasoning": "string — 1-2 sentence explanation based on the data"
  },
  "verdict": {
    "recommendation": "string — 1-2 clear, actionable sentences",
    "time_horizon": "short_term | mid_term | long_term",
    "key_risk": "string — the single biggest risk to watch"
  }
}

Be critical and data-driven. The risk score must be between 0 and 100. Do not speculate or add hype.`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];
}
