'use server';

import type { CryptoData, FearGreedData, MarketAnalysisInput, MarketStats, TopCoinForAnalysis, CombinedMarketData, CGMarket, DetailedCoinData } from '@/types';
import { supabase } from './supabase'; // Import Supabase client
import { getTopCoinsFromBinance } from './binance'; // Import Binance fallback
import { getTopCoinsFromCoinMarketCap } from './coinmarketcap'; // Import CoinMarketCap fallback

const API_BASE_URL = 'https://api.coingecko.com/api/v3';
const CACHE_DURATION_SECONDS = 300; // 5 minutes for crypto data

/**
 * Fetches a list of top cryptocurrencies from the CoinGecko API using direct fetch.
 * @param limit The number of coins to fetch. Defaults to 100.
 * @param currency The target currency of the prices. Defaults to 'usd'.
 * @returns A promise that resolves to an array of CryptoData objects or null on failure.
 */
export async function getTopCoins(limit: number = 100, currency: string = 'usd'): Promise<CryptoData[] | null> {
    try {
        // 1. Try to fetch from Supabase cache
        const { data: cachedData, error: cacheError } = await supabase
            .from('crypto_data')
            .select('*')
            .order('market_cap_rank', { ascending: true })
            .limit(limit);

        if (cachedData && cachedData.length > 0) {
            const lastUpdated = new Date(cachedData[0].last_updated).getTime();
            const now = new Date().getTime();
            if ((now - lastUpdated) / 1000 < CACHE_DURATION_SECONDS) {
                console.log('Serving top coins from Supabase cache.');
                return cachedData as CryptoData[];
            }
        }

        if (cacheError) {
            console.error('Supabase cache read error:', cacheError);
        }

        // 2. If cache is stale or empty, fetch from CoinGecko
        console.log('Fetching top coins from CoinGecko API.');
        const url = `${API_BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true&price_change_percentage=1h,24h,7d`;
        const response = await fetch(url, { next: { revalidate: 300 }}); // Keep Next.js revalidate for initial fetch

        if (!response.ok) {
            console.error(`CoinGecko API error for getTopCoins: ${response.status} ${response.statusText}`);
            
            // If CoinGecko fails, try CoinMarketCap as fallback
            console.warn('CoinGecko API failed, attempting to fetch from CoinMarketCap as fallback.');
            const cmcData = await getTopCoinsFromCoinMarketCap(limit);
            if (cmcData) {
                console.log('Successfully fetched data from CoinMarketCap fallback.');
                return cmcData;
            }

            // If CoinMarketCap also fails, try Binance as fallback
            console.warn('CoinMarketCap fallback also failed, attempting to fetch from Binance as fallback.');
            const binanceData = await getTopCoinsFromBinance(limit);
            if (binanceData) {
                console.log('Successfully fetched data from Binance fallback.');
                return binanceData;
            } else if (cachedData && cachedData.length > 0) {
                console.warn('Binance fallback also failed, serving stale data from Supabase cache.');
                return cachedData as CryptoData[];
            }
            return null;
        }

        const data: CGMarket[] = await response.json();

        const mappedData: CryptoData[] = data.map((coin) => ({
            id: coin.id ?? '',
            symbol: coin.symbol ?? '',
            name: coin.name ?? '',
            image: coin.image ?? '',
            current_price: coin.current_price ?? 0,
            market_cap: coin.market_cap ?? 0,
            market_cap_rank: coin.market_cap_rank ?? 0,
            total_volume: coin.total_volume ?? 0,
            high_24h: coin.high_24h ?? 0,
            low_24h: coin.low_24h ?? 0,
            price_change_percentage_1h_in_currency: coin.price_change_percentage_1h_in_currency ?? 0,
            price_change_percentage_24h_in_currency: coin.price_change_percentage_24h_in_currency ?? 0,
            price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency ?? 0,
            sparkline_in_7d: coin.sparkline_in_7d,
            ath: coin.ath ?? 0,
            ath_market_cap: coin.ath_market_cap ?? null,
        }));
        
        // 3. Store/Update cache in Supabase using upsert for efficiency
        const { error: upsertError } = await supabase.from('crypto_data').upsert(mappedData, { onConflict: 'id' });
        if (upsertError) {
            console.error('Error upserting crypto_data into cache:', upsertError.message || upsertError.details || upsertError);
        } else {
            console.log('Successfully upserted Supabase cache with new CoinGecko data.');
        }
        
        return mappedData;

    } catch (error) {
        console.error('An error occurred while fetching top coins:', error);
        return null;
    }
}

