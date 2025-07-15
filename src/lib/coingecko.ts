'use server';

import type { CryptoData, FearGreedData, MarketAnalysisInput, MarketStats, TopCoinForAnalysis, CombinedMarketData, CGMarket, DetailedCoinData } from '@/types';
import { supabase } from './supabase'; // Import Supabase client

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

    // 1. Try to fetch from Supabase cache first
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
        supabase.from('crypto_data').upsert(mappedData, { onConflict: 'id' })
            .then(({ error: upsertError }) => {
                if (upsertError) {
                    console.error('Error upserting crypto_data into cache:', upsertError.message);
                } else {
                    console.log('Successfully updated Supabase cache with new CoinGecko data.');
                }
            });
        
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

export async function calculateVolatilityIndex(priceChanges: number[]): Promise<number> {
    if (priceChanges.length === 0) return 0;

    const sumOfSquares = priceChanges.reduce((sum, change) => sum + Math.pow(change, 2), 0);
    const variance = sumOfSquares / priceChanges.length;
    const volatility = Math.sqrt(variance) * 100; // Convert to percentage
    return volatility;
}

export async function calculateLiquidityRatio(totalVolume24h: number, marketCap: number): Promise<number> {
    if (marketCap === 0) return 0;
    return (totalVolume24h / marketCap) * 100;
}

export async function calculateMarketSentimentScore(
    priceChange24h: number,
    volumeChange24h: number,
    marketCapChange24h: number,
    dominanceChange: number
): Promise<number> {
    const rawScore = (
        (priceChange24h * 0.3) +
        (volumeChange24h * 0.2) +
        (marketCapChange24h * 0.2) +
        (dominanceChange * 0.3)
    ) / 4;

    // Normalize score to a 0-100 scale
    const normalizedScore = (rawScore + 100) / 2;
    return Math.max(0, Math.min(100, normalizedScore)); // Ensure score is between 0 and 100
}

export async function calculateSupportResistanceLevels(currentPrice: number, ath: number, atl: number): Promise<{ supportLevel: number | null; resistanceLevel: number | null }> {
    if (ath <= 0 || atl < 0 || currentPrice <= 0) {
        return { supportLevel: null, resistanceLevel: null };
    }

    const athDrawdown = (ath - currentPrice) / ath; // Percentage drawdown from ATH
    const recoveryFactor = (currentPrice - atl) / (ath - atl); // Percentage recovery from ATL

    const supportLevel = currentPrice * (1 - (athDrawdown * 0.618));
    const resistanceLevel = currentPrice * (1 + (recoveryFactor * 0.382));

    return { supportLevel, resistanceLevel };
}

export function calculateSMA(prices: number[], period: number): number | null {
    if (prices.length < period) return null;
    const sum = prices.slice(0, period).reduce((acc, price) => acc + price, 0);
    return sum / period;
}

export function calculateEMA(prices: number[], period: number): number | null {
    if (prices.length < period) return null;

    // Calculate SMA for the first EMA value
    const sma = calculateSMA(prices, period);
    if (sma === null) return null;

    const multiplier = 2 / (period + 1);
    let ema = sma;

    // Calculate EMA for subsequent prices
    for (let i = period; i < prices.length; i++) {
        ema = (prices[i] - ema) * multiplier + ema;
    }
    return ema;
}

export function calculatePriceSignal(prices: number[]): number | null {
    const ema12 = calculateEMA(prices, 12);
    const ema26 = calculateEMA(prices, 26);

    if (ema12 === null || ema26 === null || ema26 === 0) return null; // Avoid division by zero

    return (ema12 - ema26) / ema26 * 100;
}

export function validateMarketData(data: any): { price: number; volume: number; marketCap: number; dominance: number } {
    return {
        price: Math.max(0, parseFloat(data.price) || 0),
        volume: Math.max(0, parseFloat(data.volume) || 0),
        marketCap: Math.max(0, parseFloat(data.marketCap) || 0),
        dominance: Math.min(100, Math.max(0, parseFloat(data.dominance) || 0))
    };
}

function calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
}

function calculateStandardDeviation(values: number[]): number {
    if (values.length < 2) return 0;
    const avg = calculateAverage(values);
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    const avgSquareDiff = calculateAverage(squareDiffs);
    return Math.sqrt(avgSquareDiff);
}

export function calculateSharpeRatio(returns: number[], riskFreeRate: number): number {
    const avgReturn = calculateAverage(returns);
    const stdDev = calculateStandardDeviation(returns);

    if (stdDev === 0) return 0; // Avoid division by zero

    return (avgReturn - riskFreeRate) / stdDev;
}

export function detectOutliers(values: number[]): number[] {
    if (values.length < 4) return values; // Not enough data to detect outliers reliably

    const sortedValues = [...values].sort((a, b) => a - b);
    const q1 = sortedValues[Math.floor(sortedValues.length / 4)];
    const q3 = sortedValues[Math.ceil(sortedValues.length * 3 / 4) - 1];
    const iqr = q3 - q1;
    const lowerBound = q1 - (1.5 * iqr);
    const upperBound = q3 + (1.5 * iqr);
        
    return values.filter(v => v >= lowerBound && v <= upperBound);
}

export function rateLimitedCalculation<T, R>(calculation: (data: T) => R, maxPerSecond: number = 10) {
    const queue: { resolve: (value: R) => void; data: T }[] = [];
    let lastExecutionTime = 0;
    const delay = 1000 / maxPerSecond;

    const executeNext = () => {
        if (queue.length > 0) {
            const now = Date.now();
            const timeSinceLastExecution = now - lastExecutionTime;

            if (timeSinceLastExecution >= delay) {
                const { resolve, data } = queue.shift()!;
                resolve(calculation(data));
                lastExecutionTime = now;
            } else {
                // Reschedule if not enough time has passed
                setTimeout(executeNext, delay - timeSinceLastExecution);
            }
        }
    };

    // Start the timer to process the queue
    setInterval(executeNext, delay);

    return (data: T) => new Promise<R>((resolve) => {
        queue.push({ resolve, data });
        executeNext(); // Try to execute immediately if possible
    });
}
