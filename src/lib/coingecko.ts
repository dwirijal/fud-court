
'use server';

<<<<<<< HEAD
import type { CryptoData, DetailedCoinData, CombinedMarketData, TopCoinForAnalysis, CGMarket } from '@/types';
import { supabase } from './supabase';
import { getFearAndGreedIndexFromCache } from './fear-greed';
import { getDefiLlamaChains, getDefiLlamaProtocols, getDefiLlamaStablecoins, syncDefiLlamaData } from './defillama';
=======
import type { CryptoData, FearGreedData, DetailedCoinData, CombinedMarketData, TopCoinForAnalysis } from '@/types';
import { supabase } from './supabase'; // Import Supabase client
<<<<<<< HEAD
import { getDefiLlamaStablecoins } from './defillama';
import { calculateMarketSentimentScore, calculateSharpeRatio, calculateVolatilityIndex, calculateLiquidityRatio, calculateSupportResistanceLevels, calculatePriceSignal, validateMarketData, detectOutliers, rateLimitedCalculation, calculateSMA, calculateEMA } from './calculations';
=======
import { getFearAndGreedIndex } from './fear-greed'; // Import Fear & Greed API function
>>>>>>> d32eafdf79fc1270a0712b11f562506629d2d989
>>>>>>> b058873b045abf5277ae8797dcaa268e60af95fe

const COINGECKO_API_BASE_URL = 'https://api.coingecko.com/api/v3';

interface CoinGeckoGlobalData {
  data: {
    active_cryptocurrencies: number;
    upcoming_icos: number;
    ongoing_icos: number;
    markets: number;
    total_market_cap: { [key: string]: number };
    total_volume: { [key: string]: number };
    market_cap_percentage: { [key: string]: number };
    market_cap_change_percentage_24h_usd: number;
    updated_at: number;
  };
}

/**
 * Fetches and syncs the top 250 coins from CoinGecko to the Supabase DB.
 */
export async function syncTopCoins() {
  console.log("Starting sync: Top Coins from CoinGecko");
  const url = `${COINGECKO_API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=true&price_change_percentage=1h,24h,7d`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`CoinGecko Market API error: ${response.status}`);
    const data: CGMarket[] = await response.json();

    const mappedData = data.map(coin => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      market_cap_rank: coin.market_cap_rank,
      total_volume: coin.total_volume,
      high_24h: coin.high_24h,
      low_24h: coin.low_24h,
      price_change_percentage_1h_in_currency: coin.price_change_percentage_1h_in_currency,
      price_change_percentage_24h_in_currency: coin.price_change_percentage_24h,
      price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency,
      sparkline_in_7d: coin.sparkline_in_7d,
      ath: coin.ath,
      ath_market_cap: coin.ath_market_cap,
    }));

    const { error } = await supabase.from('crypto_data').upsert(mappedData, { onConflict: 'id' });
    if (error) throw error;
    
    console.log("Sync finished: Top Coins from CoinGecko");
  } catch (error) {
    console.error("Error syncing top coins data:", error);
    throw error;
  }
}

async function getGlobalMarketDataFromApi(): Promise<CoinGeckoGlobalData['data'] | null> {
    const url = `${COINGECKO_API_BASE_URL}/global`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`CoinGecko Global API error: ${response.status}`);
            return null;
        }
        const data: CoinGeckoGlobalData = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching global market data from API:', error);
        return null;
    }
}


/**
 * Fetches and syncs global market data from CoinGecko to Supabase.
 */
export async function syncGlobalMarketData() {
  console.log("Starting sync: Global Market Data from CoinGecko");
  const apiData = await getGlobalMarketDataFromApi();
  if (apiData) {
    const globalData = {
      id: 'global', // a single row to always upsert
      data: apiData,
      last_updated: new Date().toISOString(),
    };

    const { error } = await supabase.from('global_market_data').upsert(globalData, { onConflict: 'id' });
    if (error) {
      console.error('Error syncing global market data to Supabase:', error);
      throw error;
    }
    console.log("Sync finished: Global Market Data from CoinGecko");
    return apiData;
  }
  return null;
}


/**
 * Fetches the average 30-day trading volume for Bitcoin as a proxy for the total market.
 * @returns A promise that resolves to the average volume, or 0 on failure.
 */
async function getAvg30DayVolume(): Promise<number> {
    try {
        const url = `${COINGECKO_API_BASE_URL}/coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily`;
        const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
        if (!response.ok) {
            console.error(`CoinGecko Market Chart API error: ${response.status} ${response.statusText}`);
            return 0;
        }
        const data = await response.json();
        const volumes = data.total_volumes.map((v: [number, number]) => v[1]);
        if (volumes.length === 0) return 0;
        
        const sum = volumes.reduce((a: number, b: number) => a + b, 0);
        return sum / volumes.length;
    } catch (error) {
        console.error('An error occurred while fetching 30-day average volume:', error);
        return 0;
    }
}


