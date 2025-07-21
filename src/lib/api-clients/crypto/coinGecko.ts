// CoinGecko API TypeScript Client - FREE ENDPOINTS ONLY
// Documentation: https://www.coingecko.com/en/api/documentation
// 
// FREE PLAN LIMITATIONS:
// - Rate limit: 30 calls/minute
// - Monthly limit: 10,000 calls
// - Only includes endpoints available on the free Demo plan

export interface CoinGeckoConfig {
    baseUrl?: string;
    timeout?: number;
    headers?: Record<string, string>;
  }
  
  export interface Coin {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    fully_diluted_valuation: number;
    total_volume: number;
    high_24h: number;
    low_24h: number;
    price_change_24h: number;
    price_change_percentage_24h: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    ath: number;
    ath_change_percentage: number;
    ath_date: string;
    atl: number;
    atl_change_percentage: number;
    atl_date: string;
    roi: any;
    price_change_percentage_7d_in_currency: number;
    last_updated: string;
  }
  
  export interface CoinPrice {
    [coinId: string]: {
      [currency: string]: number;
    };
  }
  
  export interface MarketData {
    prices: [number, number][];
    market_caps: [number, number][];
    total_volumes: [number, number][];
  }
  
  export interface CoinDetails {
    id: string;
    symbol: string;
    name: string;
    description: {
      en: string;
    };
    image: {
      thumb: string;
      small: string;
      large: string;
    };
    market_cap_rank: number;
    market_data: {
      current_price: { [currency: string]: number };
      market_cap: { [currency: string]: number };
      total_volume: { [currency: string]: number };
      price_change_percentage_24h: number;
      market_cap_change_percentage_24h: number;
      circulating_supply: number;
      total_supply: number;
      max_supply: number | null;
      ath: { [currency: string]: number };
      ath_change_percentage: { [currency: string]: number };
      ath_date: { [currency: string]: string };
      price_change_percentage_7d: number;
      price_change_percentage_14d: number;
      price_change_percentage_30d: number;
      price_change_percentage_60d: number;
      price_change_percentage_200d: number;
      price_change_percentage_1y: number;
      atl: { [currency: string]: number };
      atl_change_percentage: { [currency: string]: number };
      atl_date: { [currency: string]: string };
    };
    community_data: {
      facebook_likes: number;
      twitter_followers: number;
      reddit_average_posts_48h: number;
      reddit_average_comments_48h: number;
      reddit_subscribers: number;
      reddit_accounts_active_48h: number;
      telegram_channel_user_count: number;
    };
    developer_data: {
      forks: number;
      stars: number;
      subscribers: number;
      total_issues: number;
      closed_issues: number;
      pull_requests_merged: number;
      pull_request_contributors: number;
      code_additions_deletions_4_weeks: {
        additions: number;
        deletions: number;
      };
      commit_count_4_weeks: number;
    };
    genesis_date?: string;
    hashing_algorithm?: string;
    links: {
      homepage: string[];
      blockchain_site: string[];
      official_forum_url: string[];
      chat_url: string[];
      announcement_url: string[];
      twitter_screen_name: string;
      facebook_username: string;
      bitcointalk_thread_identifier: string | null;
      telegram_channel_identifier: string;
      subreddit_url: string;
      repos_url: {
        github: string[];
        bitbucket: string[];
      };
    };
  }
  
  export interface GlobalData {
    data: {
      active_cryptocurrencies: number;
      upcoming_icos: number;
      ongoing_icos: number;
      ended_icos: number;
      markets: number;
      total_market_cap: { [currency: string]: number };
      total_volume: { [currency: string]: number };
      market_cap_percentage: { [currency: string]: number };
      market_cap_change_percentage_24h_usd: number;
      updated_at: number;
    };
  }
  
  export class CoinGeckoAPI {
    private baseUrl: string;
    private timeout: number;
    private headers: Record<string, string>;
  
    constructor(config: CoinGeckoConfig = {}) {
      this.baseUrl = config.baseUrl || 'https://api.coingecko.com/api/v3';
      this.timeout = config.timeout || 10000;
      this.headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'FudCourtt-CoinGeckoClient/1.0',
        ...config.headers,
      };
    }
  
    private async request<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
      const url = new URL(`${this.baseUrl}${endpoint}`);
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }
  
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
  
      try {
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: this.headers,
          signal: controller.signal,
        });
  
        clearTimeout(timeoutId);
  
        if (!response.ok) {
          throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
        }
  
        return await response.json();
      } catch (error: unknown) {
        clearTimeout(timeoutId);
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          throw new Error('Network error: Unable to connect to CoinGecko API. Please check your internet connection or try again later.');
        }
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timed out.');
        }
        throw error;
      }
    }
  
    // ===== PING =====
    /**
     * Check API server status
     */
    async ping(): Promise<{ gecko_says: string }> {
      return this.request<{ gecko_says: string }>('/ping');
    }
  
    // ===== SIMPLE PRICE =====
    /**
     * Get current price of coins
     */
    async getSimplePrice(params: {
      ids: string;
      vs_currencies: string;
      include_market_cap?: boolean;
      include_24hr_vol?: boolean;
      include_24hr_change?: boolean;
      include_last_updated_at?: boolean;
      precision?: number;
    }): Promise<CoinPrice> {
      return this.request<CoinPrice>('/simple/price', params);
    }
  
    /**
     * Get list of supported vs currencies
     */
    async getSupportedVsCurrencies(): Promise<string[]> {
      return this.request<string[]>('/simple/supported_vs_currencies');
    }
  
    // ===== COINS =====
    /**
     * Get list of coins with market data
     */
    async getCoinsMarkets(params: {
      vs_currency: string;
      ids?: string;
      order?: string;
      per_page?: number;
      page?: number;
      sparkline?: boolean;
      price_change_percentage?: string;
    }): Promise<Coin[]> {
      return this.request<Coin[]>('/coins/markets', params);
    }
  
    /**
     * Get list of all supported coins
     */
    async getCoinsList(params?: {
      include_platform?: boolean;
    }): Promise<{ id: string; symbol: string; name: string; platforms?: any }[]> {
      return this.request<{ id: string; symbol: string; name: string; platforms?: any }[]>('/coins/list', params);
    }
  
    /**
     * Get detailed information about a specific coin
     */
    async getCoinById(params: {
      id: string;
      localization?: boolean;
      tickers?: boolean;
      market_data?: boolean;
      community_data?: boolean;
      developer_data?: boolean;
      sparkline?: boolean;
    }): Promise<CoinDetails> {
      const { id, ...queryParams } = params;
      return this.request<CoinDetails>(`/coins/${id}`, queryParams);
    }
  
    /**
     * Get historical market data for a coin
     */
    async getCoinMarketChart(params: {
      id: string;
      vs_currency: string;
      days: number | string;
      interval?: string;
    }): Promise<MarketData> {
      const { id, ...queryParams } = params;
      return this.request<MarketData>(`/coins/${id}/market_chart`, queryParams);
    }
  
    /**
     * Get historical market data within a date range
     */
    async getCoinMarketChartRange(params: {
      id: string;
      vs_currency: string;
      from: number;
      to: number;
    }): Promise<MarketData> {
      const { id, ...queryParams } = params;
      return this.request<MarketData>(`/coins/${id}/market_chart/range`, queryParams);
    }
  
    // ===== SEARCH =====
    /**
     * Search for coins, exchanges, and categories
     */
    async search(query: string): Promise<{
      coins: Array<{
        id: string;
        name: string;
        symbol: string;
        market_cap_rank: number;
        thumb: string;
        large: string;
      }>;
      exchanges: Array<{
        id: string;
        name: string;
        market_type: string;
        thumb: string;
        large: string;
      }>;
      categories: Array<{
        id: number;
        name: string;
      }>;
    }> {
      return this.request('/search', { query });
    }
  
    // ===== TRENDING =====
    /**
     * Get trending coins
     */
    async getTrendingCoins(): Promise<{
      coins: Array<{
        item: {
          id: string;
          coin_id: number;
          name: string;
          symbol: string;
          market_cap_rank: number;
          thumb: string;
          small: string;
          large: string;
          slug: string;
          price_btc: number;
          score: number;
        };
      }>;
      nfts: Array<{
        id: string;
        name: string;
        symbol: string;
        thumb: string;
      }>;
      categories: Array<{
        id: number;
        name: string;
        market_cap_1h_change: number;
        slug: string;
        coins_count: number;
      }>;
    }> {
      return this.request('/search/trending');
    }
  
    // ===== GLOBAL =====
    /**
     * Get global cryptocurrency data
     */
    async getGlobal(): Promise<GlobalData> {
      return this.request<GlobalData>('/global');
    }
  
    /**
     * Get BTC-to-Currency exchange rates
     */
    async getExchangeRates(): Promise<{
      rates: Record<string, {
        name: string;
        unit: string;
        value: number;
        type: string;
      }>;
    }> {
      return this.request('/exchange_rates');
    }
  }
  
  // Usage examples:
  export const createCoinGeckoClient = (config?: CoinGeckoConfig) => {
    return new CoinGeckoAPI(config);
  };
  
  // Example usage - ALL FREE ENDPOINTS:
  /*
  const client = createCoinGeckoClient();
  
  // 1. Check API status
  const status = await client.ping();
  console.log(status); // { gecko_says: "(V3) To the Moon!" }
  
  // 2. Get Bitcoin and Ethereum prices in USD
  const prices = await client.getSimplePrice({
    ids: 'bitcoin,ethereum',
    vs_currencies: 'usd',
    include_24hr_change: true
  });
  console.log(prices); // { bitcoin: { usd: 43000 }, ethereum: { usd: 2500 } }
  
  // 3. Get supported currencies
  const currencies = await client.getSupportedVsCurrencies();
  console.log(currencies); // ['usd', 'eur', 'jpy', ...]
  
  // 4. Get top 10 coins by market cap
  const topCoins = await client.getCoinsMarkets({
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: 10,
    page: 1
  });
  
  // 5. Get all coins list
  const allCoins = await client.getCoinsList();
  
  // 6. Get Bitcoin details
  const bitcoin = await client.getCoinById({
    id: 'bitcoin',
    market_data: true
  });
  
  // 7. Get Bitcoin price history for last 30 days
  const history = await client.getCoinMarketChart({
    id: 'bitcoin',
    vs_currency: 'usd',
    days: 30
  });
  
  // 8. Get Bitcoin price history within date range
  const rangeHistory = await client.getCoinMarketChartRange({
    id: 'bitcoin',
    vs_currency: 'usd',
    from: 1609459200, // Jan 1, 2021
    to: 1640995200    // Dec 31, 2021
  });
  
  // 9. Search for coins
  const searchResults = await client.search('bitcoin');
  
  // 10. Get trending coins
  const trending = await client.getTrendingCoins();
  
  // 11. Get global crypto market data
  const globalData = await client.getGlobal();
  
  // 12. Get BTC exchange rates
  const exchangeRates = await client.getExchangeRates();
  */