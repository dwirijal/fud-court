/**
 * Binance TypeScript Client - FREE ENDPOINTS ONLY
 * Documentation: https://binance-docs.github.io/apidocs/spot/en/
 * 
 * FREE PLAN LIMITATIONS:
 * - Rate limit: 1200 requests/minute per IP
 * - Weight limit: 6000 weight/minute per IP  
 * - Only includes endpoints available on the free/public plan
 * - No private endpoints (account info, trading, etc.)
 */

// ============================================
// INTERFACES & TYPES
// ============================================

interface BinanceServerTime {
  serverTime: number;
}

interface BinanceRateLimit {
  rateLimitType: string;
  interval: string;
  intervalNum: number;
  limit: number;
}

interface BinanceFilter {
  filterType: string;
  minPrice?: string;
  maxPrice?: string;
  tickSize?: string;
  multiplierUp?: string;
  multiplierDown?: string;
  avgPriceMins?: number;
  minQty?: string;
  maxQty?: string;
  stepSize?: string;
  minNotional?: string;
  applyToMarket?: boolean;
  limit?: number;
  maxNumOrders?: number;
  maxNumAlgoOrders?: number;
}

interface BinanceSymbol {
  symbol: string;
  status: string;
  baseAsset: string;
  baseAssetPrecision: number;
  quoteAsset: string;
  quotePrecision: number;
  quoteAssetPrecision: number;
  baseCommissionPrecision: number;
  quoteCommissionPrecision: number;
  orderTypes: string[];
  icebergAllowed: boolean;
  ocoAllowed: boolean;
  quoteOrderQtyMarketAllowed: boolean;
  allowTrailingStop: boolean;
  cancelReplaceAllowed: boolean;
  isSpotTradingAllowed: boolean;
  isMarginTradingAllowed: boolean;
  filters: BinanceFilter[];
  permissions: string[];
  defaultSelfTradePreventionMode: string;
  allowedSelfTradePreventionModes: string[];
}

interface BinanceExchangeInfo {
  timezone: string;
  serverTime: number;
  rateLimits: BinanceRateLimit[];
  exchangeFilters: any[];
  symbols: BinanceSymbol[];
}

interface BinanceTicker24hr {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

interface BinancePrice {
  symbol: string;
  price: string;
}

interface BinanceBookTicker {
  symbol: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
}

interface BinanceOrderBook {
  lastUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
}

interface BinanceTrade {
  id: number;
  price: string;
  qty: string;
  quoteQty: string;
  time: number;
  isBuyerMaker: boolean;
}

interface BinanceAggTrade {
  a: number; // Aggregate tradeId
  p: string; // Price
  q: string; // Quantity
  f: number; // First tradeId
  l: number; // Last tradeId
  T: number; // Timestamp
  m: boolean; // Was the buyer the maker?
}

interface BinanceKline {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteAssetVolume: string;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
}

interface BinanceAvgPrice {
  mins: number;
  price: string;
}

interface BinanceTickerPrice {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  lastPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

// Kline intervals type
type KlineInterval = '1s' | '1m' | '3m' | '5m' | '15m' | '30m' | '1h' | '2h' | '4h' | '6h' | '8h' | '12h' | '1d' | '3d' | '1w' | '1M';

// Rate limit info interface
interface RateLimitInfo {
  weight: number;
  description: string;
}

// ============================================
// MAIN BINANCE API CLASS
// ============================================

export class BinanceAPI {
  private readonly baseURL = 'https://api.binance.com/api/v3';
  private readonly baseURLV1 = 'https://api.binance.com/api/v1';
  
