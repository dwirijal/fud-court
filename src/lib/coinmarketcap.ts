'use server';

import type { CryptoData } from '@/types';

const COINMARKETCAP_API_BASE_URL = 'https://pro-api.coinmarketcap.com/v1';
const COINMARKETCAP_API_KEY = process.env.NEXT_PUBLIC_COINMARKETCAP_API_KEY;

interface CMCCrypto {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  num_market_pairs: number;
  date_added: string;
  tags: string[];
  max_supply: number | null;
  circulating_supply: number;
  total_supply: number;
  infinite_supply: boolean;
  platform: any | null; // Adjust type if needed
  cmc_rank: number;
  self_reported_circulating_supply: number | null;
  self_reported_market_cap: number | null;
  last_updated: string;
  quote: {
    USD: {
      price: number;
      volume_24h: number;
      volume_change_24h: number;
      percent_change_1h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      percent_change_30d: number;
      percent_change_60d: number;
      percent_change_90d: number;
      market_cap: number;
      market_cap_dominance: number;
      fully_diluted_market_cap: number;
      last_updated: string;
    };
  };
}

/**
 * Fetches top cryptocurrency data from CoinMarketCap API.
 * Requires a CoinMarketCap API key.
 * @param limit The number of coins to fetch.
 * @returns A promise that resolves to an array of CryptoData objects or null on failure.
 */
export async function getTopCoinsFromCoinMarketCap(limit: number = 20): Promise<CryptoData[] | null> {
  if (!COINMARKETCAP_API_KEY) {
    console.error('CoinMarketCap API Key is not set in environment variables.');
    return null;
  }

  try {
    const url = `${COINMARKETCAP_API_BASE_URL}/cryptocurrency/listings/latest?start=1&limit=${limit}&convert=USD`;
    const response = await fetch(url, {
      headers: {
        'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
      },
    });

    if (!response.ok) {
      console.error(`CoinMarketCap API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const result = await response.json();
    if (!result.data) {
      console.error('CoinMarketCap API returned no data.');
      return null;
    }

    const mappedData: CryptoData[] = result.data.map((coin: CMCCrypto) => ({
      id: coin.slug, // Using slug as ID, or you can use coin.symbol
      symbol: coin.symbol.toLowerCase(),
      name: coin.name,
      image: '', // CMC API doesn't provide image URLs directly from this endpoint
      current_price: coin.quote.USD.price,
      market_cap: coin.quote.USD.market_cap,
      market_cap_rank: coin.cmc_rank,
      total_volume: coin.quote.USD.volume_24h,
      high_24h: 0, // Not directly available from this endpoint
      low_24h: 0,  // Not directly available from this endpoint
      price_change_percentage_1h_in_currency: coin.quote.USD.percent_change_1h,
      price_change_percentage_24h_in_currency: coin.quote.USD.percent_change_24h,
      price_change_percentage_7d_in_currency: coin.quote.USD.percent_change_7d,
      sparkline_in_7d: null, // Not available directly
      ath: 0, // Not available directly
      ath_market_cap: null, // Not available directly
    }));

    return mappedData;

  } catch (error) {
    console.error('An error occurred while fetching top coins from CoinMarketCap:', error);
    return null;
  }
}
