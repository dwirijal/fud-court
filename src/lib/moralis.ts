
import type { MoralisTrendingToken } from '@/types';

const API_BASE_URL = 'https://deep-index.moralis.io/api/v2.2';

/**
 * Fetches the trending tokens from the Moralis API for a specific chain.
 * @param chain The blockchain to query, e.g., 'solana'.
 * @returns A promise that resolves to an array of MoralisTrendingToken objects.
 * @throws Will throw an error if the API request fails.
 */
export async function getTrendingTokens(chain: string = 'solana'): Promise<MoralisTrendingToken[]> {
  const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImZmOWRiODg4LTg4ZjYtNDZkOS05MjEzLWY4YWFjODJiOGFjMyIsIm9yZ0lkIjoiNDU4MTU1IiwidXNlcklkIjoiNDcxMzYyIiwidHlwZUlkIjoiMTFjZWExNzMtZDkzYS00OGE1LWExYWYtMzk1OWRmYjQyNzBmIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NTE5NTI1MTgsImV4cCI6NDkwNzcxMjUxOH0.scYNT8_E_1ZihNgda8CEH8VQH5zJPVQpMIq4loKeYro';

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
    
    // The API returns an object with a "result" key containing the array.
    if (Array.isArray(data?.result)) {
      return data.result;
    }

    // If the structure is unexpected, treat it as an error.
    console.warn("Unexpected data structure from Moralis trending tokens API:", data);
    throw new Error("Received an unexpected data format from the Moralis API.");

  } catch (error) {
    // Re-throw the error so the calling component can handle it.
    console.error("An error occurred while fetching from Moralis API:", error);
    throw error;
  }
}