  // Rate limit weights for each endpoint
  private readonly rateLimits: Record<string, RateLimitInfo> = {
    '/time': { weight: 1, description: 'Test connectivity to the Rest API and get the current server time' },
    '/exchangeInfo': { weight: 10, description: 'Current exchange trading rules and symbol information' },
    '/depth': { weight: 1, description: 'Get order book' }, // 1-5 based on limit
    '/trades': { weight: 1, description: 'Get recent trades list' },
    '/historicalTrades': { weight: 5, description: 'Get older market trades' },
    '/aggTrades': { weight: 1, description: 'Get compressed, aggregate trades' },
    '/klines': { weight: 1, description: 'Kline/candlestick bars' },
    '/avgPrice': { weight: 1, description: 'Current average price' },
    '/ticker/24hr': { weight: 1, description: '24hr ticker price change statistics' }, // 1-40 based on symbol count
    '/ticker/price': { weight: 1, description: 'Symbol price ticker' }, // 1-2 based on symbol count
    '/ticker/bookTicker': { weight: 1, description: 'Symbol order book ticker' }, // 1-2 based on symbol count
    '/ticker': { weight: 2, description: 'Rolling window price change statistics' }
  };

  /**
   * Make HTTP request to Binance API
   * @private
   */
  private async makeRequest<T>(endpoint: string): Promise<T> {
    try {
      const url = endpoint.startsWith('/v1/') 
        ? `${this.baseURLV1}${endpoint.slice(4)}`
        : `${this.baseURL}${endpoint}`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
        }
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorBody = await response.json();
          if (errorBody.msg) {
            errorMessage = `${errorMessage} - ${errorBody.msg}`;
          }
        } catch {
          // If can't parse error body, use status text
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to Binance API');
      }
      throw error;
    }
  }

  /**
   * Get rate limit information for an endpoint
   */
  getRateLimitInfo(endpoint: string): RateLimitInfo | null {
    return this.rateLimits[endpoint] || null;
  }

  // ============================================
  // GENERAL ENDPOINTS
  // ============================================

  /**
   * Test connectivity to the Rest API and get the current server time
   * Weight: 1
   */
  async ping(): Promise<{}> {
    return this.makeRequest('/ping');
  }

  /**
   * Test connectivity to the Rest API and get the current server time
   * Weight: 1
   */
  async getServerTime(): Promise<BinanceServerTime> {
    return this.makeRequest('/time');
  }

  /**
   * Current exchange trading rules and symbol information
   * Weight: 10
   * @param symbol Optional symbol to get info for specific trading pair
   */
  async getExchangeInfo(symbol?: string): Promise<BinanceExchangeInfo> {
    const endpoint = symbol ? `/exchangeInfo?symbol=${symbol}` : '/exchangeInfo';
    return this.makeRequest(endpoint);
  }

  // ============================================
  // MARKET DATA ENDPOINTS  
  // ============================================

  /**
   * Get order book (market depth)
   * Weight: Adjusted based on the limit:
   * - 1 for limit <= 100
   * - 5 for limit <= 500  
   * - 10 for limit <= 1000
   * - 50 for limit <= 5000
   * 
   * @param symbol Trading pair (e.g., 'BTCUSDT')
   * @param limit Valid limits: 5, 10, 20, 50, 100, 500, 1000, 5000
   */
  async getOrderBook(symbol: string, limit: number = 100): Promise<BinanceOrderBook> {
    return this.makeRequest(`/depth?symbol=${symbol.toUpperCase()}&limit=${limit}`);
  }

  /**
   * Get recent trades list (up to last 500)
   * Weight: 1
   * @param symbol Trading pair (e.g., 'BTCUSDT')  
   * @param limit Default 500; max 1000
   */
  async getRecentTrades(symbol: string, limit: number = 500): Promise<BinanceTrade[]> {
    return this.makeRequest(`/trades?symbol=${symbol.toUpperCase()}&limit=${limit}`);
  }

  /**
   * Get older market trades (requires API key in production)
   * Weight: 5
   * @param symbol Trading pair
   * @param limit Default 500; max 1000  
   * @param fromId Trade id to fetch from INCLUSIVE
   */
  async getHistoricalTrades(symbol: string, limit: number = 500, fromId?: number): Promise<BinanceTrade[]> {
    let endpoint = `/historicalTrades?symbol=${symbol.toUpperCase()}&limit=${limit}`;
    if (fromId) endpoint += `&fromId=${fromId}`;
    return this.makeRequest(endpoint);
  }

