'use client';

import { useState, useEffect, useCallback } from 'react';

// Types
interface CoinPrice {
  id: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  volume_24h: number;
}

interface GasPrice {
  chainId: number;
  standard: number;
  fast: number;
  instant: number;
}

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// CoinGecko API client-side functions
const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

// Rate limiting helper
const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const requests: number[] = [];
  
  return () => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Remove old requests
    while (requests.length > 0 && requests[0] < windowStart) {
      requests.shift();
    }
    
    if (requests.length >= maxRequests) {
      return false;
    }
    
    requests.push(now);
    return true;
  };
};

const coinGeckoLimiter = createRateLimiter(50, 60000); // 50 requests per minute

// Portfolio Tracker Hook
export function usePortfolioTracker(holdings: Array<{id: string, amount: number}>) {
  const [portfolio, setPortfolio] = useState<{
    totalValue: number;
    totalChange24h: number;
    coins: Array<CoinPrice & {amount: number, value: number}>;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolioData = useCallback(async () => {
    if (!holdings.length || !coinGeckoLimiter()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const coinIds = holdings.map(h => h.id).join(',');
      const response = await fetch(
        `${COINGECKO_BASE}/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`
      );
      
      if (!response.ok) throw new Error('Failed to fetch portfolio data');
      
      const data = await response.json();
      
      const portfolioCoins = holdings.map(holding => {
        const coinData = data[holding.id];
        if (!coinData) return null;
        
        const value = coinData.usd * holding.amount;
        return {
          id: holding.id,
          amount: holding.amount,
          current_price: coinData.usd,
          price_change_percentage_24h: coinData.usd_24h_change || 0,
          market_cap: coinData.usd_market_cap || 0,
          volume_24h: coinData.usd_24h_vol || 0,
          value
        };
      }).filter((coin): coin is CoinPrice & {amount: number, value: number} => coin !== null);
      
      const totalValue = portfolioCoins.reduce((sum, coin) => sum + coin.value, 0);
      const totalChange24h = portfolioCoins.reduce((sum, coin) => {
        const change = coin.value * (coin.price_change_percentage_24h / 100);
        return sum + change;
      }, 0);
      
      setPortfolio({
        totalValue,
        totalChange24h,
        coins: portfolioCoins
      });
      
      // Store in localStorage
      localStorage.setItem('portfolio_data', JSON.stringify({
        timestamp: Date.now(),
        data: { totalValue, totalChange24h, coins: portfolioCoins }
      }));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [holdings]);

  useEffect(() => {
    // Load from localStorage first
    const cached = localStorage.getItem('portfolio_data');
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < 300000) { // 5 minutes
        setPortfolio(data);
        return;
      }
    }
    
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  return { data: portfolio, loading, error, refetch: fetchPortfolioData };
}

// Real-time Price Feed Hook
export function useRealTimePrices(coinIds: string[], pollInterval = 30000): ApiResponse<CoinPrice[]> {
  const [data, setData] = useState<CoinPrice[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    if (!coinIds.length || !coinGeckoLimiter()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${COINGECKO_BASE}/coins/markets?vs_currency=usd&ids=${coinIds.join(',')}&order=market_cap_desc&sparkline=false`
      );
      
      if (!response.ok) throw new Error('Failed to fetch prices');
      
      const prices = await response.json();
      setData(prices);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [coinIds]);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, pollInterval);
    return () => clearInterval(interval);
  }, [fetchPrices, pollInterval]);

  return { data, loading, error, refetch: fetchPrices };
}

// Gas Tracker Hook
export function useGasTracker(): ApiResponse<GasPrice[]> {
  const [data, setData] = useState<GasPrice[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGasPrices = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Using DeFiLlama gas API
      const response = await fetch('https://api.llama.fi/v1/gas');
      
      if (!response.ok) throw new Error('Failed to fetch gas prices');
      
      const gasData = await response.json();
      setData(gasData);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGasPrices();
    const interval = setInterval(fetchGasPrices, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [fetchGasPrices]);

  return { data, loading, error, refetch: fetchGasPrices };
}

// Top Gainers/Losers Hook
export function useTopMovers(): ApiResponse<{gainers: CoinPrice[], losers: CoinPrice[]}> {
  const [data, setData] = useState<{gainers: CoinPrice[], losers: CoinPrice[]} | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTopMovers = useCallback(async () => {
    if (!coinGeckoLimiter()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&sparkline=false&price_change_percentage=24h`
      );
      
      if (!response.ok) throw new Error('Failed to fetch market data');
      
      const coins = await response.json();
      
      const sorted = coins.sort((a: any, b: any) => 
        b.price_change_percentage_24h - a.price_change_percentage_24h
      );
      
      const gainers = sorted.slice(0, 10);
      const losers = sorted.slice(-10).reverse();
      
      setData({ gainers, losers });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopMovers();
    const interval = setInterval(fetchTopMovers, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, [fetchTopMovers]);

  return { data, loading, error, refetch: fetchTopMovers };
}

// TVL Tracker Hook
export function useTVLTracker(): ApiResponse<Array<{name: string, tvl: number, change24h: number}>> {
  const [data, setData] = useState<Array<{name: string, tvl: number, change24h: number}> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTVLData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://api.llama.fi/protocols');
      
      if (!response.ok) throw new Error('Failed to fetch TVL data');
      
      const protocols = await response.json();
      
      // Get top 20 protocols by TVL
      const topProtocols = protocols
        .sort((a: any, b: any) => b.tvl - a.tvl)
        .slice(0, 20)
        .map((protocol: any) => ({
          name: protocol.name,
          tvl: protocol.tvl,
          change24h: protocol.change_1d || 0
        }));
      
      setData(topProtocols);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTVLData();
    const interval = setInterval(fetchTVLData, 600000); // Update every 10 minutes
    return () => clearInterval(interval);
  }, [fetchTVLData]);

  return { data, loading, error, refetch: fetchTVLData };
}

// Multi-chain Token Search Hook
export function useTokenSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchTokens = useCallback(async (query: string) => {
    if (!query.trim() || !coinGeckoLimiter()) return [];
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${COINGECKO_BASE}/search?query=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) throw new Error('Failed to search tokens');
      
      const data = await response.json();
      setLoading(false);
      
      return data.coins || [];
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
      return [];
    }
  }, []);

  return { searchTokens, loading, error };
}

// Watchlist Hook (uses localStorage + real-time prices)
export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  
  useEffect(() => {
    const saved = localStorage.getItem('crypto_watchlist');
    if (saved) {
      setWatchlist(JSON.parse(saved));
    }
  }, []);

  const addToWatchlist = useCallback((coinId: string) => {
    setWatchlist(prev => {
      if (prev.includes(coinId)) return prev;
      const updated = [...prev, coinId];
      localStorage.setItem('crypto_watchlist', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFromWatchlist = useCallback((coinId: string) => {
    setWatchlist(prev => {
      const updated = prev.filter(id => id !== coinId);
      localStorage.setItem('crypto_watchlist', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const watchlistPrices = useRealTimePrices(watchlist);

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    prices: watchlistPrices
  };
}
