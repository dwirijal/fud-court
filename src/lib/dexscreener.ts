
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
    // The API might return the array directly, or nested under a 'boosts' property.
    // This handles both cases and ensures data is parsed correctly.
    return (data.boosts || data) || [];
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
    // The API might return the array directly, or nested under a 'tokenProfiles' property.
    // This handles both cases and ensures data is parsed correctly.
    return (data.tokenProfiles || data) || [];
  } catch (error) {
    console.error("An error occurred while fetching from DexScreener token-profiles API:", error);
    return [];
  }
}
