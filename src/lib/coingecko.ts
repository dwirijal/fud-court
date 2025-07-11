import type { CryptoData } from '@/types';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';

/**
 * Fetches a list of top cryptocurrencies from the CoinGecko API.
 * @param limit The number of coins to fetch. Defaults to 100.
 * @param currency The target currency of the prices. Defaults to 'usd'.
 * @returns A promise that resolves to an array of CryptoData objects.
 */
export async function getTopCoins(limit: number = 100, currency: string = 'usd'): Promise<CryptoData[]> {
  const url = `${API_BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=1h,24h,7d`;
  
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

/**
 * Fetches specific cryptocurrencies by their CoinGecko IDs and preserves the order.
 * @param ids An array of CoinGecko coin IDs.
 * @returns A promise that resolves to an array of CryptoData objects in the same order as the input IDs.
 */
export async function getCoinsByIds(ids: string[]): Promise<CryptoData[]> {
  if (ids.length === 0) {
    return [];
  }
  const url = `${API_BASE_URL}/coins/markets?vs_currency=usd&ids=${ids.join(',')}&sparkline=true&price_change_percentage=1h,24h,7d`;
  
  try {
    const response = await fetch(url, {
      next: { revalidate: 300 } // Revalidate data every 5 minutes
    });

    if (!response.ok) {
      console.error(`CoinGecko API request failed with status: ${response.status}, URL: ${url}`);
      return [];
    }
    
    const data: CryptoData[] = await response.json();
    
    // The API does not guarantee order, so we sort it based on the input 'ids' array.
    const sortedData = ids
      .map(id => data.find(coin => coin.id === id))
      .filter((coin): coin is CryptoData => !!coin);

    return sortedData;
  } catch (error) {
    console.error("An error occurred while fetching from CoinGecko API:", error);
    return [];
  }
}
