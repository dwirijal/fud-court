/**
 * DexScreener API TypeScript Client - FREE ENDPOINTS ONLY
 * Documentation: https://docs.dexscreener.com/api/reference
 * 
 * FREE PLAN LIMITATIONS:
 * - Rate limit: 300 requests/minute per IP
 * - Weight limit: 300/minute per IP
 * - Only includes endpoints available on the free/public plan
 * - No private endpoints (account info, trading, etc.)
 * 
 * Author: DexScreener API Client
 * Version: 1.0.0
 */

// ========================================
// TYPES & INTERFACES
// ========================================

export interface DexScreenerPair {
    chainId: string;
    dexId: string;
    url: string;
    pairAddress: string;
    baseToken: {
      address: string;
      name: string;
      symbol: string;
    };
    quoteToken: {
      address: string;
      name: string;
      symbol: string;
    };
    priceNative: string;
    priceUsd?: string;
    txns: {
      m5: { buys: number; sells: number };
      h1: { buys: number; sells: number };
      h6: { buys: number; sells: number };
      h24: { buys: number; sells: number };
    };
    volume: {
      h24: number;
      h6: number;
      h1: number;
      m5: number;
    };
    priceChange: {
      m5: number;
      h1: number;
      h6: number;
      h24: number;
    };
    liquidity?: {
      usd?: number;
      base?: number;
      quote?: number;
    };
    fdv?: number;
    marketCap?: number;
    pairCreatedAt?: number;
    info?: {
      imageUrl?: string;
      websites?: Array<{ label: string; url: string }>;
      socials?: Array<{ type: string; url: string }>;
    };
    boosts?: {
      active: number;
    };
  }
  
  export interface DexScreenerToken {
    address: string;
    name: string;
    symbol: string;
    imageUrl?: string;
  }
  
  export interface DexScreenerSearchResult {
    schemaVersion: string;
    pairs: DexScreenerPair[];
  }
  
  export interface DexScreenerTokenResponse {
    schemaVersion: string;
    pairs: DexScreenerPair[];
  }
  
  export interface DexScreenerPairsResponse {
    schemaVersion: string;
    pair: DexScreenerPair | null;
  }
  
  export interface RateLimitInfo {
    remaining: number;
    reset: number;
    limit: number;
  }
  
  export interface DexScreenerClientOptions {
    baseUrl?: string;
    timeout?: number;
    retryAttempts?: number;
    retryDelay?: number;
  }
  
  // ========================================
  // RATE LIMITER CLASS
  // ========================================
  
  class RateLimiter {
    private requests: number[] = [];
    private readonly maxRequests: number;
    private readonly timeWindow: number;
  
    constructor(maxRequests: number = 300, timeWindowMs: number = 60000) {
      this.maxRequests = maxRequests;
      this.timeWindow = timeWindowMs;
    }
  
    /**
     * Check if request can be made within rate limit
     * Implements sliding window rate limiting
     */
    canMakeRequest(): boolean {
      const now = Date.now();
      
      // Remove old requests outside the time window
      this.requests = this.requests.filter(time => now - time < this.timeWindow);
      
      return this.requests.length < this.maxRequests;
    }
  
    /**
     * Record a request attempt
     */
    recordRequest(): void {
      this.requests.push(Date.now());
    }
  
    /**
     * Get time until next request is allowed (in ms)
     */
    getTimeUntilReset(): number {
      if (this.requests.length < this.maxRequests) return 0;
      
      const oldestRequest = Math.min(...this.requests);
      return this.timeWindow - (Date.now() - oldestRequest);
    }
  
    /**
     * Get current rate limit status
     */
    getStatus(): { remaining: number; resetTime: number } {
      const now = Date.now();
      this.requests = this.requests.filter(time => now - time < this.timeWindow);
      
      return {
        remaining: this.maxRequests - this.requests.length,
        resetTime: this.requests.length > 0 ? Math.max(...this.requests) + this.timeWindow : now
      };
    }
  }
  
  // ========================================
  // MAIN DEXSCREENER CLIENT
  // ========================================
  
  export class DexScreenerClient {
    private readonly baseUrl: string;
    private readonly timeout: number;
    private readonly retryAttempts: number;
    private readonly retryDelay: number;
    private readonly rateLimiter: RateLimiter;
  
    constructor(options: DexScreenerClientOptions = {}) {
      this.baseUrl = options.baseUrl || 'https://api.dexscreener.com';
      this.timeout = options.timeout || 30000;
      this.retryAttempts = options.retryAttempts || 3;
      this.retryDelay = options.retryDelay || 1000;
      this.rateLimiter = new RateLimiter(300, 60000); // 300 requests per minute
    }
  
    /**
     * Internal method to make HTTP requests with rate limiting and retry logic
     */
    private async makeRequest<T>(endpoint: string, retryCount: number = 0): Promise<T> {
      // Check rate limit before making request
      if (!this.rateLimiter.canMakeRequest()) {
        const waitTime = this.rateLimiter.getTimeUntilReset();
        throw new Error(`Rate limit exceeded. Wait ${Math.ceil(waitTime / 1000)} seconds before next request.`);
      }
  
      const url = `${this.baseUrl}${endpoint}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
  
      try {
        // Record the request attempt
        this.rateLimiter.recordRequest();
  
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'DexScreener-TS-Client/1.0.0'
          },
          signal: controller.signal
        });
  
        clearTimeout(timeoutId);
  
        // Handle rate limit response (429)
        if (response.status === 429) {
          const resetTime = response.headers.get('X-RateLimit-Reset');
          const retryAfter = response.headers.get('Retry-After');
          
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 60000;
          
          if (retryCount < this.retryAttempts) {
            console.warn(`Rate limited. Retrying after ${waitTime}ms...`);
            await this.sleep(waitTime);
            return this.makeRequest<T>(endpoint, retryCount + 1);
          }
          
          throw new Error(`Rate limit exceeded after ${retryCount} retries`);
        }
  
        // Handle other HTTP errors
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
  
        const data = await response.json();
        return data as T;
  
      } catch (error: unknown) {
        clearTimeout(timeoutId);

        // Safely check for error.name
        const isNetworkError = (err: unknown): err is Error => {
          return (
            err instanceof TypeError ||
            (typeof err === 'object' && err !== null && 'name' in err && (err as Error).name === 'AbortError')
          );
        };

        // Handle network errors with retry
        if (retryCount < this.retryAttempts && isNetworkError(error)) {
          console.warn(`Request failed, retrying... (${retryCount + 1}/${this.retryAttempts})`);
          await this.sleep(this.retryDelay * Math.pow(2, retryCount)); // Exponential backoff
          return this.makeRequest<T>(endpoint, retryCount + 1);
        }

        throw error;
      }
    }
  
    /**
     * Utility method for delays
     */
    private sleep(ms: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  
    // ========================================
    // PUBLIC API METHODS - FREE ENDPOINTS ONLY
    // ========================================
  
    /**
     * GET /latest/dex/tokens/{tokenAddresses}
     * Get pairs for one or more token addresses (comma-separated)
     * 
     * @param tokenAddresses - Comma-separated token addresses
     * @returns Promise<DexScreenerTokenResponse>
     */
    async getTokens(tokenAddresses: string | string[]): Promise<DexScreenerTokenResponse> {
      const addresses = Array.isArray(tokenAddresses) 
        ? tokenAddresses.join(',') 
        : tokenAddresses;
      
      return this.makeRequest<DexScreenerTokenResponse>(`/latest/dex/tokens/${addresses}`);
    }
  
    /**
     * GET /latest/dex/pairs/{chainId}/{pairAddress}
     * Get pair information by chain ID and pair address
     * 
     * @param chainId - Blockchain identifier (e.g., 'ethereum', 'bsc', 'polygon')
     * @param pairAddress - Pair contract address
     * @returns Promise<DexScreenerPairsResponse>
     */
    async getPair(chainId: string, pairAddress: string): Promise<DexScreenerPairsResponse> {
      return this.makeRequest<DexScreenerPairsResponse>(`/latest/dex/pairs/${chainId}/${pairAddress}`);
    }
  
    /**
     * GET /latest/dex/pairs/{pairAddresses}
     * Get pairs by addresses (comma-separated, up to 30 addresses)
     * 
     * @param pairAddresses - Comma-separated pair addresses
     * @returns Promise<DexScreenerSearchResult>
     */
    async getPairs(chainId: string, pairAddresses: string | string[]): Promise<DexScreenerSearchResult> {
      const addresses = Array.isArray(pairAddresses) 
        ? pairAddresses.join(',') 
        : pairAddresses;
      
      return this.makeRequest<DexScreenerSearchResult>(`/latest/dex/pairs/${chainId}/${addresses}`);
    }
  
    /**
     * GET /latest/dex/search/?q={query}
     * Search for pairs matching query
     * 
     * @param query - Search query (token symbol, name, or address)
     * @returns Promise<DexScreenerSearchResult>
     */
    async search(query: string): Promise<DexScreenerSearchResult> {
      const encodedQuery = encodeURIComponent(query);
      return this.makeRequest<DexScreenerSearchResult>(`/latest/dex/search/?q=${encodedQuery}`);
    }
  
    /**
     * GET /orders/v1/{chainId}/{tokenAddress}
     * Get token profile information (if available)
     * Note: This might be limited or require special access
     * 
     * @param chainId - Blockchain identifier
     * @param tokenAddress - Token contract address
     * @returns Promise<any> - Profile data structure may vary
     */
    async getTokenProfile(chainId: string, tokenAddress: string): Promise<any> {
      return this.makeRequest<any>(`/orders/v1/${chainId}/${tokenAddress}`);
    }
  
    // ========================================
    // UTILITY METHODS
    // ========================================
  
    /**
     * Get current rate limit status
     */
    getRateLimitStatus(): { remaining: number; resetTime: number } {
      return this.rateLimiter.getStatus();
    }
  
    /**
     * Get supported chain IDs
     * Note: This is a static list - check DexScreener docs for updates
     */
    getSupportedChains(): string[] {
      return [
        'ethereum',
        'bsc',
        'polygon',
        'avalanche',
        'fantom',
        'cronos',
        'arbitrum',
        'optimism',
        'harmony',
        'moonbeam',
        'moonriver',
        'dogechain',
        'fusion',
        'kcc',
        'oec',
        'heco',
        'celo',
        'metis',
        'boba',
        'aurora',
        'astar',
        'kardia',
        'velas',
        'iotex',
        'thundercore',
        'fuse',
        'smartbch',
        'elastos',
        'hoo',
        'kava',
        'step',
        'godwoken',
        'milkomeda',
        'dfk',
        'klaytn',
        'rei',
        'canto',
        'aptos',
        'cardano',
        'osmosis',
        'terra',
        'injective',
        'sui'
      ];
    }
  
    /**
     * Helper method to get trending pairs by chain
     * Uses search with empty query to get popular results
     */
    async getTrendingPairs(chainId?: string): Promise<DexScreenerSearchResult> {
      let query = '';
      if (chainId) {
        // This is a workaround - the API doesn't have a dedicated trending endpoint
        // We search for the chain's native token symbol as proxy
        const nativeTokens: { [key: string]: string } = {
          'ethereum': 'ETH',
          'bsc': 'BNB',
          'polygon': 'MATIC',
          'avalanche': 'AVAX',
          'fantom': 'FTM',
          'arbitrum': 'ARB',
          'optimism': 'OP'
        };
        query = nativeTokens[chainId] || 'USD';
      }
      return this.search(query);
    }
  
    /**
     * Helper method to filter pairs by minimum liquidity
     */
    filterByLiquidity(pairs: DexScreenerPair[], minLiquidityUsd: number): DexScreenerPair[] {
      return pairs.filter(pair => 
        pair.liquidity?.usd && pair.liquidity.usd >= minLiquidityUsd
      );
    }
  
    /**
     * Helper method to filter pairs by minimum 24h volume
     */
    filterByVolume(pairs: DexScreenerPair[], minVolumeUsd: number): DexScreenerPair[] {
      return pairs.filter(pair => pair.volume.h24 >= minVolumeUsd);
    }
  
    /**
     * Helper method to sort pairs by 24h price change
     */
    sortByPriceChange(pairs: DexScreenerPair[], descending: boolean = true): DexScreenerPair[] {
      return [...pairs].sort((a, b) => {
        const changeA = a.priceChange.h24 || 0;
        const changeB = b.priceChange.h24 || 0;
        return descending ? changeB - changeA : changeA - changeB;
      });
    }
  
    /**
     * Helper method to format pair data for display
     */
    formatPairInfo(pair: DexScreenerPair): string {
      const symbol = `${pair.baseToken.symbol}/${pair.quoteToken.symbol}`;
      const price = pair.priceUsd ? `$${parseFloat(pair.priceUsd).toFixed(6)}` : 'N/A';
      const change24h = pair.priceChange.h24 ? `${pair.priceChange.h24.toFixed(2)}%` : 'N/A';
      const volume24h = pair.volume.h24 ? `$${pair.volume.h24.toLocaleString()}` : 'N/A';
      const liquidity = pair.liquidity?.usd ? `$${pair.liquidity.usd.toLocaleString()}` : 'N/A';
  
      return `${symbol} | Price: ${price} | 24h: ${change24h} | Vol: ${volume24h} | Liq: ${liquidity}`;
    }
  }
  
  // ========================================
  // USAGE EXAMPLES & EXPORT
  // ========================================
  
  export default DexScreenerClient;
  
  /**
   * USAGE EXAMPLES:
   * 
   * // Initialize client
   * const client = new DexScreenerClient({
   *   timeout: 30000,
   *   retryAttempts: 3
   * });
   * 
   * // Search for tokens
   * try {
   *   const searchResults = await client.search('PEPE');
   *   console.log(`Found ${searchResults.pairs.length} pairs`);
   *   
   *   // Filter and sort results
   *   const highVolumePairs = client.filterByVolume(searchResults.pairs, 100000);
   *   const sortedPairs = client.sortByPriceChange(highVolumePairs);
   *   
   *   sortedPairs.slice(0, 5).forEach(pair => {
   *     console.log(client.formatPairInfo(pair));
   *   });
   * } catch (error) {
   *   console.error('Error:', error);
   * }
   * 
   * // Get specific token pairs
   * try {
   *   const tokenData = await client.getTokens('0xa0b86a33e6f8b8b436c9b7fa9e3e0b4c6d7f3a89');
   *   console.log('Token pairs:', tokenData.pairs);
   * } catch (error) {
   *   console.error('Error fetching token:', error);
   * }
   * 
   * // Check rate limit status
   * const rateLimitStatus = client.getRateLimitStatus();
   * console.log(`Rate limit - Remaining: ${rateLimitStatus.remaining}`);
   */