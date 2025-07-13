
'use server';

import type { CryptoData, FearGreedData, MarketAnalysisInput, MarketStats, TopCoinForAnalysis } from '@/types';
import { isBefore, sub } from 'date-fns';
import { supabase } from './supabase';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';
const CACHE_DURATION_SECONDS = 300; // 5 minutes default

async function fetchWithCache<T>(key: string, fetcher: () => Promise<T | null>, revalidateTime: number = CACHE_DURATION_SECONDS): Promise<T | null> {
    // 1. If Supabase is not configured, skip caching and fetch directly.
    if (!supabase) {
        try {
            return await fetcher();
        } catch (error) {
            console.error(`An error occurred while fetching from API (no cache) for key "${key}":`, error);
            return null;
        }
    }

    // 2. Try to fetch from Supabase cache first
    try {
        const { data: cachedResult, error: readError } = await supabase
            .from('coingecko_cache')
            .select('data, updated_at')
            .eq('id', key)
            .single();

        if (readError && readError.code !== 'PGRST116') { // Ignore "Row not found" error
            console.warn(`Supabase cache read error for key "${key}":`, readError.message);
        }

        if (cachedResult?.data && cachedResult?.updated_at) {
            const lastUpdated = new Date(cachedResult.updated_at);
            const cacheExpiryDate = sub(new Date(), { seconds: revalidateTime });
            
            if (isBefore(cacheExpiryDate, lastUpdated)) {
                // Cache is valid, return cached data
                return cachedResult.data as T;
            }
        }
    } catch (e) {
         console.error(`An unexpected error occurred during Supabase cache read for key "${key}":`, e);
    }

    // 3. If cache is invalid or doesn't exist, fetch from API
    let apiData: T | null = null;
    try {
        apiData = await fetcher();
    } catch (error) {
        console.error(`An error occurred while fetching from API for key "${key}":`, error);
        return null;
    }
    
    if (apiData === null) {
        return null; // Don't cache null responses
    }

    // 4. Update the cache in Supabase asynchronously (don't block the response)
    try {
        await supabase
            .from('coingecko_cache')
            .upsert({
                id: key,
                data: apiData,
                updated_at: new Date().toISOString(),
            });
    } catch(upsertError) {
        console.warn(`Supabase cache write error for key "${key}":`, upsertError);
    }
            
    return apiData;
}


/**
 * Fetches a list of top cryptocurrencies from the CoinGecko API.
 * @param limit The number of coins to fetch. Defaults to 100.
 * @param currency The target currency of the prices. Defaults to 'usd'.
 * @returns A promise that resolves to an array of CryptoData objects or null on failure.
 */
export async function getTopCoins(limit: number = 100, currency: string = 'usd'): Promise<CryptoData[] | null> {
    const key = `topCoins_${limit}_${currency}`;
    const fetcher = async () => {
        const url = `${API_BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true&price_change_percentage=1h,24h,7d`;
        const response = await fetch(url);
        if (!response.ok) return null;
        return response.json();
    };
    return fetchWithCache<CryptoData[]>(key, fetcher);
}

/**
 * Fetches Fear & Greed data for today and 7 days ago.
 * @returns A promise resolving to an object with today's and last week's F&G data.
 */
export async function fetchFearGreedData(): Promise<{ today: FearGreedData | null, weekAgo: FearGreedData | null }> {
    const key = 'fear_greed_index';
    const fetcher = async () => {
        const url = 'https://api.alternative.me/fng/?limit=8';
        const response = await fetch(url, { next: { revalidate: 3600 }}); // short revalidate time
        if (!response.ok) return null;
        return response.json();
    };

    const result = await fetchWithCache<{data: any[]}>(key, fetcher, 3600); // Cache for 1 hour

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
}


// Combine the input for analysis and stats into a single return type for fetchMarketData
export type CombinedMarketData = MarketAnalysisInput & MarketStats & {
    topCoinsForAnalysis: TopCoinForAnalysis[];
    maxHistoricalMarketCapDate: string;
};


/**
 * Fetches all necessary data for the market analysis and stats cards.
 * @returns A promise that resolves to a combined object of MarketAnalysisInput and MarketStats or null if failed.
 */
export async function fetchMarketData(): Promise<CombinedMarketData | null> {
    try {
        const globalDataPromise = fetchWithCache<any>('global_data', async () => {
            const response = await fetch(`${API_BASE_URL}/global`);
            if (!response.ok) return null;
            return response.json();
        });

        const fearAndGreedPromise = fetchFearGreedData();
        const topCoinsPromise = getTopCoins(20, 'usd'); 

        const specificCoinIds = 'bitcoin,ethereum,solana,tether,usd-coin,dai,frax,ethena-usde';
        const specificCoinsPromise = fetchWithCache<any[]>(`specific_coins_${specificCoinIds}`, async () => {
            const response = await fetch(`${API_BASE_URL}/coins/markets?vs_currency=usd&ids=${specificCoinIds}`);
            if (!response.ok) return null;
            return response.json();
        });
        
        const maxHistoricalData = { cap: 2.9e12, date: '2021-11-10' };

        const [globalData, fearAndGreed, topCoins, specificCoins] = await Promise.all([
            globalDataPromise,
            fearAndGreedPromise,
            topCoinsPromise,
            specificCoinsPromise,
        ]);
        
        if (!globalData?.data || !fearAndGreed.today || !topCoins || topCoins.length === 0 || !specificCoins || specificCoins.length === 0) {
            console.error("Failed to fetch one or more necessary market data sources.", { hasGlobal: !!globalData, hasFearGreed: !!fearAndGreed.today, hasTopCoins: !!topCoins, hasSpecific: !!specificCoins });
            return null;
        }

        const totalMarketCap = globalData.data.total_market_cap.usd;
        
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

export async function fetchBinancePrice(symbol: string): Promise<number | null> {
    const url = `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`;
    // Binance data is too volatile for caching, fetch directly.
    try {
        const response = await fetch(url, { next: { revalidate: 10 }}); // short revalidate time
        if (!response.ok) return null;
        const data = await response.json();
        return parseFloat(data.price);
    } catch (error) {
        console.error('Failed to fetch Binance price:', error);
        return null;
    }
}

    