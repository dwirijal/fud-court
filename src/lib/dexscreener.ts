
import type { BoostedToken, TokenProfile } from '@/types';

const API_BASE_URL = 'https://api.dexscreener.com';

/**
 * Fetches the latest boosted tokens from the DexScreener API.
 * This function is now more robust and handles multiple possible response structures.
 * @returns A promise that resolves to an array of BoostedToken objects.
 */
export async function getBoostedTokens(): Promise<BoostedToken[]> {
  const url = `${API_BASE_URL}/token-boosts/latest/v1`;
  
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      console.error(`DexScreener API request for boosts failed with status: ${response.status}`);
      return [];
    }
    const data = await response.json();
    
    // The API might return { "boosts": [...] } or just [...]. We handle both.
    if (Array.isArray(data?.boosts)) {
      return data.boosts;
    }
    if (Array.isArray(data)) {
      return data;
    }

    // If the structure is unexpected, log it and return empty.
    console.warn("Unexpected data structure from DexScreener boosts API:", data);
    return [];

  } catch (error) {
    console.error("An error occurred while fetching from DexScreener token-boosts API:", error);
    return [];
  }
}

/**
 * Fetches the latest token profiles from the DexScreener API.
 * This function is now more robust and handles multiple possible response structures.
 * @returns A promise that resolves to an array of TokenProfile objects.
 */
export async function getLatestTokenProfiles(): Promise<TokenProfile[]> {
  const url = `${API_BASE_URL}/token-profiles/latest/v1`;
  
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      console.error(`DexScreener API request for profiles failed with status: ${response.status}`);
      return [];
    }
    const data = await response.json();
    
    // The API might return { "tokenProfiles": [...] } or just [...]. We handle both.
    if (Array.isArray(data?.tokenProfiles)) {
      return data.tokenProfiles;
    }
    if (Array.isArray(data)) {
      return data;
    }

    // If the structure is unexpected, log it and return empty.
    console.warn("Unexpected data structure from DexScreener profiles API:", data);
    return [];

  } catch (error) {
    console.error("An error occurred while fetching from DexScreener token-profiles API:", error);
    return [];
  }
}
