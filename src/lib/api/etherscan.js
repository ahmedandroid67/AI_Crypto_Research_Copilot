// ── Etherscan API Client ───────────────────────────────────────────
// Fetches on-chain holder data for ERC-20 tokens.

const ETHERSCAN_BASE = 'https://api.etherscan.io/api';

/**
 * Fetch top token holders from Etherscan.
 * Returns the whale concentration percentage (top-10 / total supply).
 *
 * NOTE: The "tokentx" + "tokenholderlist" endpoints are Pro-only on Etherscan.
 * This function tries the available endpoint and falls back gracefully.
 *
 * @param {string} contractAddress - ERC-20 contract address
 * @param {number} totalSupply     - Token total supply (from CoinGecko)
 * @returns {Promise<number|null>} - Whale concentration (0–100) or null
 */
export async function getWhaleConcentration(contractAddress, totalSupply) {
  const apiKey = process.env.ETHERSCAN_API_KEY;

  // Without an API key or contract address, we can't proceed
  if (!apiKey || !contractAddress) {
    return null;
  }

  try {
    const url = new URL(ETHERSCAN_BASE);
    url.searchParams.set('module', 'token');
    url.searchParams.set('action', 'tokenholderlist');
    url.searchParams.set('contractaddress', contractAddress);
    url.searchParams.set('page', '1');
    url.searchParams.set('offset', '10');
    url.searchParams.set('apikey', apiKey);

    const res = await fetch(url.toString(), {
      next: { revalidate: 0 },
    });

    if (!res.ok) return null;

    const data = await res.json();

    // Etherscan returns { status: "1", result: [...] } on success
    if (data.status !== '1' || !Array.isArray(data.result)) {
      return null;
    }

    const top10 = data.result.slice(0, 10);

    if (!totalSupply || totalSupply <= 0) return null;

    const top10Balance = top10.reduce((sum, holder) => {
      const balance = parseFloat(holder.TokenHolderQuantity || '0');
      return sum + balance;
    }, 0);

    const concentration = (top10Balance / totalSupply) * 100;

    // Sanity check
    if (concentration < 0 || concentration > 100) return null;

    return parseFloat(concentration.toFixed(2));
  } catch (err) {
    console.warn('[Etherscan] Failed to fetch holder data:', err.message);
    return null;
  }
}
