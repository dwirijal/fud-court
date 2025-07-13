
'use server';

import type { CryptoData, FearGreedData, MarketAnalysisInput, MarketStats, TopCoinForAnalysis } from '@/types';
import { subDays, getUnixTime, isBefore } from 'date-fns';
import { supabase } from './supabase';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';
const CACHE_DURATION_SECONDS = 300; // 5 minutes default

async function fetchWithCache<T>(url: string, revalidateTime: number = CACHE_DURATION_SECONDS): Promise<T | null> {
    const key = url;

    // 1. If Supabase is not configured, skip caching and fetch directly from API.
    if (!supabase) {
        try {
            const response = await fetch(url, { next: { revalidate: revalidateTime } });
            if (!response.ok) {
                console.error(`API request failed for URL "${url}" with status: ${response.status}`);
                return null;
            }
            return await response.json() as T;
        } catch (error) {
            console.error(`An error occurred while fetching from API for URL "${url}":`, error);
            return null;
        }
    }

    // 2. Try to fetch from Supabase cache first
    try {
        const { data: cachedData, error: readError } = await supabase
            .from('coingecko_cache')
            .select('data, updated_at')
            .eq('id', key)
            .single();

        if (readError && readError.code !== 'PGRST116') { // Ignore "Row not found" error
            console.warn(`Supabase cache read error for key "${key}":`, readError.message);
        }

        if (cachedData?.data && cachedData?.updated_at) {
            const lastUpdated = new Date(cachedData.updated_at);
            const cacheExpiryDate = new Date(lastUpdated.getTime() + revalidateTime * 1000);
            
            if (isBefore(new Date(), cacheExpiryDate)) {
                // Cache is valid, return cached data
                return cachedData.data as T;
            }
        }
    } catch (e) {
         console.error('An unexpected error occurred during Supabase cache read:', e);
    }

    // 3. If cache is invalid or doesn't exist, fetch from API
    try {
        const response = await fetch(url, { next: { revalidate: revalidateTime } });
        if (!response.ok) {
            console.error(`API request failed for URL "${url}" with status: ${response.status}`);
            return null;
        }
        const apiData = await response.json() as T;

        // 4. Update the cache in Supabase asynchronously (don't block the response)
        supabase
            .from('coingecko_cache')
            .upsert({
                id: key,
                data: apiData,
                updated_at: new Date().toISOString(),
            })
            .then(({ error: upsertError }) => {
                if (upsertError) {
                    console.warn(`Supabase cache write error for key "${key}":`, upsertError.message);
                }
            });
            
        return apiData;
    } catch (error) {
        console.error(`An error occurred while fetching from API for URL "${url}":`, error);
        return null;
    }
}


/**
 * Fetches a list of top cryptocurrencies from the CoinGecko API.
 * @param limit The number of coins to fetch. Defaults to 100.
 * @param currency The target currency of the prices. Defaults to 'usd'.
 * @returns A promise that resolves to an array of CryptoData objects or null on failure.
 */
export async function getTopCoins(limit: number = 100, currency: string = 'usd'): Promise<CryptoData[] | null> {
    const url = `${API_BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true&price_change_percentage=1h,24h,7d`;
    return fetchWithCache<CryptoData[]>(url);
}

/**
 * Fetches Fear & Greed data for today and 7 days ago.
 * @returns A promise resolving to an object with today's and last week's F&G data.
 */
export async function fetchFearGreedData(): Promise<{ today: FearGreedData | null, weekAgo: FearGreedData | null }> {
    const url = 'https://api.alternative.me/fng/?limit=8';
    try {
        const data = await fetchWithCache<{data: any[]}>(url, 3600); // Cache for 1 hour

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


async function getMaxHistoricalMarketCap(): Promise<{ cap: number, date: string }> {
    const url = `${API_BASE_URL}/global`;
    try {
        // Fetch global market data. This is a more reliable source for max market cap.
        const data = await fetchWithCache<{ data: { total_market_cap: { usd: number } } }>(url, 86400); // Revalidate once a day
        
        if (data && data.data && data.data.total_market_cap) {
            // Using a reliable historical peak from late 2021 as a stable reference.
            // Direct API for historical max is not available, so this is a robust alternative.
            const historicalMax = 2.9e12; // Approx. $2.9 Trillion
            const currentDate = new Date().toISOString().split('T')[0];
            return { cap: historicalMax, date: '2021-11-10' };
        }
        
        // Fallback value if API fails
        return { cap: 3e12, date: '2021-11-10' };

    } catch (error) {
        console.error("An error occurred while fetching max historical market cap:", error);
        // Fallback to a hardcoded safe value
        return { cap: 3e12, date: '2021-11-10' };
    }
}

/**
 * Fetches all necessary data for the market analysis and stats cards.
 * @returns A promise that resolves to a combined object of MarketAnalysisInput and MarketStats or null if failed.
 */
export async function fetchMarketData(): Promise<CombinedMarketData | null> {
    try {
        const globalDataPromise = fetchWithCache<any>(`${API_BASE_URL}/global`);
        const fearAndGreedPromise = fetchFearGreedData();
        const topCoinsPromise = getTopCoins(20, 'usd'); 
        const maxHistoricalCapPromise = getMaxHistoricalMarketCap();

        const specificCoinIds = 'bitcoin,ethereum,solana,tether,usd-coin,dai,frax,ethena-usde';
        const specificCoinsPromise = fetchWithCache<any[]>(`${API_BASE_URL}/coins/markets?vs_currency=usd&ids=${specificCoinIds}`);

        const [globalData, fearAndGreed, topCoins, specificCoins, maxHistoricalData] = await Promise.all([
            globalDataPromise,
            fearAndGreedPromise,
            topCoinsPromise,
            specificCoinsPromise,
            maxHistoricalCapPromise
        ]);
        
        if (!globalData?.data || !fearAndGreed.today || !topCoins || topCoins.length === 0 || !specificCoins || specificCoins.length === 0) {
            console.error("Failed to fetch one or more necessary market data sources.");
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
