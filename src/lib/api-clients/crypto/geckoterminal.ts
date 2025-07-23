/**
 * GeckoTerminal API TypeScript Client
 * Comprehensive client for accessing DeFi and DEX data across 200+ networks and 1,500+ DEXs
 * Free public API with extensive market data capabilities
 */

// Base API Configuration
const BASE_URL = 'https://api.geckoterminal.com/api/v2';
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Type definitions for API responses
export interface Network {
  id: string;
  type: string;
  attributes: {
    name: string;
    coingecko_asset_platform_id: string | null;
    native_token_id: string;
    native_token_symbol: string;
    native_token_address: string;
    chart_url: string;
  };
}

export interface Pool {
  id: string;
  type: string;
  attributes: {
    name: string;
    address: string;
    base_token_price_usd: string;
    quote_token_price_usd: string;
    base_token_price_native_currency: string;
    quote_token_price_native_currency: string;
    pool_created_at: string;
    reserve_in_usd: string;
    fdv_usd: string;
    market_cap_usd: string | null;
    price_change_percentage: {
      m5: string;
      h1: string;
      h6: string;
      h24: string;
    };
    transactions: {
      m5: {
        buys: number;
        sells: number;
      };
      m15: {
        buys: number;
        sells: number;
      };
      m30: {
        buys: number;
        sells: number;
      };
      h1: {
        buys: number;
        sells: number;
      };
      h24: {
        buys: number;
        sells: number;
      };
    };
    volume_usd: {
      m5: string;
      h1: string;
      h6: string;
      h24: string;
    };
  };
  relationships: {
    base_token: {
      data: {
        id: string;
        type: string;
      };
    };
    quote_token: {
      data: {
        id: string;
        type: string;
      };
    };
    dex: {
      data: {
        id: string;
        type: string;
      };
    };
  };
}

export interface Token {
  id: string;
  type: string;
  attributes: {
    address: string;
    name: string;
    symbol: string;
    image_url: string | null;
    coingecko_coin_id: string | null;
    decimals: number;
    total_supply: string | null;
    price_usd: string;
    fdv_usd: string;
    total_reserve_in_usd: string;
    volume_usd: {
      m5: string;
      h1: string;
      h6: string;
      h24: string;
    };
    market_cap_usd: string | null;
  };
}

export interface Dex {
  id: string;
  type: string;
  attributes: {
    name: string;
    identifier: string;
  };
}

export interface OHLCVData {
  data: {
    id: string;
    type: string;
    attributes: {
      ohlcv_list: Array<[number, number, number, number, number, number]>; // [timestamp, open, high, low, close, volume]
    };
    meta: {
      base: {
        address: string;
        name: string;
        symbol: string;
        coingecko_coin_id: string | null;
      };
      quote: {
        address: string;
        name: string;
        symbol: string;
        coingecko_coin_id: string | null;
      };
    };
  };
}

export interface TokenPrice {
  id: string;
  type: string;
  attributes: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    price_usd: string;
  };
}

export interface PoolAddress {
  data: {
    id: string;
    type: string;
    attributes: {
      address: string;
      name: string;
      pool_created_at: string;
    };
  }[];
}

// API Response wrapper
export interface APIResponse<T> {
  data: T;
  included?: any[];
  meta?: any;
}

// Query parameters interfaces
export interface PoolsQuery {
  include?: string[];
  page?: number;
  order?: 'h24_volume_usd_desc' | 'h24_volume_usd_asc' | 'h24_tx_count_desc' | 'h24_tx_count_asc';
}

export interface OHLCVQuery {
  timeframe: 'day' | 'hour' | 'minute';
  aggregate?: number;
  before_timestamp?: number;
  limit?: number;
  currency?: string;
  token?: string; // token address for pools with >2 tokens
}

export interface TokenQuery {
  include?: string[];
  page?: number;
}

export interface SearchQuery {
  query: string;
  network?: string;
  include?: string[];
  page?: number;
}

