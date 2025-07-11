
import type { MarketAnalysisInput } from '@/ai/flows/market-analysis-flow';
import type { CryptoData } from '@/types';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';

/**
 * Fetches a list of top cryptocurrencies from the CoinGecko API.
 * @param limit The number of coins to fetch. Defaults to 100.
 * @param currency The target currency of the prices. Defaults to 'usd'.
 * @returns A promise that resolves to an array of CryptoData objects.
 */
export async function getTopCoins(limit: number = 100, currency: string = 'usd'): Promise<CryptoData[]> {
  const url = `${API_BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true&price_change_percentage=1h,24h,7d`;
  
  try {
    const response = await fetch(url, {
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      console.error(`CoinGecko API request failed with status: ${response.status}`);
      return [];
    }
    
    const data: CryptoData[] = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred while fetching from CoinGecko API:", error);
    return [];
  }
}

/**
 * Fetches all necessary data for the market analysis flow. This version is more robust
 * and avoids relying on the large, potentially slow historical market chart endpoint.
 * @returns A promise that resolves to a MarketAnalysisInput object or null if failed.
 */
export async function fetchMarketData(): Promise<MarketAnalysisInput | null> {
    try {
        const globalDataPromise = fetch(`${API_BASE_URL}/global`, { next: { revalidate: 300 } }).then(res => res.json());
        const fearAndGreedPromise = fetch('https://api.alternative.me/fng/?limit=1', { next: { revalidate: 3600 } }).then(res => res.json());
        const topCoinsPromise = getTopCoins(100, 'usd'); 

        const [globalData, fearAndGreedData, topCoins] = await Promise.all([
            globalDataPromise,
            fearAndGreedPromise,
            topCoinsPromise,
        ]);

        if (!globalData?.data || !fearAndGreedData?.data?.[0] || topCoins.length === 0) {
            throw new Error("One or more essential API calls failed or returned empty data.");
        }
        
        // Calculate historical max market cap from the ATH market caps of top coins.
        // This is a proxy for the true historical max but more reliable to fetch.
        const maxHistoricalMarketCap = topCoins.reduce((max, coin) => Math.max(max, coin.ath_market_cap ?? 0), 0);

        // Since we don't have historical volume, we use current 24h volume as a stand-in for avg 30-day.
        // The analysis flow normalizes this, so the impact is managed.
        const avg30DayVolume = globalData.data.total_volume.usd;

        const totalMarketCap = globalData.data.total_market_cap.usd;
        const btcMarketCap = topCoins.find(c => c.id === 'bitcoin')?.market_cap ?? 0;
        
        const analysisInput: MarketAnalysisInput = {
            totalMarketCap,
            maxHistoricalMarketCap,
            totalVolume24h: globalData.data.total_volume.usd,
            avg30DayVolume,
            btcMarketCap,
            altcoinMarketCap: totalMarketCap - btcMarketCap,
            btcDominance: globalData.data.market_cap_percentage.btc,
            fearAndGreedIndex: parseInt(fearAndGreedData.data[0].value, 10),
            topCoins: topCoins.map(c => ({
                price_change_percentage_24h: c.price_change_percentage_24h_in_currency,
                ath: c.ath,
                current_price: c.current_price,
            })),
        };

        return analysisInput;

    } catch (error) {
        console.error("Failed to fetch comprehensive market data:", error);
        return null;
    }
}
