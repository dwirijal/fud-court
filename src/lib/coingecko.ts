
import type { CryptoData, FearGreedData, MarketAnalysisInput, MarketStats } from '@/types';

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
 * Fetches Fear & Greed data for today and 7 days ago.
 * @returns A promise resolving to an object with today's and last week's F&G data.
 */
export async function fetchFearGreedData(): Promise<{ today: FearGreedData | null, weekAgo: FearGreedData | null }> {
    try {
        const response = await fetch('https://api.alternative.me/fng/?limit=8', { next: { revalidate: 3600 } });
        if (!response.ok) {
            throw new Error('Failed to fetch Fear & Greed data');
        }
        const data = await response.json();

        if (!data?.data || data.data.length === 0) {
            return { today: null, weekAgo: null };
        }
        
        const todayData = data.data[0];
        const weekAgoData = data.data[7]; // The 8th item is from 7 days ago

        return {
            today: {
                value: parseInt(todayData.value, 10),
                value_classification: todayData.value_classification,
            },
            weekAgo: weekAgoData ? {
                value: parseInt(weekAgoData.value, 10),
                value_classification: weekAgoData.value_classification,
            } : null
        };
    } catch (error) {
        console.error("Failed to fetch Fear & Greed data:", error);
        return { today: null, weekAgo: null };
    }
}


/**
 * Fetches all necessary data for the market analysis and stats cards.
 * @returns A promise that resolves to a combined object of MarketAnalysisInput and MarketStats or null if failed.
 */
export async function fetchMarketData(): Promise<(MarketAnalysisInput & MarketStats) | null> {
    try {
        const globalDataPromise = fetch(`${API_BASE_URL}/global`, { next: { revalidate: 300 } }).then(res => res.json());
        const fearAndGreedPromise = fetchFearGreedData();
        // Fetch top 20 for analysis, plus stablecoins and specific tokens like SOL
        const specificCoinIds = 'bitcoin,ethereum,solana,tether,usd-coin';
        const topCoinsPromise = getTopCoins(20, 'usd'); 
        const specificCoinsPromise = fetch(`${API_BASE_URL}/coins/markets?vs_currency=usd&ids=${specificCoinIds}`, { next: { revalidate: 300 } }).then(res => res.json());

        const [globalData, fearAndGreed, topCoins, specificCoins] = await Promise.all([
            globalDataPromise,
            fearAndGreedPromise,
            topCoinsPromise,
            specificCoinsPromise,
        ]);
        
        if (!globalData?.data || !fearAndGreed.today || topCoins.length === 0 || specificCoins.length === 0) {
            throw new Error("Failed to fetch necessary market data.");
        }

        const totalMarketCap = globalData.data.total_market_cap.usd;
        const btcData = specificCoins.find((c: any) => c.id === 'bitcoin');
        const ethData = specificCoins.find((c: any) => c.id === 'ethereum');
        const solData = specificCoins.find((c: any) => c.id === 'solana');
        const usdtData = specificCoins.find((c: any) => c.id === 'tether');
        const usdcData = specificCoins.find((c: any) => c.id === 'usd-coin');
        
        const stablecoinMarketCap = (usdtData?.market_cap || 0) + (usdcData?.market_cap || 0);

        // Data for Analysis Flow
        const maxHistoricalMarketCap = topCoins.reduce((max, coin) => Math.max(max, coin.ath_market_cap ?? 0), 0);
        const avg30DayVolume = globalData.data.total_volume.usd;

        const analysisInput: MarketAnalysisInput = {
            totalMarketCap,
            maxHistoricalMarketCap,
            totalVolume24h: globalData.data.total_volume.usd,
            avg30DayVolume,
            btcDominance: globalData.data.market_cap_percentage.btc,
            fearAndGreedIndex: fearAndGreed.today.value,
            topCoins: topCoins.map(c => ({
                price_change_percentage_24h: c.price_change_percentage_24h_in_currency,
                ath: c.ath,
                current_price: c.current_price,
            })),
        };
        
        // Data for Stats Card
        const marketStats: MarketStats = {
            totalMarketCap,
            btcMarketCap: btcData?.market_cap || 0,
            ethMarketCap: ethData?.market_cap || 0,
            solMarketCap: solData?.market_cap || 0,
            stablecoinMarketCap,
            btcDominance: globalData.data.market_cap_percentage.btc,
            ethDominance: globalData.data.market_cap_percentage.eth,
            solDominance: solData ? (solData.market_cap / totalMarketCap) * 100 : 0,
            stablecoinDominance: (stablecoinMarketCap / totalMarketCap) * 100,
        };

        return { ...analysisInput, ...marketStats };

    } catch (error) {
        console.error("Failed to fetch comprehensive market data:", error);
        return null;
    }
}
