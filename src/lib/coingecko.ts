
'use server';

import type { CryptoData, FearGreedData, MarketAnalysisInput, MarketStats, TopCoinForAnalysis } from '@/types';
import { subDays, getUnixTime } from 'date-fns';

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


// Combine the input for analysis and stats into a single return type for fetchMarketData
export type CombinedMarketData = MarketAnalysisInput & MarketStats & {
    topCoinsForAnalysis: TopCoinForAnalysis[];
    maxHistoricalMarketCapDate: string;
};


async function getMaxHistoricalMarketCap(): Promise<{ cap: number, date: Date | null }> {
    const from = getUnixTime(subDays(new Date(), 2000)); // ~5.5 years ago
    const to = getUnixTime(new Date());

    try {
        const res = await fetch(`${API_BASE_URL}/coins/bitcoin/market_chart/range?vs_currency=usd&from=${from}&to=${to}`, {
            next: { revalidate: 86400 } // Revalidate once a day
        });

        // Return a default on failure instead of throwing an error
        if (!res.ok) {
            console.warn(`Failed to fetch historical market data. Status: ${res.status}. Falling back to default.`);
            return { cap: 3e12, date: new Date('2021-11-10T00:00:00.000Z') };
        }
        
        const data = await res.json();
        
        if (!data.market_caps || data.market_caps.length === 0) {
            console.warn("No historical market cap data found. Falling back to default.");
            return { cap: 3e12, date: new Date('2021-11-10T00:00:00.000Z') };
        }
        
        let maxCap = 0;
        let maxCapTimestamp = 0;
        
        for (const [timestamp, cap] of data.market_caps) {
            if (cap > maxCap) {
                maxCap = cap;
                maxCapTimestamp = timestamp;
            }
        }
        
        // This is an estimation. The true total market cap is ~2x Bitcoin's on average.
        // This is a reasonable proxy since a direct historical total_market_cap endpoint is not available on the free tier.
        const estimatedTotalMaxCap = maxCap * 2; 

        return {
            cap: estimatedTotalMaxCap,
            date: new Date(maxCapTimestamp)
        };
    } catch (error) {
        console.error("An error occurred while fetching max historical market cap:", error);
        // Return a sensible default on error to prevent crashes.
        return { cap: 3e12, date: new Date('2021-11-10T00:00:00.000Z') };
    }
}

/**
 * Fetches all necessary data for the market analysis and stats cards.
 * @returns A promise that resolves to a combined object of MarketAnalysisInput and MarketStats or null if failed.
 */
export async function fetchMarketData(): Promise<CombinedMarketData | null> {
    try {
        const globalDataPromise = fetch(`${API_BASE_URL}/global`, { next: { revalidate: 300 } }).then(res => res.json());
        const fearAndGreedPromise = fetchFearGreedData();
        const topCoinsPromise = getTopCoins(20, 'usd'); 
        const maxHistoricalCapPromise = getMaxHistoricalMarketCap();

        // Expand the list to include more stablecoins
        const specificCoinIds = 'bitcoin,ethereum,solana,tether,usd-coin,dai,frax,ethena-usde';
        const specificCoinsPromise = fetch(`${API_BASE_URL}/coins/markets?vs_currency=usd&ids=${specificCoinIds}`, { next: { revalidate: 300 } }).then(res => res.json());

        const [globalData, fearAndGreed, topCoins, specificCoins, maxHistoricalData] = await Promise.all([
            globalDataPromise,
            fearAndGreedPromise,
            topCoinsPromise,
            specificCoinsPromise,
            maxHistoricalCapPromise
        ]);
        
        if (!globalData?.data || !fearAndGreed.today || topCoins.length === 0 || specificCoins.length === 0) {
            throw new Error("Failed to fetch necessary market data.");
        }

        const totalMarketCap = globalData.data.total_market_cap.usd;
        
        const getCoinData = (id: string) => specificCoins.find((c: any) => c.id === id);

        const btcData = getCoinData('bitcoin');
        const ethData = getCoinData('ethereum');
        const solData = getCoinData('solana');
        
        // Sum market caps of all fetched stablecoins
        const stablecoinIds = ['tether', 'usd-coin', 'dai', 'frax', 'ethena-usde'];
        const stablecoinMarketCap = stablecoinIds.reduce((sum, id) => {
            const coin = getCoinData(id);
            return sum + (coin?.market_cap || 0);
        }, 0);

        // Data for Analysis Flow
        const avg30DayVolume = globalData.data.total_volume.usd;

        const analysisInput: MarketAnalysisInput = {
            totalMarketCap,
            maxHistoricalMarketCap: maxHistoricalData.cap,
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
            maxHistoricalMarketCap: maxHistoricalData.cap
        };

        // Extra data for UI display
        const topCoinsForAnalysis: TopCoinForAnalysis[] = topCoins.map(c => ({
            name: c.name,
            symbol: c.symbol,
            current_price: c.current_price,
            ath: c.ath,
            price_change_percentage_24h: c.price_change_percentage_24h_in_currency ?? null,
        }));

        return { 
            ...analysisInput,
            ...marketStats,
            topCoinsForAnalysis,
            maxHistoricalMarketCap: maxHistoricalData.cap,
            maxHistoricalMarketCapDate: maxHistoricalData.date ? maxHistoricalData.date.toISOString().split('T')[0] : 'N/A'
        };

    } catch (error) {
        console.error("Failed to fetch comprehensive market data:", error);
        return null;
    }
}
