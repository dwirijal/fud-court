/**
 * GlassNode TypeScript Client - FREE ENDPOINTS ONLY
 * Documentation: https://docs.glassnode.com/api/addresses
 * 
 * FREE PLAN LIMITATIONS:
 * - Rate limit: 10 requests/minute per IP
 * - Weight limit: 100/minute per IP  
 * - Only includes endpoints available on the free/public plan
 * - No private endpoints (account info, trading, etc.)
 */

// Base configuration
const BASE_URL = 'https://api.glassnode.com';
const FREE_TIER_ENDPOINTS = {
  // Network fundamentals
  ACTIVE_ADDRESSES: '/v1/metrics/addresses/active_count',
  NEW_ADDRESSES: '/v1/metrics/addresses/new_non_zero_count',
  ZERO_BALANCE_ADDRESSES: '/v1/metrics/addresses/min_1_count',
  
  // Market data
  PRICE_USD: '/v1/metrics/market/price_usd_close',
  PRICE_BTC: '/v1/metrics/market/price_btc_close',
  MARKET_CAP: '/v1/metrics/market/marketcap_usd',
  
  // Network activity
  TRANSACTION_COUNT: '/v1/metrics/transactions/count',
  TRANSFER_COUNT: '/v1/metrics/transactions/transfers_count',
  BLOCK_HEIGHT: '/v1/metrics/blockchain/block_height',
  BLOCK_SIZE_MEAN: '/v1/metrics/blockchain/block_size_mean',
  
  // Supply metrics
  SUPPLY_CURRENT: '/v1/metrics/supply/current',
  SUPPLY_INFLATION_RATE: '/v1/metrics/supply/inflation_rate',
  
  // Fees
  FEES_MEAN: '/v1/metrics/fees/fee_ratio_multiple',
  FEES_MEDIAN: '/v1/metrics/fees/gas_price_median',
  
  // Hash rate & mining
  HASH_RATE: '/v1/metrics/mining/hash_rate_mean',
  DIFFICULTY: '/v1/metrics/mining/difficulty_latest',
  
  // Exchange flows (limited)
  EXCHANGE_INFLOW: '/v1/metrics/transactions/transfers_to_exchanges_count',
  EXCHANGE_OUTFLOW: '/v1/metrics/transactions/transfers_from_exchanges_count',
} as const;

// Types
export interface GlassNodeConfig {
  apiKey?: string; // Optional for free tier
  baseUrl?: string;
  timeout?: number;
}

export interface MetricParams {
  asset: string;
  since?: string; // ISO date string or timestamp
  until?: string; // ISO date string or timestamp
  interval?: '1h' | '24h' | '1w' | '1month';
  format?: 'JSON' | 'CSV';
  timestamp_format?: 'unix' | 'humanized';
}

export interface MetricResponse {
  timestamp: number;
  value: number | string;
}

export interface AssetInfo {
  asset: string;
  name: string;
  symbol: string;
  slug: string;
}

// Supported assets for free tier
export const FREE_TIER_ASSETS = [
  'BTC', 'ETH', 'LTC', 'BCH', 'BSV', 'ZEC', 'DASH', 'DCR',
  'DGB', 'DOGE', 'RDD', 'VTC'
] as const;

export type FreeTierAsset = typeof FREE_TIER_ASSETS[number];

export class GlassNodeError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'GlassNodeError';
  }
}

export class GlassNodeClient {
  private config: Required<GlassNodeConfig>;

