
import type { MoralisTrendingToken } from '@/types';

const API_BASE_URL = 'https://deep-index.moralis.io/api/v2.2';

/**
 * Fetches the trending tokens from the Moralis API for a specific chain.
 * @param chain The blockchain to query, e.g., 'solana'.
 * @returns A promise that resolves to an array of MoralisTrendingToken objects.
 * @throws Will throw an error if the API request fails.
 */
export async function getTrendingTokens(chain: string = 'solana'): Promise<MoralisTrendingToken[]> {
  const apiKey = process.env.MORALIS_API_KEY;

  if (!apiKey) {
    throw new Error("Moralis API Key is not configured. Please set MORALIS_API_KEY in your environment variables.");
  }

  const url = `${API_BASE_URL}/tokens/trending?chain=${chain}`;
  
  try {
    const response = await fetch(url, {
      cache: 'no-store', // We are polling, so no cache
      headers: {
        'accept': 'application/json',
        'X-API-Key': apiKey,
      }
    });

    if (!response.ok) {
      // Throw an error with the status text, so the UI can catch and display it.
      const errorBody = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorBody.message || `Request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // The Moralis API might return the data in different structures.
    // We check for common patterns to be robust.
    if (Array.isArray(data?.result)) {
      return data.result;
    }
    if (Array.isArray(data?.tokens)) {
        return data.tokens;
    }
    if (Array.isArray(data)) {
        return data;
    }

    // If the structure is still unexpected, treat it as an error.
    console.warn("Unexpected data structure from Moralis trending tokens API:", data);
    throw new Error("Received an unexpected data format from the Moralis API.");

  } catch (error) {
    // Re-throw the error so the calling component can handle it.
    console.error("An error occurred while fetching from Moralis API:", error);
    throw error;
  }
}
