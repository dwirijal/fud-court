
'use server';

import type { CryptoData, FearGreedData, MarketAnalysisInput, MarketStats, TopCoinForAnalysis, CombinedMarketData } from '@/types';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';
const CACHE_REVALIDATE_SECONDS = 300; // 5 minutes

/**
 * Fetches a list of top cryptocurrencies from the CoinGecko API.
 * @param limit The number of coins to fetch. Defaults to 100.
 * @param currency The target currency of the prices. Defaults to 'usd'.
 * @returns A promise that resolves to an array of CryptoData objects or null on failure.
 */
export async function getTopCoins(limit: number = 100, currency: string = 'usd'): Promise<CryptoData[] | null> {
    try {
        const url = `${API_BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true&price_change_percentage=1h,24h,7d`;
        const response = await fetch(url, { next: { revalidate: CACHE_REVALIDATE_SECONDS }});
        if (!response.ok) {
            console.error(`CoinGecko API error for getTopCoins: ${response.status} ${response.statusText}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('An error occurred while fetching top coins:', error);
        return null;
    }
}

/**
 * Fetches Fear & Greed data for today and 7 days ago.
 * @returns A promise resolving to an object with today's and last week's F&G data.
 */
export async function fetchFearGreedData(): Promise<{ today: FearGreedData | null, weekAgo: FearGreedData | null }> {
    try {
        const url = 'https://api.alternative.me/fng/?limit=8';
        const response = await fetch(url, { next: { revalidate: 3600 }}); // Revalidate F&G every hour
        if (!response.ok) {
            console.error(`Fear & Greed API error: ${response.status} ${response.statusText}`);
            return { today: null, weekAgo: null };
        }
        const result = await response.json();

        if (!result?.data || result.data.length === 0) {
            return { today: null, weekAgo: null };
        }
    
        const todayData = result.data[0];
        const weekAgoData = result.data.length > 7 ? result.data[7] : null;

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
        console.error('An error occurred while fetching Fear & Greed data:', error);
        return { today: null, weekAgo: null };
    }
}

/**
 * Fetches all necessary data for the market analysis and stats cards.
 * @returns A promise that resolves to a combined object of MarketAnalysisInput and MarketStats or null if failed.
 */
export async function fetchMarketData(): Promise<CombinedMarketData | null> {
    try {
        const globalDataPromise = fetch(`${API_BASE_URL}/global`, { next: { revalidate: CACHE_REVALIDATE_SECONDS }});
        const fearAndGreedPromise = fetchFearGreedData();
        const topCoinsPromise = getTopCoins(20, 'usd'); 

        const specificCoinIds = 'bitcoin,ethereum,solana,tether,usd-coin,dai,frax,ethena-usde';
        const specificCoinsPromise = fetch(`${API_BASE_URL}/coins/markets?vs_currency=usd&ids=${specificCoinIds}`, { next: { revalidate: CACHE_REVALIDATE_SECONDS }});
        
        const [
            globalDataResponse, 
            fearAndGreed, 
            topCoins, 
            specificCoinsResponse
        ] = await Promise.all([
            globalDataPromise,
            fearAndGreedPromise,
            topCoinsPromise,
            specificCoinsPromise,
        ]);

        if (!globalDataResponse.ok || !specificCoinsResponse.ok || !fearAndGreed.today || !topCoins) {
            console.error("Failed to fetch one or more necessary market data sources.");
            return null;
        }

        const globalData = await globalDataResponse.json();
        const specificCoins = await specificCoinsResponse.json();

        if (!globalData?.data || !specificCoins || specificCoins.length === 0) {
            console.error("Invalid data structure from market data sources.");
            return null;
        }

        const totalMarketCap = globalData.data.total_market_cap.usd;
        const maxHistoricalData = { cap: 2.9e12, date: '2021-11-10' };
        
        const getCoinData = (id: string) => specificCoins.find((c: any) => c.id === id);

        const btcData = getCoinData('bitcoin');
        const ethData = getCoinData('ethereum');
        const solData = getCoinData('solana');
        
        const stablecoinIds = ['tether', 'usd-coin', 'dai', 'frax', 'ethena-usde'];
        const stablecoinMarketCap = stablecoinIds.reduce((sum, id) => {
            const coin = getCoinData(id);
            return sum + (coin?.market_cap || 0);
        }, 0);

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
            maxHistoricalMarketCapDate: maxHistoricalData.date,
        };

    } catch (error) {
        console.error("Failed to fetch comprehensive market data:", error);
        return null;
    }
}