// Main GeckoTerminal API Client Class
export class GeckoTerminalAPI {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(customHeaders: Record<string, string> = {}) {
    this.baseUrl = BASE_URL;
    this.headers = { ...DEFAULT_HEADERS, ...customHeaders };
  }

  /**
   * Private method to make HTTP requests
   */
  private async request<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            url.searchParams.set(key, value.join(','));
          } else {
            url.searchParams.set(key, value.toString());
          }
        }
      });
    }

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ========== NETWORKS ENDPOINTS ==========

  /**
   * Get list of supported networks
   */
  async getNetworks(page = 1): Promise<APIResponse<Network[]>> {
    return this.request<APIResponse<Network[]>>('/networks', { page });
  }

  /**
   * Get network information by ID
   */
  async getNetwork(networkId: string): Promise<APIResponse<Network>> {
    return this.request<APIResponse<Network>>(`/networks/${networkId}`);
  }

  /**
   * Get DEXs on a specific network
   */
  async getNetworkDexes(networkId: string, page = 1): Promise<APIResponse<Dex[]>> {
    return this.request<APIResponse<Dex[]>>(`/networks/${networkId}/dexes`, { page });
  }

  /**
   * Get trending pools on a specific network
   */
  async getNetworkTrendingPools(networkId: string, include: string[] = [], page = 1): Promise<APIResponse<Pool[]>> {
    return this.request<APIResponse<Pool[]>>(`/networks/${networkId}/trending_pools`, {
      include: include.length > 0 ? include : undefined,
      page
    });
  }

  /**
   * Get pools on a specific network with filtering options
   */
  async getNetworkPools(networkId: string, query: PoolsQuery = {}): Promise<APIResponse<Pool[]>> {
    return this.request<APIResponse<Pool[]>>(`/networks/${networkId}/pools`, {
      include: query.include,
      page: query.page || 1,
      order: query.order
    });
  }

  /**
   * Get new pools on a specific network
   */
  async getNetworkNewPools(networkId: string, include: string[] = [], page = 1): Promise<APIResponse<Pool[]>> {
    return this.request<APIResponse<Pool[]>>(`/networks/${networkId}/new_pools`, {
      include: include.length > 0 ? include : undefined,
      page
    });
  }

  /**
   * Get top pools on a specific network
   */
  async getNetworkTopPools(networkId: string, include: string[] = [], page = 1): Promise<APIResponse<Pool[]>> {
    return this.request<APIResponse<Pool[]>>(`/networks/${networkId}/top_pools`, {
      include: include.length > 0 ? include : undefined,
      page
    });
  }

  // ========== POOLS ENDPOINTS ==========

  /**
   * Get specific pool information
   */
  async getPool(networkId: string, poolAddress: string, include: string[] = []): Promise<APIResponse<Pool>> {
    return this.request<APIResponse<Pool>>(`/networks/${networkId}/pools/${poolAddress}`, {
      include: include.length > 0 ? include : undefined
    });
  }

  /**
   * Get multiple pools information
   */
  async getPools(networkId: string, poolAddresses: string[], include: string[] = []): Promise<APIResponse<Pool[]>> {
    return this.request<APIResponse<Pool[]>>(`/networks/${networkId}/pools/multi/${poolAddresses.join(',')}`, {
      include: include.length > 0 ? include : undefined
    });
  }

  /**
   * Get pool's OHLCV data for charting
   */
  async getPoolOHLCV(networkId: string, poolAddress: string, query: OHLCVQuery): Promise<OHLCVData> {
    return this.request<OHLCVData>(`/networks/${networkId}/pools/${poolAddress}/ohlcv/${query.timeframe}`, {
      aggregate: query.aggregate,
      before_timestamp: query.before_timestamp,
      limit: query.limit,
      currency: query.currency,
      token: query.token
    });
  }

  /**
   * Get pool's transaction data
   */
  async getPoolTrades(networkId: string, poolAddress: string): Promise<any> {
    return this.request<any>(`/networks/${networkId}/pools/${poolAddress}/trades`);
  }

  // ========== TOKENS ENDPOINTS ==========

  /**
   * Get token information
   */
  async getToken(networkId: string, tokenAddress: string, include: string[] = []): Promise<APIResponse<Token>> {
    return this.request<APIResponse<Token>>(`/networks/${networkId}/tokens/${tokenAddress}`, { 
      include: include.length > 0 ? include : undefined
    });
  }

  /**
   * Get multiple tokens information
   */
  async getTokens(networkId: string, tokenAddresses: string[]): Promise<APIResponse<Token[]>> {
    return this.request<APIResponse<Token[]>>(`/networks/${networkId}/tokens/multi/${tokenAddresses.join(',')}`);
  }

  /**
   * Get token pools (all pools where token is traded)
   */
  async getTokenPools(networkId: string, tokenAddress: string, include: string[] = [], page = 1): Promise<APIResponse<Pool[]>> {
    return this.request<APIResponse<Pool[]>>(`/networks/${networkId}/tokens/${tokenAddress}/pools`, {
      include: include.length > 0 ? include : undefined,
      page
    });
  }

  /**
   * Get token price information
   */
  async getTokenPrice(networkId: string, tokenAddress: string): Promise<APIResponse<TokenPrice>> {
    return this.request<APIResponse<TokenPrice>>(`/simple/networks/${networkId}/token_price/${tokenAddress}`);
  }

  /**
   * Get multiple token prices
   */
  async getTokenPrices(networkId: string, tokenAddresses: string[]): Promise<APIResponse<TokenPrice[]>> {
    return this.request<APIResponse<TokenPrice[]>>(`/simple/networks/${networkId}/token_price/${tokenAddresses.join(',')}`);
  }

  // ========== DEX ENDPOINTS ==========

  /**
   * Get trending pools across all networks
   */
  async getTrendingPools(include: string[] = [], page = 1): Promise<APIResponse<Pool[]>> {
    return this.request<APIResponse<Pool[]>>('/pools/trending', {
      include: include.length > 0 ? include : undefined,
      page
    });
  }

  /**
   * Get new pools across all networks
   */
  async getNewPools(include: string[] = [], page = 1): Promise<APIResponse<Pool[]>> {
    return this.request<APIResponse<Pool[]>>('/pools/new', {
      include: include.length > 0 ? include : undefined,
      page
    });
  }

  /**
   * Get top pools across all networks
   */
  async getTopPools(include: string[] = [], page = 1): Promise<APIResponse<Pool[]>> {
    return this.request<APIResponse<Pool[]>>('/pools/top', {
      include: include.length > 0 ? include : undefined,
      page
    });
  }

  // ========== SEARCH ENDPOINTS ==========

  /**
   * Search for pools and tokens
   */
  async search(query: SearchQuery): Promise<any> {
    return this.request<any>('/search', {
      query: query.query,
      network: query.network,
      include: query.include,
      page: query.page || 1
    });
  }

  // ========== UTILITY METHODS ==========

  /**
   * Helper method to get comprehensive token data including pools and price
   */
  async getTokenComprehensive(networkId: string, tokenAddress: string): Promise<{
    token: APIResponse<Token>;
    pools: APIResponse<Pool[]>;
    price: APIResponse<TokenPrice>;
  }> {
    const [token, pools, price] = await Promise.all([
      this.getToken(networkId, tokenAddress),
      this.getTokenPools(networkId, tokenAddress, ['base_token', 'quote_token', 'dex']),
      this.getTokenPrice(networkId, tokenAddress)
    ]);

    return { token, pools, price };
  }

  /**
   * Helper method to get pool with OHLCV data
   */
  async getPoolWithChart(
    networkId: string, 
    poolAddress: string, 
    timeframe: 'day' | 'hour' | 'minute' = 'day',
    limit = 100
  ): Promise<{
    pool: APIResponse<Pool>;
    ohlcv: OHLCVData;
  }> {
    const [pool, ohlcv] = await Promise.all([
      this.getPool(networkId, poolAddress, ['base_token', 'quote_token', 'dex']),
      this.getPoolOHLCV(networkId, poolAddress, { timeframe, limit })
    ]);

    return { pool, ohlcv };
  }

  /**
   * Helper method to get multiple comprehensive pool data
   */
  async getPoolsComprehensive(networkId: string, poolAddresses: string[]): Promise<{
    pools: APIResponse<Pool[]>;
    ohlcvData: OHLCVData[];
  }> {
    const pools = await this.getPools(networkId, poolAddresses, ['base_token', 'quote_token', 'dex']);
    
    const ohlcvPromises = poolAddresses.map(address => 
      this.getPoolOHLCV(networkId, address, { timeframe: 'day', limit: 30 })
    );
    
    const ohlcvData = await Promise.all(ohlcvPromises);

    return { pools, ohlcvData };
  }

  /**
   * Helper method to get trending data across networks
   */
  async getTrendingDataGlobal(): Promise<{
    trendingPools: APIResponse<Pool[]>;
    newPools: APIResponse<Pool[]>;
    topPools: APIResponse<Pool[]>;
  }> {
    const [trendingPools, newPools, topPools] = await Promise.all([
      this.getTrendingPools(['base_token', 'quote_token', 'dex']),
      this.getNewPools(['base_token', 'quote_token', 'dex']),
      this.getTopPools(['base_token', 'quote_token', 'dex'])
    ]);

    return { trendingPools, newPools, topPools };
  }

  /**
   * Helper method to format OHLCV data for charting libraries
   */
  formatOHLCVForChart(ohlcvData: OHLCVData): Array<{
    timestamp: number;
    datetime: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }> {
    return ohlcvData.data.attributes.ohlcv_list.map(([timestamp, open, high, low, close, volume]) => ({
      timestamp,
      datetime: new Date(timestamp * 1000).toISOString(),
      open,
      high,
      low,
      close,
      volume
    }));
  }

  /**
   * Helper method to calculate price changes and statistics
   */
  calculatePriceStats(ohlcvData: OHLCVData): {
    currentPrice: number;
    priceChange24h: number;
    priceChangePercent24h: number;
    high24h: number;
    low24h: number;
    volume24h: number;
  } {
    const data = ohlcvData.data.attributes.ohlcv_list;
    if (data.length === 0) {
      return {
        currentPrice: 0,
        priceChange24h: 0,
        priceChangePercent24h: 0,
        high24h: 0,
        low24h: 0,
        volume24h: 0
      };
    }

    const latest = data[data.length - 1];
    const previous = data.length > 1 ? data[data.length - 2] : latest;
    
    const currentPrice = latest[4]; // close price
    const previousPrice = previous[4];
    const priceChange24h = currentPrice - previousPrice;
    const priceChangePercent24h = previousPrice !== 0 ? (priceChange24h / previousPrice) * 100 : 0;
    
    const high24h = Math.max(...data.slice(-24).map(d => d[2]));
    const low24h = Math.min(...data.slice(-24).map(d => d[3]));
    const volume24h = data.slice(-24).reduce((sum, d) => sum + d[5], 0);

    return {
      currentPrice,
      priceChange24h,
      priceChangePercent24h,
      high24h,
      low24h,
      volume24h
    };
  }
}

// Export default instance
export default new GeckoTerminalAPI();

// Example usage:
/*
import { GeckoTerminalAPI } from './geckoterminal';

const api = new GeckoTerminalAPI();

// Get all networks
const networks = await api.getNetworks();

// Get Ethereum trending pools
const ethTrending = await api.getNetworkTrendingPools('eth');

// Get comprehensive token data
const tokenData = await api.getTokenComprehensive('eth', '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48');

// Get pool with chart data
const poolWithChart = await api.getPoolWithChart('eth', '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640');

// Search for tokens/pools
const searchResults = await api.search({ query: 'USDC', network: 'eth' });
*/