/**
 * Fetches a list of top cryptocurrencies from the Supabase database.
 * @param page The page number to fetch.
 * @param per_page The number of coins per page.
 * @returns A promise that resolves to an array of CryptoData objects or null on failure.
 */
export async function getTopCoins(page: number = 1, per_page: number = 20): Promise<CryptoData[] | null> {
<<<<<<< HEAD
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

=======
    try {
        const { data, error } = await supabase
            .from('crypto_data')
            .select('*')
            .order('market_cap_rank', { ascending: true, nullsFirst: false })
            .range((page - 1) * per_page, page * per_page - 1);

        if (error) {
            console.error('Error fetching top coins from Supabase:', error);
            return null;
        }

        return data as CryptoData[] || null;
>>>>>>> d32eafdf79fc1270a0712b11f562506629d2d989
    } catch (error) {
        console.error('An unexpected error occurred while fetching top coins from Supabase:', error);
        return null;
    }
}

/**
<<<<<<< HEAD
=======
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
>>>>>>> b058873b045abf5277ae8797dcaa268e60af95fe
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
            updates.push({ currency: 'eur', rate: data.eurc.usd });
        }
        if (data.idrx && data.idrx.usd) {
            updates.push({ currency: 'idr', rate: data.idrx.usd });
        }
        if (data['pax-gold'] && data['pax-gold'].usd) {
            updates.push({ currency: 'xau', rate: data['pax-gold'].usd });
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
        let globalDataResult = await supabase.from('global_market_data').select('*').single();
        
        if (globalDataResult.error || !globalDataResult.data) {
            console.warn("Global market data cache is empty or failed to load. Fetching from API as fallback.");
            const apiData = await syncGlobalMarketData();
            if (apiData) {
                globalDataResult = { data: { data: apiData }, error: null } as any;
            } else {
                throw new Error("Failed to fetch global market data from both cache and API.");
            }
        }

        const [fearAndGreed, topCoinsData, defiChains, stablecoinsData, avg30DayVolume] = await Promise.all([
            getFearAndGreedIndexFromCache(),
            supabase.from('crypto_data').select('*').order('market_cap_rank', { ascending: true, nullsFirst: false }).limit(20),
            getDefiLlamaChains(),
            getDefiLlamaStablecoins(),
            getAvg30DayVolume(),
        ]);
        
        const globalData = globalDataResult.data?.data;
        
        // Use a more reliable way to calculate total DeFi TVL by summing chains
        const defiTotalTvl = defiChains?.reduce((sum, chain) => sum + (chain.tvl ?? 0), 0) ?? 0;
        const findChainTvl = (chainName: string) => defiChains.find(c => c.name === chainName)?.tvl ?? 0;

        if (!globalData || !fearAndGreed || topCoinsData.error || !defiChains || !stablecoinsData) {
            console.error('Failed to fetch one or more core data sources.', { globalData: !!globalData, fearAndGreed: !!fearAndGreed, topCoinsError: topCoinsData.error, defiChains: !!defiChains, stablecoinsData: !!stablecoinsData });
            return null;
        }
        
        const topCoins = topCoinsData.data || [];
        const totalMarketCap = globalData.total_market_cap?.usd ?? 0;
        
        // Calculate Dominances & TVLs
        const btcMarketCap = totalMarketCap * (globalData.market_cap_percentage.btc / 100);
        const ethMarketCap = totalMarketCap * (globalData.market_cap_percentage.eth / 100);
        const solMarketCap = topCoins.find(c => c.symbol === 'sol')?.market_cap ?? 0;
        
        const btcTvl = findChainTvl('Bitcoin');
        const ethTvl = findChainTvl('Ethereum');
        const solTvl = findChainTvl('Solana');
        const arbTvl = findChainTvl('Arbitrum');
        
        const stablecoinMarketCap = stablecoinsData?.reduce((sum, coin) => sum + (coin.circulating_pegged_usd ?? 0), 0) ?? 0;
        
        const btcDominance = globalData.market_cap_percentage?.btc ?? 0;
        const ethDominance = globalData.market_cap_percentage?.eth ?? 0;
        const solDominance = solMarketCap > 0 && totalMarketCap > 0 ? (solMarketCap / totalMarketCap) * 100 : 0;
        const stablecoinDominance = stablecoinMarketCap > 0 && totalMarketCap > 0 ? (stablecoinMarketCap / totalMarketCap) * 100 : 0;
        
        const result: CombinedMarketData = {
            totalMarketCap,
            maxHistoricalMarketCap: totalMarketCap, // Placeholder, ideally should come from historical data
            totalVolume24h: globalData.total_volume?.usd ?? 0,
            avg30DayVolume: avg30DayVolume,
            btcDominance,
            fearAndGreedIndex: fearAndGreed.value,
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
            arbTvl,
            btcTvl,
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
            defiTotalTvl,
        };
        return result;
    } catch (err) {
        console.error('fetchMarketData error:', err);
        return null;
    }
}
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======

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
>>>>>>> d32eafdf79fc1270a0712b11f562506629d2d989
>>>>>>> b058873b045abf5277ae8797dcaa268e60af95fe
