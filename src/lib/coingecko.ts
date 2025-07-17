
'use server';

import type { CryptoData, FearGreedData, DetailedCoinData, CombinedMarketData, TopCoinForAnalysis, DefiLlamaProtocol, DefiLlamaStablecoin } from '@/types';
import { supabase } from './supabase'; // Import Supabase client
import { getFearAndGreedIndex } from './fear-greed'; // Import Fear & Greed API function
import { getDefiLlamaProtocols, getDefiLlamaStablecoins } from './defillama';

const COINGECKO_API_BASE_URL = 'https://api.coingecko.com/api/v3';

interface CoinGeckoGlobalData {
  data: {
    active_cryptocurrencies: number;
    upcoming_icos: number;
    ongoing_icos: number;
    ended_icos: number;
    markets: number;
    total_market_cap: { [key: string]: number };
    total_volume: { [key: string]: number };
    market_cap_percentage: { [key: string]: number };
    market_cap_change_percentage_24h_usd: number;
    updated_at: number;
  };
}

async function getGlobalMarketData(): Promise<CoinGeckoGlobalData['data'] | null> {
  try {
    const response = await fetch(`${COINGECKO_API_BASE_URL}/global`, { next: { revalidate: 3600 } }); // Cache for 1 hour
    if (!response.ok) {
      console.error(`CoinGecko Global API error: ${response.status} ${response.statusText}`);
      return null;
    }
    const data: CoinGeckoGlobalData = await response.json();
    return data.data;
  } catch (error) {
    console.error('An error occurred while fetching global market data from CoinGecko:', error);
    return null;
  }
}

/**
 * Fetches a list of top cryptocurrencies from the Supabase database.
 * @param page The page number to fetch.
 * @param per_page The number of coins per page.
 * @returns A promise that resolves to an array of CryptoData objects or null on failure.
 */
export async function getTopCoins(page: number = 1, per_page: number = 20): Promise<CryptoData[] | null> {
    try {
        const { data, error } = await supabase
            .from('crypto_data')
            .select('*')
            .order('market_cap_rank', { ascending: true })
            .range((page - 1) * per_page, page * per_page - 1);

        if (error) {
            console.error('Error fetching top coins from Supabase:', error);
            return null;
        }

        return data as CryptoData[] || null;
    } catch (error) {
        console.error('An unexpected error occurred while fetching top coins from Supabase:', error);
        return null;
    }
}

/**
 * Fetches Fear & Greed data for today from the Supabase database.
 * @returns A promise resolving to today's F&G data or null on failure.
 */
/*
export async function fetchFearGreedData(): Promise<{ today: FearGreedData | null }> {
    try {
        const { data, error } = await supabase.from('fear_and_greed').select('*').limit(1);
        if (error) {
            console.error('Error fetching Fear & Greed data from Supabase:', error);
            return { today: null };
        }
        const todayData = data[0];
        return {
            today: todayData ? {
                value: todayData.value,
                value_classification: todayData.value_classification,
            } : null,
        };
    } catch (error) {
        console.error('An error occurred while fetching Fear & Greed data from Supabase:', error);
        return { today: null };
    }
}
*/

/**
 * Fetches detailed coin data for a given coin ID from the Supabase database.
 * @param id The ID of the coin to fetch.
 * @returns A promise that resolves to the detailed coin data or null on failure.
 */
export async function getDetailedCoinData(id: string): Promise<DetailedCoinData | null> {
    try {
        const { data, error } = await supabase
            .from('crypto_data')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(`Error fetching detailed coin data for ${id} from Supabase:`, error);
            return null;
        }

        return data as DetailedCoinData || null;
    } catch (error) {
        console.error(`An unexpected error occurred while fetching detailed coin data for ${id} from Supabase:`, error);
        return null;
    }
}

/**
 * Fetches the exchange rate from USD to a target currency from the Supabase database.
 * @param targetCurrency The currency to convert to (e.g., 'idr', 'eur', 'xau').
 * @returns A promise that resolves to the exchange rate or null on failure.
 */
export async function getExchangeRate(targetCurrency: string): Promise<number | null> {
    if (targetCurrency.toLowerCase() === 'usd') {
        return 1; // USD to USD is 1
    }

    try {
        const { data, error } = await supabase
            .from('exchange_rates')
            .select('rate')
            .eq('currency', targetCurrency.toLowerCase())
            .single();

        if (error) {
            console.error(`Error fetching exchange rate for ${targetCurrency} from Supabase:`, JSON.stringify(error, null, 2));
            return null;
        }

        return data?.rate || null;
    } catch (error) {
        console.error(`An unexpected error occurred while fetching exchange rate for ${targetCurrency} from Supabase:`, error);
        return null;
    }
}

