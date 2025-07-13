
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
            const errorBody = await response.text();
            console.error("Error body:", errorBody);
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

        if (!result?.data || !Array.isArray(result.data) || result.data.length === 0) {
            console.warn("Fear & Greed data is empty or invalid format.");
            return { today: null, weekAgo: null };
        }
    
        const todayData = result.data[0];
        const weekAgoData = result.data.length > 7 ? result.data[7] : null;

        return {
            today: todayData ? {
                value: parseInt(todayData.value, 10),
                value_classification: todayData.value_classification,
            } : null,
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
        const [
            globalDataResponse,
            fearAndGreedResult,
            topCoins,
        ] = await Promise.allSettled([
            fetch(`${API_BASE_URL}/global`, { next: { revalidate: CACHE_REVALIDATE_SECONDS }}),
            fetchFearGreedData(),
            getTopCoins(20, 'usd'),
        ]);

        // --- Process Global Data ---
        let globalData: any = null;
        if (globalDataResponse.status === 'fulfilled' && globalDataResponse.value.ok) {
            const data = await globalDataResponse.value.json();
            globalData = data.data;
        } else {
            console.error("Failed to fetch global market data.");
            return null; // Critical data, return null if fails
        }

        // --- Process Fear & Greed Data ---
        let fearAndGreed: { today: FearGreedData | null } = { today: null };
        if (fearAndGreedResult.status === 'fulfilled') {
            fearAndGreed = fearAndGreedResult.value;
        } else {
            console.warn("Could not fetch Fear & Greed data. Proceeding without it.");
        }
        
        // --- Process Top Coins Data ---
        let top20Coins: CryptoData[] = [];
        if (topCoins.status === 'fulfilled' && topCoins.value) {
            top20Coins = topCoins.value;
        } else {
            console.warn("Could not fetch top 20 coins data. Proceeding with empty list.");
        }

        const totalMarketCap = globalData?.total_market_cap?.usd ?? 0;
        if (totalMarketCap === 0) {
            console.error("Total market cap is zero, cannot proceed with calculations.");
            return null;
        }

        const maxHistoricalData = { cap: 2.9e12, date: '2021-11-10' };
        
        const btcData = top20Coins.find(c => c.id === 'bitcoin');
        const ethData = top20Coins.find(c => c.id === 'ethereum');
        const solData = top20Coins.find(c => c.id === 'solana');
        
        const stablecoinIds = ['tether', 'usd-coin', 'dai', 'frax', 'ethena-usde'];
        const stablecoinMarketCap = top20Coins
            .filter(c => stablecoinIds.includes(c.id))
            .reduce((sum, coin) => sum + (coin.market_cap || 0), 0);

        const analysisInput: MarketAnalysisInput = {
            totalMarketCap,
            maxHistoricalMarketCap: maxHistoricalData.cap,
            totalVolume24h: globalData.total_volume.usd ?? 0,
            avg30DayVolume: globalData.total_volume.usd ?? 0, // Use current as fallback
            btcDominance: globalData.market_cap_percentage.btc ?? 0,
            fearAndGreedIndex: fearAndGreed.today?.value ?? 50, // Default to neutral 50
            topCoins: top20Coins.map(c => ({
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
            btcDominance: globalData.market_cap_percentage.btc ?? 0,
            ethDominance: globalData.market_cap_percentage.eth ?? 0,
            solDominance: solData ? (solData.market_cap / totalMarketCap) * 100 : 0,
            stablecoinDominance: (stablecoinMarketCap / totalMarketCap) * 100,
            maxHistoricalMarketCap: maxHistoricalData.cap
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
