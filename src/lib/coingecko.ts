
'use server';

import CoinGecko from '@coingecko/coingecko-typescript';
import type { CryptoData, FearGreedData, MarketAnalysisInput, MarketStats, TopCoinForAnalysis, CombinedMarketData, CGMarket } from '@/types';

// Initialize the CoinGecko client
const client = new CoinGecko();

/**
 * Fetches a list of top cryptocurrencies from the CoinGecko API using the client.
 * @param limit The number of coins to fetch. Defaults to 100.
 * @param currency The target currency of the prices. Defaults to 'usd'.
 * @returns A promise that resolves to an array of CryptoData objects or null on failure.
 */
export async function getTopCoins(limit: number = 100, currency: string = 'usd'): Promise<CryptoData[] | null> {
    try {
        const response = await client.coin.markets({
            vs_currency: currency,
            order: 'market_cap_desc',
            per_page: limit,
            page: 1,
            sparkline: true,
            price_change_percentage: ['1h', '24h', '7d'],
        });

        if (!response.success) {
            console.error(`CoinGecko API error for getTopCoins: ${response.message}`);
            return null;
        }

        // The client returns data in a slightly different structure, so we map it to our CryptoData type.
        // This mapping also ensures that any null values from the API are handled gracefully.
        const mappedData: CryptoData[] = response.data.map((coin: CGMarket) => ({
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
export async function fetchMarketData(): Promise<CombinedMarketData | null> {
    try {
        const [globalDataResult, fearAndGreedResult, topCoinsResult] = await Promise.allSettled([
            client.global(),
            fetchFearGreedData(),
            getTopCoins(20, 'usd'),
        ]);

        // --- Process Global Data (Critical) ---
        if (globalDataResult.status !== 'fulfilled' || !globalDataResult.value.success) {
            console.error("Critical failure: Could not fetch global market data from CoinGecko.");
            return null;
        }
        const globalData = globalDataResult.value.data.data; // The client nests data twice
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
            console.warn("Could not fetch top coins data. Proceeding with empty array.");
        }
        
        // Use a stable, hardcoded value for historical max cap to avoid another API call
        const maxHistoricalData = { cap: 2.9e12, date: '2021-11-10' };

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
            avg30DayVolume: globalData.total_volume?.usd ?? 0, // Fallback to current volume
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
