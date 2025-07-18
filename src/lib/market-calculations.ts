// Market Calculations based on formula.md

export interface MarketData {
  price: number;
  priceChange24h: number;
  volume24h: number;
  volumeChange24h: number;
  marketCap: number;
  marketCapChange24h: number;
  dominance: number;
  dominanceChange: number;
  allTimeHigh: number;
  allTimeLow: number;
  returns?: number[];
  riskFreeRate?: number;
}

export interface MarketSentimentResult {
  rawScore: number;
  normalizedScore: number;
  sentiment: 'Extreme Fear' | 'Fear' | 'Neutral' | 'Greed' | 'Extreme Greed';
  color: string;
}

export interface TechnicalIndicators {
  volatilityIndex: number;
  liquidityRatio: number;
  supportLevel: number;
  resistanceLevel: number;
  priceSignal: number;
  sharpeRatio?: number;
}

// 1. Currency Conversion
export function calculateExchangeRate(
  bitcoinPriceTarget: number,
  bitcoinPriceUSD: number
): number {
  if (bitcoinPriceUSD === 0) return 0;
  return bitcoinPriceTarget / bitcoinPriceUSD;
}

// 2. Market Dominance Calculations
export function calculateMarketDominance(
  totalMarketCap: number,
  dominancePercentage: number
): number {
  const clampedDominance = Math.max(0, Math.min(100, dominancePercentage));
  return (totalMarketCap * clampedDominance) / 100;
}

export function calculateDominancePercentage(
  assetMarketCap: number,
  totalMarketCap: number
): number {
  if (totalMarketCap <= 0) return 0;
  return (assetMarketCap / Math.max(1, totalMarketCap)) * 100;
}

// 4. Volatility Index
export function calculateVolatilityIndex(priceChanges: number[]): number {
  if (priceChanges.length === 0) return 0;
  
  const sumSquares = priceChanges.reduce((sum, change) => sum + Math.pow(change, 2), 0);
  const variance = sumSquares / priceChanges.length;
  return Math.sqrt(variance) * 100;
}

// 5. Liquidity Ratio
export function calculateLiquidityRatio(volume24h: number, marketCap: number): number {
  if (marketCap === 0) return 0;
  return (volume24h / marketCap) * 100;
}

// 6. Market Sentiment Score
export function calculateMarketSentiment(data: MarketData): MarketSentimentResult {
  const {
    priceChange24h,
    volumeChange24h,
    marketCapChange24h,
    dominanceChange
  } = data;

  // Calculate raw score using the weighted formula
  const rawScore = (
    (priceChange24h * 0.3) +
    (volumeChange24h * 0.2) +
    (marketCapChange24h * 0.2) +
    (dominanceChange * 0.3)
  ) / 4;

  // Normalize score to 0-100 range
  const normalizedScore = (rawScore + 100) / 2;
  
  // Determine sentiment based on score
  let sentiment: MarketSentimentResult['sentiment'];
  let color: string;

  if (normalizedScore <= 20) {
    sentiment = 'Extreme Fear';
    color = 'hsl(var(--accent-secondary))'; // Red
  } else if (normalizedScore <= 40) {
    sentiment = 'Fear';
    color = 'hsl(var(--accent-tertiary))'; // Orange
  } else if (normalizedScore <= 60) {
    sentiment = 'Neutral';
    color = 'hsl(var(--text-tertiary))'; // Gray
  } else if (normalizedScore <= 80) {
    sentiment = 'Greed';
    color = 'hsl(var(--status-info))'; // Blue
  } else {
    sentiment = 'Extreme Greed';
    color = 'hsl(var(--accent-primary))'; // Green
  }

  return {
    rawScore,
    normalizedScore: Math.max(0, Math.min(100, normalizedScore)),
    sentiment,
    color
  };
}

// 7. Sharpe Ratio
export function calculateSharpeRatio(
  returns: number[],
  riskFreeRate: number = 0.02
): number {
  if (returns.length === 0) return 0;

  const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) return 0;
  return (avgReturn - riskFreeRate) / stdDev;
}