  /**
   * Get compressed, aggregate trades. Trades that fill at the time, from the same order, with the same price will have the quantity aggregated.
   * Weight: 1
   * @param symbol Trading pair
   * @param fromId ID to get aggregate trades from INCLUSIVE
   * @param startTime Timestamp in ms to get aggregate trades from INCLUSIVE
   * @param endTime Timestamp in ms to get aggregate trades until INCLUSIVE
   * @param limit Default 500; max 1000
   */
  async getAggTrades(
    symbol: string,
    fromId?: number,
    startTime?: number,
    endTime?: number,
    limit: number = 500
  ): Promise<BinanceAggTrade[]> {
    let endpoint = `/aggTrades?symbol=${symbol.toUpperCase()}&limit=${limit}`;
    if (fromId) endpoint += `&fromId=${fromId}`;
    if (startTime) endpoint += `&startTime=${startTime}`;
    if (endTime) endpoint += `&endTime=${endTime}`;
    return this.makeRequest(endpoint);
  }

  /**
   * Kline/candlestick bars for a symbol
   * Weight: 1
   * @param symbol Trading pair
   * @param interval Kline interval
   * @param limit Default 500; max 1000
   * @param startTime Start time in milliseconds
   * @param endTime End time in milliseconds
   */
  async getKlines(
    symbol: string,
    interval: KlineInterval,
    limit: number = 500,
    startTime?: number,
    endTime?: number
  ): Promise<BinanceKline[]> {
    let endpoint = `/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`;
    if (startTime) endpoint += `&startTime=${startTime}`;
    if (endTime) endpoint += `&endTime=${endTime}`;

    const rawData = await this.makeRequest<any[][]>(endpoint);
    
    return rawData.map(kline => ({
      openTime: kline[0],
      open: kline[1],
      high: kline[2], 
      low: kline[3],
      close: kline[4],
      volume: kline[5],
      closeTime: kline[6],
      quoteAssetVolume: kline[7],
      numberOfTrades: kline[8],
      takerBuyBaseAssetVolume: kline[9],
      takerBuyQuoteAssetVolume: kline[10]
    }));
  }

  /**
   * Current average price for a symbol
   * Weight: 1
   * @param symbol Trading pair
   */
  async getAvgPrice(symbol: string): Promise<BinanceAvgPrice> {
    return this.makeRequest(`/avgPrice?symbol=${symbol.toUpperCase()}`);
  }

  // ============================================
  // TICKER ENDPOINTS
  // ============================================

  /**
   * 24hr ticker price change statistics
   * Weight: 1 for single symbol, 40 when symbol omitted
   * @param symbol Optional - if omitted, returns for all symbols
   */
  async getTicker24hr(symbol?: string): Promise<BinanceTicker24hr | BinanceTicker24hr[]> {
    const endpoint = symbol ? `/ticker/24hr?symbol=${symbol.toUpperCase()}` : '/ticker/24hr';
    return this.makeRequest(endpoint);
  }

  /**
   * Rolling window price change statistics
   * Weight: 2 for single symbol, 40 when symbol omitted  
   * @param symbol Trading pair
   * @param windowSize Defaults to 1d if no parameter provided
   * Supported windowSize values:
   * - 1m,2m....59m for minutes
   * - 1h, 2h....23h for hours  
   * - 1d...7d for days
   */
  async getTickerPrice(symbol?: string, windowSize?: string): Promise<BinanceTickerPrice | BinanceTickerPrice[]> {
    let endpoint = '/ticker';
    const params = [];
    if (symbol) params.push(`symbol=${symbol.toUpperCase()}`);
    if (windowSize) params.push(`windowSize=${windowSize}`);
    if (params.length) endpoint += '?' + params.join('&');
    return this.makeRequest(endpoint);
  }