  constructor(config: GlassNodeConfig = {}) {
    this.config = {
      apiKey: config.apiKey || '',
      baseUrl: config.baseUrl || BASE_URL,
      timeout: config.timeout || 30000,
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    params: Partial<MetricParams>
  ): Promise<T> {
    const url = new URL(`${this.config.baseUrl}${endpoint}`);
    
    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add API key if provided (not required for free tier)
    if (this.config.apiKey) {
      headers['X-API-KEY'] = this.config.apiKey;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.text();
        throw new GlassNodeError(
          `API request failed: ${errorData}`,
          response.status,
          response.statusText
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof GlassNodeError) {
        throw error;
      }
      
      if (error instanceof Error) {
        throw new GlassNodeError(`Request failed: ${error.message}`);
      }
      
      throw new GlassNodeError('Unknown error occurred');
    }
  }

  // Network & Address Metrics
  async getActiveAddresses(params: MetricParams): Promise<MetricResponse[]> {
    return this.makeRequest(FREE_TIER_ENDPOINTS.ACTIVE_ADDRESSES, params);
  }

  async getNewAddresses(params: MetricParams): Promise<MetricResponse[]> {
    return this.makeRequest(FREE_TIER_ENDPOINTS.NEW_ADDRESSES, params);
  }

  async getZeroBalanceAddresses(params: MetricParams): Promise<MetricResponse[]> {
    return this.makeRequest(FREE_TIER_ENDPOINTS.ZERO_BALANCE_ADDRESSES, params);
  }

  // Market Data
  async getPriceUSD(params: MetricParams): Promise<MetricResponse[]> {
    return this.makeRequest(FREE_TIER_ENDPOINTS.PRICE_USD, params);
  }

  async getPriceBTC(params: MetricParams): Promise<MetricResponse[]> {
    return this.makeRequest(FREE_TIER_ENDPOINTS.PRICE_BTC, params);
  }

  async getMarketCap(params: MetricParams): Promise<MetricResponse[]> {
    return this.makeRequest(FREE_TIER_ENDPOINTS.MARKET_CAP, params);
  }

  // Network Activity
  async getTransactionCount(params: MetricParams): Promise<MetricResponse[]> {
    return this.makeRequest(FREE_TIER_ENDPOINTS.TRANSACTION_COUNT, params);
  }

  async getTransferCount(params: MetricParams): Promise<MetricResponse[]> {
    return this.makeRequest(FREE_TIER_ENDPOINTS.TRANSFER_COUNT, params);
  }

  async getBlockHeight(params: MetricParams): Promise<MetricResponse[]> {
    return this.makeRequest(FREE_TIER_ENDPOINTS.BLOCK_HEIGHT, params);
  }

  async getBlockSizeMean(params: MetricParams): Promise<MetricResponse[]> {
    return this.makeRequest(FREE_TIER_ENDPOINTS.BLOCK_SIZE_MEAN, params);
  }

  // Supply Metrics
  async getCurrentSupply(params: MetricParams): Promise<MetricResponse[]> {
    return this.makeRequest(FREE_TIER_ENDPOINTS.SUPPLY_CURRENT, params);
  }

  async getInflationRate(params: MetricParams): Promise<MetricResponse[]> {
    return this.makeRequest(FREE_TIER_ENDPOINTS.SUPPLY_INFLATION_RATE, params);
  }

  // Fee Metrics
  async getFeesMean(params: MetricParams): Promise<MetricResponse[]> {
    return this.makeRequest(FREE_TIER_ENDPOINTS.FEES_MEAN, params);
  }

  async getFeesMedian(params: MetricParams): Promise<MetricResponse[]> {
    return this.makeRequest(FREE_TIER_ENDPOINTS.FEES_MEDIAN, params);
  }

  // Mining Metrics
  async getHashRate(params: MetricParams): Promise<MetricResponse[]> {
    return this.makeRequest(FREE_TIER_ENDPOINTS.HASH_RATE, params);
  }

  async getDifficulty(params: MetricParams): Promise<MetricResponse[]> {
    return this.makeRequest(FREE_TIER_ENDPOINTS.DIFFICULTY, params);
  }

  // Exchange Flow Metrics
  async getExchangeInflow(params: MetricParams): Promise<MetricResponse[]> {
    return this.makeRequest(FREE_TIER_ENDPOINTS.EXCHANGE_INFLOW, params);
  }

  async getExchangeOutflow(params: MetricParams): Promise<MetricResponse[]> {
    return this.makeRequest(FREE_TIER_ENDPOINTS.EXCHANGE_OUTFLOW, params);
  }

  // Utility Methods
  getAvailableAssets(): FreeTierAsset[] {
    return [...FREE_TIER_ASSETS];
  }

  validateAsset(asset: string): asset is FreeTierAsset {
    return FREE_TIER_ASSETS.includes(asset as FreeTierAsset);
  }

  getDefaultParams(asset: FreeTierAsset): MetricParams {
    return {
      asset,
      interval: '24h',
      format: 'JSON',
      timestamp_format: 'unix',
    };
  }

  // Rate limit helper
  private requestCount = 0;
  private lastReset = Date.now();

  async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const timeWindow = 60000; // 1 minute
    
    if (now - this.lastReset >= timeWindow) {
      this.requestCount = 0;
      this.lastReset = now;
    }

    if (this.requestCount >= 10) { // Free tier limit: 10 requests/minute
      const waitTime = timeWindow - (now - this.lastReset);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      this.requestCount = 0;
      this.lastReset = Date.now();
    }
    
    this.requestCount++;
  }

  // Batch request helper with rate limiting
  async batchRequest<T>(
    requests: Array<() => Promise<T>>,
    delayMs: number = 6000 // 6 seconds between requests for free tier
  ): Promise<T[]> {
    const results: T[] = [];
    
    for (const request of requests) {
      await this.waitForRateLimit();
      const result = await request();
      results.push(result);
      
      if (delayMs > 0 && requests.indexOf(request) < requests.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    
    return results;
  }
}

// Usage Examples and Helper Functions
export const createGlassNodeClient = (apiKey?: string): GlassNodeClient => {
  return new GlassNodeClient({ apiKey });
};

export const getLastWeekParams = (asset: FreeTierAsset): MetricParams => {
  const since = new Date();
  since.setDate(since.getDate() - 7);
  
  return {
    asset,
    since: since.toISOString(),
    interval: '24h',
  };
};

export const getLastMonthParams = (asset: FreeTierAsset): MetricParams => {
  const since = new Date();
  since.setMonth(since.getMonth() - 1);
  
  return {
    asset,
    since: since.toISOString(),
    interval: '24h',
  };
};

// Export default instance
export const glassNode = new GlassNodeClient();

// Example usage:
/*
import { glassNode, GlassNodeClient, getLastWeekParams } from './glassNode';

// Using default instance
const btcPrice = await glassNode.getPriceUSD({ asset: 'BTC', interval: '24h' });

// Using custom client with API key
const client = new GlassNodeClient({ apiKey: 'your-api-key' });
const ethActiveAddresses = await client.getActiveAddresses(getLastWeekParams('ETH'));

// Batch requests with rate limiting
const results = await client.batchRequest([
  () => client.getPriceUSD({ asset: 'BTC', interval: '24h' }),
  () => client.getActiveAddresses({ asset: 'BTC', interval: '24h' }),
  () => client.getTransactionCount({ asset: 'BTC', interval: '24h' }),
]);
*/
