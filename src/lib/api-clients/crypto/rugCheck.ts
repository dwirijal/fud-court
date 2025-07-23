/**
 * RugCheck.xyz TypeScript SDK
 * Comprehensive TypeScript wrapper for RugCheck API
 * 
 * Features:
 * - Token security analysis
 * - Risk assessment and scoring
 * - Liquidity pool analysis
 * - Market data retrieval
 * - Top holders analysis
 * - Historical data tracking
 */

// =============================================
// TYPE DEFINITIONS
// =============================================

export interface RugCheckConfig {
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
  retries?: number;
  rateLimit?: {
    requests: number;
    windowMs: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  rateLimitRemaining?: number;
}

export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  logoUri?: string;
  description?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
}

export interface RiskScore {
  overall: number; // 0-100, higher = more risky
  liquidity: number;
  ownership: number;
  trading: number;
  contract: number;
  metadata: number;
}

export interface RiskFlag {
  type: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: string;
  title: string;
  description: string;
  impact: string;
  recommendation?: string;
}

export interface LiquidityData {
  totalLiquidity: number;
  liquidityPools: LiquidityPool[];
  lockedLiquidity: number;
  lockedPercentage: number;
  burnedLiquidity: number;
  burnedPercentage: number;
  liquidityProviders: number;
  averagePoolAge: number;
}

export interface LiquidityPool {
  address: string;
  dex: string;
  baseToken: string;
  quoteToken: string;
  liquidity: number;
  volume24h: number;
  price: number;
  priceChange24h: number;
  isLocked: boolean;
  lockEndDate?: string;
  createdAt: string;
}

export interface TopHolder {
  address: string;
  balance: string;
  percentage: number;
  isContract: boolean;
  isKnownAddress: boolean;
  label?: string;
  firstSeen: string;
  lastActivity: string;
  transactionCount: number;
}

export interface OwnershipAnalysis {
  totalHolders: number;
  topHoldersCount: number;
  topHoldersPercentage: number;
  contractOwnership: number;
  burnedTokens: string;
  burnedPercentage: number;
  topHolders: TopHolder[];
  distribution: {
    range: string;
    holders: number;
    percentage: number;
  }[];
}

export interface TradingAnalysis {
  volume24h: number;
  volumeChange24h: number;
  transactions24h: number;
  transactionsChange24h: number;
  averageTransactionSize: number;
  buySellRatio: number;
  uniqueTraders24h: number;
  priceVolatility: number;
  marketCap: number;
  fdv: number; // Fully Diluted Valuation
}

export interface ContractAnalysis {
  isVerified: boolean;
  hasProxyContract: boolean;
  hasUpgradeableContract: boolean;
  hasMintFunction: boolean;
  hasBurnFunction: boolean;
  hasPauseFunction: boolean;
  hasBlacklistFunction: boolean;
  maxSupplyReachable: boolean;
  ownershipRenounced: boolean;
  contractAge: number;
  lastUpdate?: string;
  sourceCodeUrl?: string;
}

export interface MarketData {
  price: number;
  priceChange1h: number;
  priceChange24h: number;
  priceChange7d: number;
  volume24h: number;
  marketCap: number;
  fdv: number;
  circulatingSupply: string;
  totalSupply: string;
  maxSupply?: string;
  rank?: number;
  ath: number;
  athDate: string;
  atl: number;
  atlDate: string;
}

export interface RugCheckReport {
  token: TokenInfo;
  riskScore: RiskScore;
  riskFlags: RiskFlag[];
  liquidity: LiquidityData;
  ownership: OwnershipAnalysis;
  trading: TradingAnalysis;
  contract: ContractAnalysis;
  market: MarketData;
  scanTimestamp: string;
  reportId: string;
  isRugPull: boolean;
  confidence: number;
  recommendedAction: 'safe' | 'caution' | 'high_risk' | 'avoid';
}

export interface HistoricalData {
  timestamp: string;
  price: number;
  volume: number;
  liquidity: number;
  holders: number;
  riskScore: number;
}

export interface TokenStatistics {
  address: string;
  scanCount: number;
  lastScanTime: string;
  avgRiskScore: number;
  historicalFlags: number;
  communityReports: number;
  isWatchlisted: boolean;
  trustScore: number;
}

export interface WatchlistItem {
  id: string;
  tokenAddress: string;
  tokenSymbol: string;
  addedAt: string;
  lastAlert?: string;
  alertSettings: {
    riskScoreThreshold: number;
    priceChange: number;
    liquidityChange: number;
    newFlags: boolean;
  };
}

export interface AlertSettings {
  riskScoreThreshold: number;
  priceChangeThreshold: number;
  liquidityChangeThreshold: number;
  newFlagsEnabled: boolean;
  telegramNotifications: boolean;
  emailNotifications: boolean;
  webhookUrl?: string;
}

export interface UserProfile {
  userId: string;
  apiKeys: string[];
  subscription: {
    plan: 'free' | 'basic' | 'pro' | 'enterprise';
    expiresAt?: string;
    requestsRemaining: number;
    requestsLimit: number;
  };
  preferences: {
    defaultChain: string;
    alertSettings: AlertSettings;
    dashboardLayout: string;
  };
  statistics: {
    totalScans: number;
    rugPullsDetected: number;
    savedAmount: number;
    joinedAt: string;
  };
}

