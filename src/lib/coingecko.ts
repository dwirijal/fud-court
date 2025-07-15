
'use server';

import type { CryptoData, FearGreedData, MarketAnalysisInput, MarketStats, TopCoinForAnalysis, CombinedMarketData, CGMarket, DetailedCoinData } from '@/types';
import { supabase } from './supabase'; // Import Supabase client
import { getDefiLlamaStablecoins } from './defillama';
import { calculateMarketSentimentScore, calculateSharpeRatio, calculateVolatilityIndex, calculateLiquidityRatio, calculateSupportResistanceLevels, calculatePriceSignal, validateMarketData, detectOutliers, rateLimitedCalculation, calculateSMA, calculateEMA } from './calculations';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';
const CACHE_DURATION_SECONDS = 300; // 5 minutes for crypto data

/**
 * Fetches a list of top cryptocurrencies, prioritizing a fresh cache, then CoinGecko API,
 * and falling back to a stale cache if the API fails.
 * @param page The page number to fetch.
 * @param per_page The number of coins per page.
 * @returns A promise that resolves to an array of CryptoData objects or null on complete failure.
 */
export async function getTopCoins(page: number = 1, per_page: number = 20): Promise<CryptoData[] | null> {
    let cachedData: CryptoData[] | null = null;

    // 1. Try to fetch from Supabase cache first, only if supabase client is available
    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('crypto_data')
                .select('*')
                .order('market_cap_rank', { ascending: true })
                .range((page - 1) * per_page, page * per_page - 1);

            if (error) {
                console.error('Supabase cache read error:', error);
            } else if (data && data.length > 0) {
                cachedData = data as CryptoData[];
                const lastUpdated = new Date(cachedData[0].last_updated).getTime();
                const now = new Date().getTime();

                // If cache is fresh, return it immediately
                if ((now - lastUpdated) / 1000 < CACHE_DURATION_SECONDS) {
                    console.log('Serving top coins from fresh Supabase cache.');
                    return cachedData;
                }
                console.log('Supabase cache is stale. Will fetch from API.');
            }
        } catch (e) {
            console.error('An unexpected error occurred during cache fetch:', e);
        }
    }

    // 2. If cache is stale or empty, fetch from CoinGecko in USD
    try {
        console.log('Fetching top coins from CoinGecko API in USD.');
        const url = `${API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${per_page}&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d`;
        const response = await fetch(url, { next: { revalidate: 300 }});

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
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
            last_updated: coin.last_updated,
        }));
        
        // 3. Asynchronously store/update cache in Supabase. Don't block the response.
        if (supabase) {
            supabase.from('crypto_data').upsert(mappedData, { onConflict: 'id' })
                .then(({ error: upsertError }) => {
                    if (upsertError) {
                        console.error('Error upserting crypto_data into cache:', upsertError.message);
                    } else {
                        console.log('Successfully updated Supabase cache with new CoinGecko data.');
                    }
                });
        }
        
        return mappedData;

    } catch (error) {
        console.error('Failed to fetch from CoinGecko API:', error);
        // 4. If API fails, return stale cache data as a last resort
        if (cachedData) {
            console.warn('CoinGecko API failed, serving stale data from Supabase cache.');
            return cachedData;
        }
        // Return null only if both cache and API fail
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

export async function fetchMarketData(): Promise<CombinedMarketData | null> {
    const HARDCODED_MAX_HISTORICAL_CAP = 3_000_000_000_000;
    const HARDCODED_MAX_HISTORICAL_CAP_DATE = "2021-11-01";
    
    try {
        const [globalDataResult, fearGreedResult, topCoinsResult, stablecoinsResult, solanaResult] = await Promise.allSettled([
            fetch(`${API_BASE_URL}/global`, { next: { revalidate: 300 }}).then(res => res.json()),
            fetchFearGreedData(),
            getTopCoins(1, 20),
            getDefiLlamaStablecoins(), // Fetch all stablecoins for market cap calculation
            fetch(`${API_BASE_URL}/coins/markets?vs_currency=usd&ids=solana`).then(res => res.json()),
        ]);

        // Process Global Data
        let totalMarketCap = 0, btcDominance = 0, ethDominance = 0, totalVolume24h = 0;
        if (globalDataResult.status === 'fulfilled' && globalDataResult.value?.data?.total_market_cap?.usd) {
            const globalData = globalDataResult.value.data;
            totalMarketCap = globalData.total_market_cap.usd;
            btcDominance = globalData.market_cap_percentage.btc;
            ethDominance = globalData.market_cap_percentage.eth;
            totalVolume24h = globalData.total_volume.usd;
        } else {
            console.warn("Could not fetch global market data. Using defaults.");
        }

        // Process Fear & Greed Data
        let fearAndGreedIndex = 50; // Neutral default
        if (fearGreedResult.status === 'fulfilled' && fearGreedResult.value.today?.value) {
            fearAndGreedIndex = fearGreedResult.value.today.value;
        } else {
            console.warn("Could not fetch Fear & Greed index. Using default of 50.");
        }

        // Process Top Coins Data
        const top20Coins: TopCoinForAnalysis[] = [];
        if (topCoinsResult.status === 'fulfilled' && topCoinsResult.value) {
            topCoinsResult.value.forEach(coin => {
                top20Coins.push({
                    name: coin.name,
                    symbol: coin.symbol,
                    current_price: coin.current_price,
                    ath: coin.ath,
                    price_change_percentage_24h: coin.price_change_percentage_24h_in_currency,
                });
            });
        } else {
            console.warn("Could not fetch top 20 coins for analysis.");
        }

        // Process Solana Data
        let solMarketCap = 0;
        let solDominance = 0;
        if (solanaResult.status === 'fulfilled' && solanaResult.value?.[0]?.market_cap) {
            solMarketCap = solanaResult.value[0].market_cap;
        } else {
            console.warn("Could not fetch Solana market data.");
        }

        // Process Stablecoin Data
        let stablecoinMarketCap = 0;
        let stablecoinDominance = 0;
        if (stablecoinsResult.status === 'fulfilled' && stablecoinsResult.value) {
            stablecoinMarketCap = stablecoinsResult.value.reduce((sum, coin) => {
                return sum + (coin.circulating?.peggedUSD || 0);
            }, 0);
        } else {
            console.warn("Could not fetch stablecoin data.");
        }
        
        // Calculate Dominance if we have the total market cap
        if (totalMarketCap > 0) {
            if (solMarketCap > 0) {
                solDominance = (solMarketCap / totalMarketCap) * 100;
            }
            if (stablecoinMarketCap > 0) {
                stablecoinDominance = (stablecoinMarketCap / totalMarketCap) * 100;
            }
        }
        
        const maxHistoricalMarketCap = Math.max(HARDCODED_MAX_HISTORICAL_CAP, totalMarketCap);
        const btcMarketCap = totalMarketCap * (btcDominance / 100);
        const ethMarketCap = totalMarketCap * (ethDominance / 100);

        return {
            totalMarketCap,
            maxHistoricalMarketCap,
            maxHistoricalMarketCapDate: HARDCODED_MAX_HISTORICAL_CAP_DATE,
            totalVolume24h,
            avg30DayVolume: totalVolume24h * 0.8, // Placeholder
            btcDominance,
            ethDominance,
            solDominance,
            stablecoinDominance,
            fearAndGreedIndex,
            topCoins: top20Coins,
            btcMarketCap,
            ethMarketCap,
            solMarketCap,
            stablecoinMarketCap,
            topCoinsForAnalysis: top20Coins,
        };
    } catch (error) {
        console.error('An error occurred in fetchMarketData:', error);
        return null;
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
 * Fetches the exchange rate from USD to a target currency.
 * @param targetCurrency The currency to convert to (e.g., 'idr', 'eur', 'xau').
 * @returns A promise that resolves to the exchange rate or null on failure.
 */
export async function getExchangeRate(targetCurrency: string): Promise<number | null> {
    if (targetCurrency.toLowerCase() === 'usd') {
        return 1; // USD to USD is 1
    }

    try {
        // Fetch Bitcoin price in both USD and targetCurrency
        const url = `${API_BASE_URL}/simple/price?ids=bitcoin&vs_currencies=usd,${targetCurrency.toLowerCase()}`;
        const response = await fetch(url, { next: { revalidate: 3600 }}); // Cache for 1 hour

        if (!response.ok) {
            console.error(`CoinGecko exchange rate API error for ${targetCurrency}: ${response.status} ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        
        if (data && data.bitcoin && data.bitcoin.usd && data.bitcoin[targetCurrency.toLowerCase()]) {
            const btcUsdPrice = data.bitcoin.usd;
            const btcTargetPrice = data.bitcoin[targetCurrency.toLowerCase()];

            if (btcUsdPrice > 0 && btcTargetPrice > 0) {
                // Calculate exchange rate: (BTC price in targetCurrency) / (BTC price in USD)
                // This gives us the value of 1 USD in the target currency.
                return btcTargetPrice / btcUsdPrice;
            } else {
                console.warn(`Invalid BTC prices for exchange rate: BTC/USD=${btcUsdPrice}, BTC/${targetCurrency}=${btcTargetPrice}`);
                return null;
            }
        }
        return null;
    } catch (error) {
        console.error(`An error occurred while fetching exchange rate for ${targetCurrency}:`, error);
        return null;
    }
}
