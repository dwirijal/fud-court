

'use server';

import type { CryptoData, DetailedCoinData, CombinedMarketData, TopCoinForAnalysis, CGMarket } from '@/types';
import { supabase } from './supabase';
import { getFearAndGreedIndexFromCache } from './fear-greed';
import { getDefiLlamaHistoricalTvl, getDefiLlamaProtocols, getDefiLlamaStablecoins, syncDefiLlamaData } from './defillama';

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
    } catch (error) {
        console.error('An unexpected error occurred while fetching top coins from Supabase:', error);
        return null;
    }
}

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

        const [fearAndGreed, topCoinsData, defiProtocols, stablecoinsData, avg30DayVolume, historicalTvlData] = await Promise.all([
            getFearAndGreedIndexFromCache(),
            supabase.from('crypto_data').select('*').order('market_cap_rank', { ascending: true, nullsFirst: false }).limit(20),
            getDefiLlamaProtocols(),
            getDefiLlamaStablecoins(),
            getAvg30DayVolume(),
            getDefiLlamaHistoricalTvl(),
        ]);
        
        const globalData = globalDataResult.data?.data;
        const latestTvlEntry = historicalTvlData ? historicalTvlData[historicalTvlData.length - 1] : null;

        if (!globalData || !fearAndGreed || topCoinsData.error || !defiProtocols || !stablecoinsData) {
            console.error('Failed to fetch one or more core data sources.', { globalData: !!globalData, fearAndGreed: !!fearAndGreed, topCoinsError: topCoinsData.error, defiProtocols: !!defiProtocols, stablecoinsData: !!stablecoinsData });
            return null;
        }
        
        const topCoins = topCoinsData.data || [];
        const totalMarketCap = globalData.total_market_cap?.usd ?? 0;
        
        // Calculate Dominances & TVLs
        const btcMarketCap = totalMarketCap * (globalData.market_cap_percentage.btc / 100);
        const ethMarketCap = totalMarketCap * (globalData.market_cap_percentage.eth / 100);
        const solMarketCap = topCoins.find(c => c.symbol === 'sol')?.market_cap ?? 0;
        
        // Calculate TVL by summing from protocols data
        const btcTvl = defiProtocols.reduce((sum, p) => sum + (p.chain_tvls?.Bitcoin ?? 0), 0);
        const ethTvl = defiProtocols.reduce((sum, p) => sum + (p.chain_tvls?.Ethereum ?? 0), 0);
        const solTvl = defiProtocols.reduce((sum, p) => sum + (p.chain_tvls?.Solana ?? 0), 0);
        const arbTvl = defiProtocols.reduce((sum, p) => sum + (p.chain_tvls?.Arbitrum ?? 0), 0);
        
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
            defiTotalTvl: latestTvlEntry?.tvl ?? 0,
        };
        return result;
    } catch (err) {
        console.error('fetchMarketData error:', err);
        return null;
    }
}
