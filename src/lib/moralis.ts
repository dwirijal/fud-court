import type { MoralisTrendingToken } from '@/types';

const API_BASE_URL = 'https://deep-index.moralis.io/api/v2.2';

/**
 * Fetches the trending tokens from the Moralis API for a specific chain.
 * @param chain The blockchain to query, e.g., 'solana'.
 * @returns A promise that resolves to an array of MoralisTrendingToken objects.
 */
export async function getTrendingTokens(chain: string = 'solana'): Promise<MoralisTrendingToken[]> {
  const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImZmOWRiODg4LTg4ZjYtNDZkOS05MjEzLWY4YWFjODJiOGFjMyIsIm9yZ0lkIjoiNDU4MTU1IiwidXNlcklkIjoiNDcxMzYyIiwidHlwZUlkIjoiMTFjZWExNzMtZDkzYS00OGE1LWExYWYtMzk1OWRmYjQyNzBmIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NTE5NTI1MTgsImV4cCI6NDkwNzcxMjUxOH0.scYNT8_E_1ZihNgda8CEH8VQH5zJPVQpMIq4loKeYro';

  if (!apiKey) {
    console.error("Moralis API key is not configured. Please set MORALIS_API_KEY in your .env.local file.");
    // Return an empty array or throw an error to indicate misconfiguration.
    return [];
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
      console.error(`Moralis API request for trending tokens failed with status: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    
    // The API returns an object with a "tokens" key containing the array.
    if (Array.isArray(data?.tokens)) {
      return data.tokens;
    }

    console.warn("Unexpected data structure from Moralis trending tokens API:", data);
    return [];

  } catch (error) {
    console.error("An error occurred while fetching from Moralis API:", error);
    return [];
  }
}
