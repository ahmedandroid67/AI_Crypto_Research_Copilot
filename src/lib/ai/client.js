// ── AI API Client ─────────────────────────────────────────────────
// OpenAI-compatible client. Works with OpenAI, Groq, or any
// endpoint that implements the /v1/chat/completions spec.

import { cacheGet, cacheSet } from '@/lib/cache';
import { CACHE_TTL } from '@/lib/constants';
import { buildAnalysisPrompt } from './prompts';

/**
 * Run AI analysis for a token.
 * Returns parsed JSON analysis object.
 *
 * @param {Object} tokenData - Full token data from CoinGecko
 * @returns {Promise<Object>} - Parsed AI analysis
 */
export async function analyzeToken(tokenData) {
  const cacheKey = `analysis:${tokenData.id}`;
  const cached = cacheGet(cacheKey);
  if (cached) return { ...cached, cached: true };

  const apiKey = process.env.AI_API_KEY;
  const apiUrl = process.env.AI_API_URL || 'https://api.openai.com/v1';
  const model = process.env.AI_MODEL || 'gpt-4o-mini';

  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error('AI_API_KEY is not configured. Please set it in .env.local');
  }

  const messages = buildAnalysisPrompt(tokenData);

  // Retry logic — up to 2 retries with exponential backoff
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(`${apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.3,     // Low temperature for consistent, factual output
          max_tokens: 1500,
          response_format: { type: 'json_object' }, // Force JSON output when supported
        }),
        signal: AbortSignal.timeout(30_000), // 30s timeout
      });

      if (!res.ok) {
        const errorBody = await res.text().catch(() => '');
        throw new Error(`AI API ${res.status}: ${errorBody}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) throw new Error('Empty response from AI API');

      // Parse and validate the JSON response
      let analysis;
      try {
        analysis = JSON.parse(content);
      } catch {
        // Try to extract JSON from a markdown code block if needed
        const match = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (match) {
          analysis = JSON.parse(match[1]);
        } else {
          throw new Error('AI response was not valid JSON');
        }
      }

      // Validate required fields
      validateAnalysis(analysis);

      cacheSet(cacheKey, analysis, CACHE_TTL.ANALYSIS);
      return { ...analysis, cached: false };

    } catch (err) {
      lastError = err;
      if (attempt < 3) {
        await sleep(attempt * 1000); // 1s, 2s between retries
      }
    }
  }

  throw lastError;
}

/**
 * Validate that the AI analysis has all required fields.
 * Throws if the structure is invalid.
 */
function validateAnalysis(analysis) {
  const required = ['summary', 'tokenomics', 'risk_score', 'sentiment', 'verdict'];
  for (const field of required) {
    if (!analysis[field]) {
      throw new Error(`AI response missing required field: ${field}`);
    }
  }
  const score = analysis.risk_score?.score;
  if (typeof score !== 'number' || score < 0 || score > 100) {
    throw new Error('AI risk_score.score must be a number between 0 and 100');
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
