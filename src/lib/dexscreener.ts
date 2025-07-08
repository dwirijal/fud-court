
import type { BoostedToken, TokenProfile } from '@/types';

const API_BASE_URL = 'https://api.dexscreener.com';

/**
 * Fetches the latest boosted tokens from the DexScreener API.
 * @returns A promise that resolves to an array of BoostedToken objects.
 */
export async function getBoostedTokens(): Promise<BoostedToken[]> {
  const url = `${API_BASE_URL}/token-boosts/latest/v1`;
  
  try {
    const response = await fetch(url, { cache: 'no-store' }); // Disable caching for real-time data
    if (!response.ok) {
      console.error(`DexScreener API request failed with status: ${response.status}`);
      return [];
    }
    const data = await response.json();
    // Ensure we are returning the 'boosts' array, or an empty array if it's not present.
    // This prevents returning the whole data object if the 'boosts' key is missing.
    return Array.isArray(data.boosts) ? data.boosts : [];
  } catch (error) {
    console.error("An error occurred while fetching from DexScreener token-boosts API:", error);
    return [];
  }
}

/**
 * Fetches the latest token profiles from the DexScreener API.
 * @returns A promise that resolves to an array of TokenProfile objects.
 */
export async function getLatestTokenProfiles(): Promise<TokenProfile[]> {
  const url = `${API_BASE_URL}/token-profiles/latest/v1`;
  
  try {
    const response = await fetch(url, { cache: 'no-store' }); // Disable caching for real-time data
    if (!response.ok) {
      console.error(`DexScreener API request failed with status: ${response.status}`);
      return [];
    }
    const data = await response.json();
    // Ensure we are returning the 'tokenProfiles' array, or an empty array if it's not present.
    return Array.isArray(data.tokenProfiles) ? data.tokenProfiles : [];
  } catch (error) {
    console.error("An error occurred while fetching from DexScreener token-profiles API:", error);
    return [];
  }
}