/**
 * Fetches the current USD prices for EURC, IDRX, and PAXG from CoinGecko
 * and updates the public.exchange_rates table in Supabase.
 */
export async function updateCryptoExchangeRates(): Promise<void> {
    const cryptoIds = ['eurc', 'idrx', 'pax-gold'];
    const vsCurrency = 'usd';
    const url = `${COINGECKO_API_BASE_URL}/simple/price?ids=${cryptoIds.join(',')}&vs_currencies=${vsCurrency}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`CoinGecko API error fetching crypto prices: ${response.status} ${response.statusText}`);
            return;
        }
        const data = await response.json();

        const updates = [];
        if (data.eurc && data.eurc.usd) {
            updates.push({ currency: 'eurc', rate: data.eurc.usd });
        }
        if (data.idrx && data.idrx.usd) {
            updates.push({ currency: 'idrx', rate: data.idrx.usd });
        }
        if (data['pax-gold'] && data['pax-gold'].usd) {
            updates.push({ currency: 'paxg', rate: data['pax-gold'].usd }); // Store as 'paxg'
        }

        if (updates.length > 0) {
            const { error } = await supabase
                .from('exchange_rates')
                .upsert(updates, { onConflict: 'currency' });

            if (error) {
                console.error('Error upserting crypto exchange rates to Supabase:', JSON.stringify(error, null, 2));
            } else {
                console.log('Successfully updated crypto exchange rates in Supabase.');
            }
        } else {
            console.warn('No crypto exchange rate data received from CoinGecko to update.');
        }

    } catch (error) {
        console.error('An unexpected error occurred while updating crypto exchange rates:', error);
    }
}


/**
 * Mengambil data pasar gabungan: market cap, volume, dominance, top coins, dan fear & greed index.
 * Return sesuai tipe CombinedMarketData.
 */
export async function fetchMarketData(): Promise<CombinedMarketData | null> {
    try {
        const [globalData, fearAndGreed, topCoinsData, defiProtocols, stablecoinsData] = await Promise.all([
            getGlobalMarketData(),
            getFearAndGreedIndex(),
            supabase.from('crypto_data').select('*').order('market_cap_rank', { ascending: true }).limit(20),
            getDefiLlamaProtocols(),
            getDefiLlamaStablecoins()
        ]);

        if (!globalData || !fearAndGreed || topCoinsData.error) {
            console.error('Failed to fetch one or more core data sources.', { globalData: !!globalData, fearAndGreed: !!fearAndGreed, topCoinsError: topCoinsData.error });
            return null;
        }

        const topCoins = topCoinsData.data || [];
        const totalMarketCap = globalData.total_market_cap?.usd ?? 0;
        
        // Calculate Dominances & TVLs
        const btcMarketCap = totalMarketCap * (globalData.market_cap_percentage.btc / 100);
        const ethMarketCap = totalMarketCap * (globalData.market_cap_percentage.eth / 100);
        const solMarketCap = topCoins.find(c => c.symbol === 'sol')?.market_cap ?? 0;

        const ethTvl = defiProtocols?.find(p => p.name === "Ethereum")?.tvl ?? 0;
        const solTvl = defiProtocols?.find(p => p.name === "Solana")?.tvl ?? 0;
        
        const stablecoinMarketCap = stablecoinsData?.reduce((sum, coin) => sum + (coin.circulating?.peggedUSD ?? 0), 0) ?? 0;
        
        const btcDominance = globalData.market_cap_percentage?.btc ?? 0;
        const ethDominance = globalData.market_cap_percentage?.eth ?? 0;
        const solDominance = solMarketCap > 0 && totalMarketCap > 0 ? (solMarketCap / totalMarketCap) * 100 : 0;
        const stablecoinDominance = stablecoinMarketCap > 0 && totalMarketCap > 0 ? (stablecoinMarketCap / totalMarketCap) * 100 : 0;
        
        const result: CombinedMarketData = {
            totalMarketCap,
            maxHistoricalMarketCap: 0, // Not available from CoinGecko /global endpoint
            totalVolume24h: globalData.total_volume?.usd ?? 0,
            avg30DayVolume: 0, // Not available from CoinGecko /global endpoint
            btcDominance,
            fearAndGreedIndex: parseInt(fearAndGreed.value),
            topCoins: topCoins.map(coin => ({
                name: coin.name,
                symbol: coin.symbol,
                current_price: coin.current_price,
                ath: coin.ath,
                price_change_percentage_24h: coin.price_change_percentage_24h_in_currency,
            })),
            btcMarketCap,
            ethMarketCap,
            solMarketCap,
            ethTvl,
            solTvl,
            stablecoinMarketCap,
            ethDominance,
            solDominance,
            stablecoinDominance,
            maxHistoricalMarketCapDate: '', // Not available from CoinGecko /global endpoint
            topCoinsForAnalysis: topCoins.map(coin => ({
                name: coin.name,
                symbol: coin.symbol,
                current_price: coin.current_price,
                ath: coin.ath,
                price_change_percentage_24h: coin.price_change_percentage_24h_in_currency,
            })),
        };
        return result;
    } catch (err) {
        console.error('fetchMarketData error:', err);
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

export async function calculateSMA(prices: number[], period: number): Promise<number | null> {
    if (prices.length < period) return Promise.resolve(null);
    const sum = prices.slice(0, period).reduce((acc, price) => acc + price, 0);
    return Promise.resolve(sum / period);
}

export async function calculateEMA(prices: number[], period: number): Promise<number | null> {
    if (prices.length < period) return Promise.resolve(null);

    // Calculate SMA for the first EMA value
    const sma = await calculateSMA(prices, period);
    if (sma === null) return Promise.resolve(null);

    const multiplier = 2 / (period + 1);
    let ema = sma;

    // Calculate EMA for subsequent prices
    for (let i = period; i < prices.length; i++) {
        ema = (prices[i] - ema) * multiplier + ema;
    }
    return Promise.resolve(ema);
}

export async function calculatePriceSignal(prices: number[]): Promise<number | null> {
    const ema12 = await calculateEMA(prices, 12);
    const ema26 = await calculateEMA(prices, 26);

    if (ema12 === null || ema26 === null || ema26 === 0) return Promise.resolve(null); // Avoid division by zero

    return Promise.resolve((ema12 - ema26) / ema26 * 100);
}

export async function validateMarketData(data: any): Promise<{ price: number; volume: number; marketCap: number; dominance: number }> {
    return Promise.resolve({
        price: Math.max(0, parseFloat(data.price) || 0),
        volume: Math.max(0, parseFloat(data.volume) || 0),
        marketCap: Math.max(0, parseFloat(data.marketCap) || 0),
        dominance: Math.min(100, Math.max(0, parseFloat(data.dominance) || 0))
    });
}

async function calculateAverage(values: number[]): Promise<number> {
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
}

async function calculateStandardDeviation(values: number[]): Promise<number> {
    if (values.length < 2) return 0;
    const avg = await calculateAverage(values);
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    const avgSquareDiff = await calculateAverage(squareDiffs);
    return Math.sqrt(avgSquareDiff);
}

export async function calculateSharpeRatio(returns: number[], riskFreeRate: number): Promise<number> {
    const avgReturn = await calculateAverage(returns);
    const stdDev = await calculateStandardDeviation(returns);

    if (stdDev === 0) return 0; // Avoid division by zero

    return (avgReturn - riskFreeRate) / stdDev;
}

export async function detectOutliers(values: number[]): Promise<number[]> {
    if (values.length < 4) return Promise.resolve(values); // Not enough data to detect outliers reliably

    const sortedValues = [...values].sort((a, b) => a - b);
    const q1 = sortedValues[Math.floor(sortedValues.length / 4)];
    const q3 = sortedValues[Math.ceil(sortedValues.length * 3 / 4) - 1];
    const iqr = q3 - q1;
    const lowerBound = q1 - (1.5 * iqr);
    const upperBound = q3 + (1.5 * iqr);
        
    return Promise.resolve(values.filter(v => v >= lowerBound && v <= upperBound));
}

export async function rateLimitedCalculation<T, R>(calculation: (data: T) => R, maxPerSecond: number = 10) {
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

    return async (data: T) => new Promise<R>((resolve) => {
        queue.push({ resolve, data });
        executeNext(); // Try to execute immediately if possible
    });
}