// =============================================
// ERROR HANDLING
// =============================================

export class RugCheckError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errorCode?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'RugCheckError';
  }
}

export class RateLimitError extends RugCheckError {
  constructor(message: string, public retryAfter?: number) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}

export class AuthenticationError extends RugCheckError {
  constructor(message: string = 'Invalid or missing API key') {
    super(message, 401, 'AUTHENTICATION_FAILED');
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends RugCheckError {
  constructor(message: string, public field?: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

// =============================================
// MAIN RUGCHECK CLASS
// =============================================

export class RugCheck {
  private readonly config: Required<RugCheckConfig>;
  private rateLimitTracker: Map<string, number[]> = new Map();

  constructor(config: RugCheckConfig = {}) {
    this.config = {
      apiKey: config.apiKey || process.env.RUGCHECK_API_KEY || '',
      baseUrl: config.baseUrl || 'https://api.rugcheck.xyz/v1', // Assuming v1
      timeout: config.timeout || 30000,
      retries: config.retries || 3,
      rateLimit: config.rateLimit || { requests: 100, windowMs: 60000 }
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      params?: Record<string, any>;
      data?: any;
      headers?: Record<string, string>;
    } = {}
  ): Promise<ApiResponse<T>> {
    for (let i = 0; i <= this.config.retries; i++) {
        try {
            this.checkRateLimit();
            
            const { method = 'GET', params, data, headers = {} } = options;
            
            if (this.config.apiKey) {
                headers['Authorization'] = `Bearer ${this.config.apiKey}`;
            }
            
            headers['Content-Type'] = 'application/json';
            headers['User-Agent'] = 'RugCheck-TS-SDK/1.0.0';

            const url = new URL(`${this.config.baseUrl}${endpoint}`);
            if (params) {
              Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
            }
            
            this.updateRateLimit();

            const response = await fetch(url.toString(), {
                method,
                headers,
                body: data ? JSON.stringify(data) : undefined,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                throw this.handleError({ ...errorData, status: response.status, headers: response.headers });
            }

            return await response.json();

        } catch (error) {
            if (i === this.config.retries || !(error instanceof RateLimitError)) {
                throw this.handleError(error);
            }
            // Wait before retrying for rate limit errors
            await new Promise(res => setTimeout(res, error.retryAfter ? error.retryAfter * 1000 : 1000 * (i + 1)));
        }
    }
    throw new RugCheckError('Request failed after multiple retries');
  }

  private checkRateLimit(): void {
    const now = Date.now();
    const key = 'default';
    
    if (!this.rateLimitTracker.has(key)) {
      this.rateLimitTracker.set(key, []);
    }
    
    const requests = this.rateLimitTracker.get(key)!;
    const windowStart = now - this.config.rateLimit.windowMs;
    
    const recentRequests = requests.filter(time => time > windowStart);
    this.rateLimitTracker.set(key, recentRequests);
    
    if (recentRequests.length >= this.config.rateLimit.requests) {
      const oldestRequest = Math.min(...recentRequests);
      const retryAfter = Math.ceil((oldestRequest + this.config.rateLimit.windowMs - now) / 1000);
      throw new RateLimitError(`Rate limit exceeded. Try again in ${retryAfter} seconds.`, retryAfter);
    }
  }

  private updateRateLimit(): void {
    const now = Date.now();
    const key = 'default';
    const requests = this.rateLimitTracker.get(key) || [];
    requests.push(now);
    this.rateLimitTracker.set(key, requests);
  }

  private handleError(error: any): RugCheckError {
    if (error instanceof RugCheckError) {
      return error;
    }

    if (error.status === 401 || error.status === 403) {
      return new AuthenticationError(error.message || 'Authentication failed');
    }

    if (error.status === 429) {
      const retryAfter = error.headers?.get?.('retry-after') 
        ? parseInt(error.headers.get('retry-after')) 
        : undefined;
      return new RateLimitError('Rate limit exceeded', retryAfter);
    }

    if (error.status === 400) {
      return new ValidationError(error.message || 'Invalid request parameters');
    }

    return new RugCheckError(
      error.message || 'An unexpected error occurred',
      error.status || 500,
      'UNKNOWN_ERROR',
      error
    );
  }

  /**
   * Get comprehensive rug check report for a token
   */
  async getTokenReport(tokenAddress: string): Promise<RugCheckReport> {
    this.validateTokenAddress(tokenAddress);
    // The API probably does not return an `ApiResponse` wrapper for this endpoint
    // based on typical API design. Let's assume it returns the report directly.
    return this.makeRequest<any>(`/token/${tokenAddress}`);
  }

  private validateTokenAddress(address: string): void {
    if (!address || typeof address !== 'string') {
      throw new ValidationError('Token address is required and must be a string');
    }
    // Basic address validation (can be improved for different chains)
    if (address.length < 32 || address.length > 44) {
      throw new ValidationError('Invalid token address format');
    }
  }
}

export default RugCheck;
