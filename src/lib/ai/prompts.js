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

  const systemPrompt = `You are a crypto analyst focused on risk detection and objective evaluation. Your analysis is data-driven, objective, and critical — you never engage in hype or price speculation. You always highlight real risks and base conclusions on the provided data. Do not invent facts.`;

  const userPrompt = `Analyze the following cryptocurrency project using ONLY the provided data.

## Token Data
- **Name**: \${token.name} (\${token.symbol})
- **Market Cap Rank**: #\${token.marketCapRank || 'Unranked'}
- **Current Price**: \${formatPrice(token.price)}
- **Market Cap**: \${formatMarketCap(token.marketCap)}
- **Fully Diluted Valuation**: \${formatMarketCap(token.fullyDilutedValuation)}
- **24h Volume**: \${formatMarketCap(token.volume24h)}
- **Volume/Market Cap Ratio**: \${volMcapRatio(token.volume24h, token.marketCap)}
- **24h Price Change**: \${token.priceChange24h?.toFixed(2) ?? 'N/A'}%
- **7d Price Change**: \${token.priceChange7d?.toFixed(2) ?? 'N/A'}%
- **30d Price Change**: \${token.priceChange30d?.toFixed(2) ?? 'N/A'}%
- **Circulating Supply**: \${formatSupply(token.circulatingSupply)}
- **Total Supply**: \${formatSupply(token.totalSupply) || 'N/A'}
- **Max Supply**: \${token.maxSupply ? formatSupply(token.maxSupply) : 'Unlimited'}
- **Supply Circulation**: \${supplyRatio}
- **All-Time High**: \${formatPrice(token.ath)} (\${athDistance})
- **Categories**: \${token.categories?.join(', ') || 'N/A'}
\${token.description ? `- **Description**: \${token.description.slice(0, 300)}` : ''}

## Task Instructions

1. PROJECT SUMMARY
- Explain in 2–3 simple sentences.
- Focus on utility (what problem it solves).

2. TOKENOMICS ANALYSIS
- Evaluate supply mechanics (inflation, scarcity).
- Comment on sustainability.
- Compare circulating vs total supply, FDV vs market cap.

3. RISK ANALYSIS
- Evaluate risks such as low liquidity, whale concentration, and speculative/hype-driven behavior.
- Assign a Risk Score (0 = very safe, 100 = extremely risky) and explain WHY clearly.

4. SENTIMENT
- Classify as Bullish, Neutral, or Bearish based on data, and provide a short justification.

5. FINAL VERDICT
- Provide one clear, direct sentence (no hype).

## Rules
- Be critical, not promotional.
- If data is missing for a specific point, say "insufficient data".
- Avoid generic statements.
- Prefer clear reasoning over long text.

## Required Output Format (STRICT JSON)
Respond ONLY with valid JSON matching this exact schema (no markdown, no explanation outside JSON):

{
  "summary": "string — 2-3 sentence project overview focusing on utility",
  "tokenomics": {
    "analysis": "string — tokenomics assessment covering supply mechanics and sustainability",
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
    "reasoning": "string — short justification"
  },
  "verdict": {
    "recommendation": "string — direct, honest 1-sentence verdict without hype",
    "time_horizon": "short_term | mid_term | long_term",
    "key_risk": "string — the single biggest risk to watch"
  }
}`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];
}
