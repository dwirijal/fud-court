// This file contains pure, synchronous calculation functions that can be used
// on both the server and potentially the client. It does not contain the
// 'use server' directive.

export function calculateVolatilityIndex(priceChanges: number[]): number {
    if (priceChanges.length === 0) return 0;

    const sumOfSquares = priceChanges.reduce((sum, change) => sum + Math.pow(change, 2), 0);
    const variance = sumOfSquares / priceChanges.length;
    const volatility = Math.sqrt(variance) * 100; // Convert to percentage
    return volatility;
}

export function calculateLiquidityRatio(totalVolume24h: number, marketCap: number): number {
    if (marketCap === 0) return 0;
    return (totalVolume24h / marketCap) * 100;
}

export function calculateMarketSentimentScore(
    priceChange24h: number,
    volumeChange24h: number,
    marketCapChange24h: number,
    dominanceChange: number
): number {
    const rawScore = (
        (priceChange24h * 0.3) +
        (volumeChange24h * 0.2) +
        (marketCapChange24h * 0.2) +
        (dominanceChange * 0.3)
    ) / 4;

    // Normalize score to a 0-100 scale
    const normalizedScore = (rawScore + 100) / 2;
    return Math.max(0, Math.min(100, normalizedScore)); // Ensure score is between 0 and 100
}

export function calculateSupportResistanceLevels(currentPrice: number, ath: number, atl: number): { supportLevel: number | null; resistanceLevel: number | null } {
    if (ath <= 0 || atl < 0 || currentPrice <= 0) {
        return { supportLevel: null, resistanceLevel: null };
    }

    const athDrawdown = (ath - currentPrice) / ath; // Percentage drawdown from ATH
    const recoveryFactor = (currentPrice - atl) / (ath - atl); // Percentage recovery from ATL

    const supportLevel = currentPrice * (1 - (athDrawdown * 0.618));
    const resistanceLevel = currentPrice * (1 + (recoveryFactor * 0.382));

    return { supportLevel, resistanceLevel };
}

export function calculateSMA(prices: number[], period: number): number | null {
    if (prices.length < period) return null;
    const sum = prices.slice(0, period).reduce((acc, price) => acc + price, 0);
    return sum / period;
}

export function calculateEMA(prices: number[], period: number): number | null {
    if (prices.length < period) return null;

    // Calculate SMA for the first EMA value
    const sma = calculateSMA(prices, period);
    if (sma === null) return null;

    const multiplier = 2 / (period + 1);
    let ema = sma;

    // Calculate EMA for subsequent prices
    for (let i = period; i < prices.length; i++) {
        ema = (prices[i] - ema) * multiplier + ema;
    }
    return ema;
}

export function calculatePriceSignal(prices: number[]): number | null {
    const ema12 = calculateEMA(prices, 12);
    const ema26 = calculateEMA(prices, 26);

    if (ema12 === null || ema26 === null || ema26 === 0) return null; // Avoid division by zero

    return (ema12 - ema26) / ema26 * 100;
}

export function validateMarketData(data: any): { price: number; volume: number; marketCap: number; dominance: number } {
    return {
        price: Math.max(0, parseFloat(data.price) || 0),
        volume: Math.max(0, parseFloat(data.volume) || 0),
        marketCap: Math.max(0, parseFloat(data.marketCap) || 0),
        dominance: Math.min(100, Math.max(0, parseFloat(data.dominance) || 0))
    };
}

function calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
}

function calculateStandardDeviation(values: number[]): number {
    if (values.length < 2) return 0;
    const avg = calculateAverage(values);
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    const avgSquareDiff = calculateAverage(squareDiffs);
    return Math.sqrt(avgSquareDiff);
}

export function calculateSharpeRatio(returns: number[], riskFreeRate: number): number {
    const avgReturn = calculateAverage(returns);
    const stdDev = calculateStandardDeviation(returns);

    if (stdDev === 0) return 0; // Avoid division by zero

    return (avgReturn - riskFreeRate) / stdDev;
}

export function detectOutliers(values: number[]): number[] {
    if (values.length < 4) return values; // Not enough data to detect outliers reliably

    const sortedValues = [...values].sort((a, b) => a - b);
    const q1 = sortedValues[Math.floor(sortedValues.length / 4)];
    const q3 = sortedValues[Math.ceil(sortedValues.length * 3 / 4) - 1];
    const iqr = q3 - q1;
    const lowerBound = q1 - (1.5 * iqr);
    const upperBound = q3 + (1.5 * iqr);
        
    return values.filter(v => v >= lowerBound && v <= upperBound);
}

export function rateLimitedCalculation<T, R>(calculation: (data: T) => R, maxPerSecond: number = 10) {
    const queue: { resolve: (value: R) => void; data: T }[] = [];
    let lastExecutionTime = 0;
    const delay = 1000 / maxPerSecond;

    const executeNext = () => {
        if (queue.length > 0) {
            const now = Date.now();
            const timeSinceLastExecution = now - lastExecutionTime;

            if (timeSinceLastExecution >= delay) {
                const { resolve, data } = queue.shift()!;
                resolve(calculation(data));
                lastExecutionTime = now;
            } else {
                // Reschedule if not enough time has passed
                setTimeout(executeNext, delay - timeSinceLastExecution);
            }
        }
    };

    // Start the timer to process the queue
    setInterval(executeNext, delay);

    return (data: T) => new Promise<R>((resolve) => {
        queue.push({ resolve, data });
        executeNext(); // Try to execute immediately if possible
    });
}