  /**
   * Latest price for a symbol or symbols
   * Weight: 1 for single symbol, 2 when symbol omitted
   * @param symbol Optional - if omitted, returns for all symbols
   */
  async getPrice(symbol?: string): Promise<BinancePrice | BinancePrice[]> {
    const endpoint = symbol ? `/ticker/price?symbol=${symbol.toUpperCase()}` : '/ticker/price';
    return this.makeRequest(endpoint);
  }

  /**
   * Best price/qty on the order book for a symbol or symbols
   * Weight: 1 for single symbol, 2 when symbol omitted
   * @param symbol Optional - if omitted, returns for all symbols
   */
  async getBookTicker(symbol?: string): Promise<BinanceBookTicker | BinanceBookTicker[]> {
    const endpoint = symbol ? `/ticker/bookTicker?symbol=${symbol.toUpperCase()}` : '/ticker/bookTicker';
    return this.makeRequest(endpoint);
  }
}

// ============================================
// HELPER UTILITIES
// ============================================

export const BinanceHelpers = {
  /**
   * All available kline intervals
   */
  intervals: [
    '1s', '1m', '3m', '5m', '15m', '30m',
    '1h', '2h', '4h', '6h', '8h', '12h', 
    '1d', '3d', '1w', '1M'
  ] as const,

  /**
   * Convert timestamp to Date object
   */
  timestampToDate: (timestamp: number): Date => new Date(timestamp),

  /**
   * Get price change percentage as number
   */
  getPriceChangePercent: (ticker: BinanceTicker24hr): number => parseFloat(ticker.priceChangePercent),

  /**
   * Get current price as number
   */
  getCurrentPrice: (ticker: BinanceTicker24hr | BinancePrice): number => {
    return 'lastPrice' in ticker ? parseFloat(ticker.lastPrice) : parseFloat(ticker.price);
  },

  /**
   * Format price with specified decimal places
   */
  formatPrice: (price: string | number, decimals: number = 8): string => {
    return parseFloat(price.toString()).toFixed(decimals);
  },

  /**
   * Format volume with appropriate units
   */
  formatVolume: (volume: string | number): string => {
    const vol = parseFloat(volume.toString());
    if (vol >= 1e9) return (vol / 1e9).toFixed(2) + 'B';
    if (vol >= 1e6) return (vol / 1e6).toFixed(2) + 'M';
    if (vol >= 1e3) return (vol / 1e3).toFixed(2) + 'K';
    return vol.toFixed(2);
  },

  /**
   * Calculate spread from order book
   */
  calculateSpread: (orderBook: BinanceOrderBook): {
    spread: number;
    spreadPercent: number;
    bestBid: number;
    bestAsk: number;
  } => {
    const bestBid = parseFloat(orderBook.bids[0][0]);
    const bestAsk = parseFloat(orderBook.asks[0][0]);
    const spread = bestAsk - bestBid;
    const spreadPercent = (spread / bestBid) * 100;
    
    return {
      spread,
      spreadPercent,
      bestBid,
      bestAsk
    };
  },

  /**
   * Calculate volume weighted average price from order book
   */
  calculateVWAP: (orderBook: BinanceOrderBook, depth: number = 5): {
    bidVWAP: number;
    askVWAP: number;
  } => {
    const calculateVWAPSide = (orders: [string, string][]): number => {
      let totalVolume = 0;
      let totalValue = 0;
      
      for (let i = 0; i < Math.min(depth, orders.length); i++) {
        const price = parseFloat(orders[i][0]);
        const volume = parseFloat(orders[i][1]);
        totalValue += price * volume;
        totalVolume += volume;
      }
      
      return totalVolume > 0 ? totalValue / totalVolume : 0;
    };

    return {
      bidVWAP: calculateVWAPSide(orderBook.bids),
      askVWAP: calculateVWAPSide(orderBook.asks)
    };
  },

  /**
   * Validate symbol format
   */
  validateSymbol: (symbol: string): boolean => {
    return /^[A-Z0-9]+$/.test(symbol.toUpperCase()) && symbol.length >= 3;
  },

  /**
   * Get time periods for historical data
   */
  getTimePeriods: () => ({
    '1h': 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000, 
    '1w': 7 * 24 * 60 * 60 * 1000,
    '1M': 30 * 24 * 60 * 60 * 1000
  }),

  /**
   * Calculate RSI from kline data
   */
  calculateRSI: (closes: number[], period: number = 14): number[] => {
    const rsi: number[] = [];
    const gains: number[] = [];
    const losses: number[] = [];

    for (let i = 1; i < closes.length; i++) {
      const difference = closes[i] - closes[i - 1];
      gains.push(difference > 0 ? difference : 0);
      losses.push(difference < 0 ? Math.abs(difference) : 0);
    }

    let avgGain = gains.slice(0, period).reduce((sum, gain) => sum + gain, 0) / period;
    let avgLoss = losses.slice(0, period).reduce((sum, loss) => sum + loss, 0) / period;

    for (let i = period; i < closes.length; i++) {
      if (avgLoss === 0) {
        rsi.push(100);
      } else {
        const rs = avgGain / avgLoss;
        rsi.push(100 - (100 / (1 + rs)));
      }

      if (i < gains.length) {
        avgGain = (avgGain * (period - 1) + gains[i]) / period;
        avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
      }
    }

    return rsi;
  }
};

