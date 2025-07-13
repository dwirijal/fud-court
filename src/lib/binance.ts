'use server';

import type { CryptoData } from '@/types';

const BINANCE_API_BASE_URL = 'https://api.binance.com/api/v3';

interface BinanceTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

/**
 * Fetches top cryptocurrency data from Binance API.
 * Note: Binance API does not directly provide market cap or image URLs.
 * This function will fetch 24hr ticker data and attempt to map it to CryptoData.
 * Market cap and image will be placeholders or derived if possible.
 * @param limit The number of coins to fetch. Binance API doesn't have a direct 'top coins' concept like CoinGecko.
 *              We will fetch all and then sort/limit by volume or a similar metric.
 * @returns A promise that resolves to an array of CryptoData objects or null on failure.
 */
export async function getTopCoinsFromBinance(limit: number = 20): Promise<CryptoData[] | null> {
  try {
    const url = `${BINANCE_API_BASE_URL}/ticker/24hr`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Binance API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: BinanceTicker[] = await response.json();

    // Filter for USDT pairs and sort by quoteVolume (proxy for liquidity/popularity)
    const usdtPairs = data.filter(ticker => ticker.symbol.endsWith('USDT'));
    usdtPairs.sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume));

    const mappedData: CryptoData[] = usdtPairs.slice(0, limit).map((ticker) => {
      const symbol = ticker.symbol.replace('USDT', '').toLowerCase();
      const name = symbol.toUpperCase(); // Placeholder, Binance ticker doesn't provide full name

      return {
        id: symbol, // Use symbol as ID for now
        symbol: symbol,
        name: name,
        image: '', // Binance API doesn't provide image URLs directly
        current_price: parseFloat(ticker.lastPrice),
        market_cap: 0, // Binance ticker doesn't provide market cap directly
        market_cap_rank: 0, // Not available directly
        total_volume: parseFloat(ticker.volume), // Base asset volume
        high_24h: parseFloat(ticker.highPrice),
        low_24h: parseFloat(ticker.lowPrice),
        price_change_percentage_1h_in_currency: 0, // Not directly available
        price_change_percentage_24h_in_currency: parseFloat(ticker.priceChangePercent),
        price_change_percentage_7d_in_currency: 0, // Not directly available
        sparkline_in_7d: undefined, // Not available directly
        ath: 0, // Not available directly
        ath_market_cap: null, // Not available directly
      };
    });

    return mappedData;

  } catch (error) {
    console.error('An error occurred while fetching top coins from Binance:', error);
    return null;
  }
}