// 8. Support/Resistance Levels (Fibonacci Based)
export function calculateSupportResistance(data: MarketData) {
  const { price, allTimeHigh, allTimeLow } = data;
  
  // Support Level using Fibonacci retracement
  const athDrawdown = allTimeHigh > 0 ? (allTimeHigh - price) / allTimeHigh : 0;
  const supportLevel = price * (1 - (athDrawdown * 0.618));

  // Resistance Level
  const recoveryFactor = allTimeHigh > allTimeLow ? 
    (price - allTimeLow) / (allTimeHigh - allTimeLow) : 0;
  const resistanceLevel = price * (1 + (recoveryFactor * 0.382));

  return {
    supportLevel: Math.max(0, supportLevel),
    resistanceLevel: Math.max(price, resistanceLevel)
  };
}

// 9. Simple Moving Average
export function calculateSMA(prices: number[], period: number): number {
  if (prices.length < period) return 0;
  const recentPrices = prices.slice(-period);
  return recentPrices.reduce((sum, price) => sum + price, 0) / period;
}

// 9. Exponential Moving Average
export function calculateEMA(prices: number[], period: number): number {
  if (prices.length === 0) return 0;
  if (prices.length === 1) return prices[0];

  const multiplier = 2 / (period + 1);
  let ema = prices[0];

  for (let i = 1; i < prices.length; i++) {
    ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
  }

  return ema;
}

// 9. Price Signal (MACD-like)
export function calculatePriceSignal(prices: number[]): number {
  if (prices.length < 26) return 0;

  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);

  if (ema26 === 0) return 0;
  return ((ema12 - ema26) / ema26) * 100;
}

// Complete Technical Analysis
export function calculateTechnicalIndicators(
  data: MarketData,
  priceHistory: number[] = []
): TechnicalIndicators {
  const priceChanges = priceHistory.length > 1 ? 
    priceHistory.slice(1).map((price, i) => ((price - priceHistory[i]) / priceHistory[i]) * 100) : 
    [data.priceChange24h];

  const volatilityIndex = calculateVolatilityIndex(priceChanges);
  const liquidityRatio = calculateLiquidityRatio(data.volume24h, data.marketCap);
  const { supportLevel, resistanceLevel } = calculateSupportResistance(data);
  const priceSignal = calculatePriceSignal(priceHistory);
  const sharpeRatio = data.returns ? calculateSharpeRatio(data.returns, data.riskFreeRate) : undefined;

  return {
    volatilityIndex,
    liquidityRatio,
    supportLevel,
    resistanceLevel,
    priceSignal,
    sharpeRatio
  };
}

// Input Validation
export function validateMarketData(data: Partial<MarketData>): boolean {
  const requiredFields = ['price', 'priceChange24h', 'volume24h', 'marketCap'];
  
  for (const field of requiredFields) {
    if (typeof data[field as keyof MarketData] !== 'number') {
      return false;
    }
  }

  // Check for reasonable ranges
  if (data.price! <= 0 || data.volume24h! < 0 || data.marketCap! <= 0) {
    return false;
  }

  return true;
}

// Outlier Detection
export function detectOutliers(values: number[]): number[] {
  if (values.length < 4) return values;

  values.sort((a, b) => a - b);
  const q1 = values[Math.floor(values.length * 0.25)];
  const q3 = values[Math.floor(values.length * 0.75)];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  return values.filter(value => value >= lowerBound && value <= upperBound);
}

// Rate Limited Calculation
export function createRateLimitedCalculation<T extends any[], R>(
  calculation: (...args: T) => R,
  maxPerSecond: number = 10
): (...args: T) => R | null {
  const calls: number[] = [];

  return (...args: T): R | null => {
    const now = Date.now();
    const oneSecondAgo = now - 1000;

    // Remove calls older than 1 second
    while (calls.length > 0 && calls[0] < oneSecondAgo) {
      calls.shift();
    }

    if (calls.length >= maxPerSecond) {
      console.warn('Rate limit exceeded for calculation');
      return null;
    }

    calls.push(now);
    return calculation(...args);
  };
}

// Example usage with rate limiting
export const rateLimitedMarketSentiment = createRateLimitedCalculation(calculateMarketSentiment);
export const rateLimitedTechnicalIndicators = createRateLimitedCalculation(calculateTechnicalIndicators);