/**
 * Fetches Fear & Greed data for today.
 * @returns A promise resolving to today's F&G data or null on failure.
 */
export async function fetchFearGreedData(): Promise<{ today: FearGreedData | null }> {
    try {
        const url = 'https://api.alternative.me/fng/?limit=1';
        const response = await fetch(url, { next: { revalidate: 3600 }}); // Revalidate F&G every hour
        if (!response.ok) {
            console.error(`Fear & Greed API error: ${response.status} ${response.statusText}`);
            return { today: null };
        }
        const result = await response.json();

        if (!result?.data || !Array.isArray(result.data) || result.data.length === 0) {
            console.warn("Fear & Greed data is empty or invalid format.");
            return { today: null };
        }
    
        const todayData = result.data[0];
        return {
            today: todayData ? {
                value: parseInt(todayData.value, 10),
                value_classification: todayData.value_classification,
            } : null,
        };
    } catch (error) {
        console.error('An error occurred while fetching Fear & Greed data:', error);
        return { today: null };
    }
}

/**
 * Fetches all necessary data for the market analysis and stats cards.
 * This function is designed to be resilient and return default values on failure.
 * @returns A promise that resolves to a combined object of MarketAnalysisInput and MarketStats or null if critical data fails.
 */
export async function getDetailedCoinData(id: string): Promise<DetailedCoinData | null> {
    try {
        const url = `${API_BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
        const response = await fetch(url, { next: { revalidate: 300 }});

        if (!response.ok) {
            console.error(`CoinGecko API error for ${id}: ${response.status} ${response.statusText}`);
            return null;
        }

        const data = await response.json();

        return {
            id: data.id,
            symbol: data.symbol,
            name: data.name,
            image: data.image,
            description: data.description,
            links: data.links,
            current_price: data.market_data?.current_price?.usd,
            market_cap: data.market_data?.market_cap?.usd,
            total_volume: data.market_data?.total_volume?.usd,
            high_24h: data.market_data?.high_24h?.usd,
            low_24h: data.market_data?.low_24h?.usd,
            ath: data.market_data?.ath?.usd,
            ath_date: data.market_data?.ath_date?.usd,
            atl: data.market_data?.atl?.usd,
            atl_date: data.market_data?.atl_date?.usd,
            circulating_supply: data.market_data?.circulating_supply,
            total_supply: data.market_data?.total_supply,
            max_supply: data.market_data?.max_supply,
            price_change_percentage_24h: data.market_data?.price_change_percentage_24h,
            price_change_percentage_7d: data.market_data?.price_change_percentage_7d,
            price_change_percentage_30d: data.market_data?.price_change_percentage_30d,
            price_change_percentage_1y: data.market_data?.price_change_percentage_1y,
            sentiment_votes_up_percentage: data.sentiment_votes_up_percentage,
            sentiment_votes_down_percentage: data.sentiment_votes_down_percentage,
            genesis_date: data.genesis_date,
        };
    } catch (error) {
        console.error(`An error occurred while fetching detailed coin data for ${id}:`, error);
        return null;
    }
}

/**
 * Fetches all necessary data for the market analysis and stats cards.
 * This function is designed to be resilient and return default values on failure.
 * @returns A promise that resolves to a combined object of MarketAnalysisInput and MarketStats or null if critical data fails.
 */
export async function fetchMarketData(): Promise<CombinedMarketData | null> {
    try {
        const [globalDataResult, fearAndGreedResult, topCoinsResult] = await Promise.allSettled([
            fetch(`${API_BASE_URL}/global`, { next: { revalidate: 300 }}),
            fetchFearGreedData(),
            getTopCoins(20, 'usd'),
        ]);

        // --- Process Global Data (Critical) ---
        if (globalDataResult.status !== 'fulfilled' || !globalDataResult.value.ok) {
            console.error("Critical failure: Could not fetch global market data from CoinGecko.");
            return null;
        }
        const globalResponse = await globalDataResult.value.json();
        const globalData = globalResponse.data;
        const totalMarketCap = globalData?.total_market_cap?.usd ?? 0;
        if (totalMarketCap === 0) {
            console.error("Critical failure: Total market cap is zero.");
            return null;
        }
        const btcDominance = globalData?.market_cap_percentage?.btc ?? 0;
        const ethDominance = globalData?.market_cap_percentage?.eth ?? 0;

        // --- Process Fear & Greed Data (Non-critical) ---
        const fearAndGreedIndex = fearAndGreedResult.status === 'fulfilled' 
            ? fearAndGreedResult.value.today?.value ?? 50 
            : 50; // Default to neutral 50

        // --- Process Top Coins Data (Non-critical & SAFE) ---
        let top20Coins: CryptoData[] = [];
        if (topCoinsResult.status === 'fulfilled' && topCoinsResult.value) {
            top20Coins = topCoinsResult.value;
        } else {
            console.warn("Warning: Top coins data could not be fetched or was not fulfilled.");
        }
        
        // Use a stable, hardcoded value for historical max cap to avoid another API call.
        // Consider externalizing this value (e.g., to a database or environment variable) if it needs to be dynamic or updated frequently.
        // NOTE: This maxHistoricalMarketCap is hardcoded. For a more accurate S1 score,
        // consider fetching the actual all-time high market cap from a reliable historical data source.
        // For now, ensure it's at least the current totalMarketCap to prevent scores > 100.
        const maxHistoricalData = { cap: Math.max(2.9e12, totalMarketCap), date: '2021-11-10' };

        const btcMarketCap = totalMarketCap * (btcDominance / 100);
        const ethMarketCap = totalMarketCap * (ethDominance / 100);
        
        // For Solana and Stablecoins, derive from topCoins if available, otherwise default to 0
        const solData = top20Coins.find(c => c.id === 'solana');
        const solMarketCap = solData?.market_cap ?? 0;
        const solDominance = totalMarketCap > 0 ? (solMarketCap / totalMarketCap) * 100 : 0;
        
        const stablecoinIds = ['tether', 'usd-coin', 'dai', 'frax', 'ethena-usde'];
        const stablecoinMarketCap = top20Coins
            .filter(c => stablecoinIds.includes(c.id))
            .reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
        const stablecoinDominance = totalMarketCap > 0 ? (stablecoinMarketCap / totalMarketCap) * 100 : 0;

        const analysisInput: MarketAnalysisInput = {
            totalMarketCap,
            maxHistoricalMarketCap: maxHistoricalData.cap,
            totalVolume24h: globalData.total_volume?.usd ?? 0,
            avg30DayVolume: globalData.total_volume?.usd ?? 0, // TODO: Implement actual 30-day average volume calculation or fetch from a different source if needed.
            btcDominance,
            fearAndGreedIndex,
            topCoins: top20Coins.map(c => ({
                price_change_percentage_24h: c.price_change_percentage_24h_in_currency,
                ath: c.ath,
                current_price: c.current_price,
            })),
        };
        
        const marketStats: MarketStats = {
            totalMarketCap,
            btcMarketCap,
            ethMarketCap,
            solMarketCap,
            stablecoinMarketCap,
            btcDominance,
            ethDominance,
            solDominance,
            stablecoinDominance,
            maxHistoricalMarketCap: maxHistoricalData.cap,
        };

        const topCoinsForAnalysis: TopCoinForAnalysis[] = top20Coins.map(c => ({
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
            maxHistoricalMarketCapDate: maxHistoricalData.date,
        };

    } catch (error) {
        console.error("A critical error occurred in fetchMarketData:", error);
        return null;
    }
}
