import type { CryptoData } from '@/types';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';

/**
 * Fetches a list of top cryptocurrencies from the CoinGecko API.
 * @param limit The number of coins to fetch. Defaults to 100.
 * @returns A promise that resolves to an array of CryptoData objects.
 */
export async function getTopCoins(limit: number = 100): Promise<CryptoData[]> {
  const url = `${API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true&price_change_percentage=24h`;
  
  try {
    // Using Next.js extended fetch for caching and revalidation
    const response = await fetch(url, {
      next: { revalidate: 300 } // Revalidate data every 5 minutes
    });

    if (!response.ok) {
      // Log the error for debugging purposes on the server
      console.error(`CoinGecko API request failed with status: ${response.status}`);
      // Return empty array to prevent crashing the page
      return [];
    }
    
    const data: CryptoData[] = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred while fetching from CoinGecko API:", error);
    return []; // Return empty array on fetch error
  }
}