// ============================================
// EXAMPLE USAGE
// ============================================

/*
// Initialize client
const binance = new BinanceAPI();

// Example 1: Get server time
binance.getServerTime().then(time => {
  console.log('Server time:', new Date(time.serverTime));
});

// Example 2: Get Bitcoin price
binance.getPrice('BTCUSDT').then(data => {
  if (!Array.isArray(data)) {
    console.log('BTC Price: $' + BinanceHelpers.formatPrice(data.price, 2));
  }
});

// Example 3: Get 24hr ticker
binance.getTicker24hr('BTCUSDT').then(ticker => {
  if (!Array.isArray(ticker)) {
    console.log('BTC 24hr Change:', ticker.priceChangePercent + '%');
    console.log('Volume:', BinanceHelpers.formatVolume(ticker.volume));
  }
});

// Example 4: Get order book and calculate spread
binance.getOrderBook('BTCUSDT', 20).then(orderBook => {
  const spreadInfo = BinanceHelpers.calculateSpread(orderBook);
  console.log('Best bid:', spreadInfo.bestBid);
  console.log('Best ask:', spreadInfo.bestAsk);
  console.log('Spread:', BinanceHelpers.formatPrice(spreadInfo.spread, 2));
  console.log('Spread %:', spreadInfo.spreadPercent.toFixed(4) + '%');
});

// Example 5: Get historical kline data
binance.getKlines('BTCUSDT', '1h', 100).then(klines => {
  console.log('Got', klines.length, 'hourly candles');
  console.log('Latest close price:', klines[klines.length - 1].close);
  
  // Calculate RSI
  const closes = klines.map(k => parseFloat(k.close));
  const rsi = BinanceHelpers.calculateRSI(closes);
  console.log('Current RSI:', rsi[rsi.length - 1]?.toFixed(2));
});

// Example 6: Monitor multiple symbols
const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];
Promise.all(symbols.map(symbol => binance.getPrice(symbol)))
  .then(prices => {
    prices.forEach(price => {
      if (!Array.isArray(price)) {
        console.log(`${price.symbol}: $${BinanceHelpers.formatPrice(price.price, 2)}`);
      }
    });
  });

// Example 7: Get exchange info for specific symbol
binance.getExchangeInfo('BTCUSDT').then(info => {
  const btcSymbol = info.symbols[0];
  console.log('Base asset:', btcSymbol.baseAsset);
  console.log('Quote asset:', btcSymbol.quoteAsset);
  console.log('Status:', btcSymbol.status);
  console.log('Order types:', btcSymbol.orderTypes.join(', '));
});
*/