export const calculateSMA = (data: number[], period: number): (number | null)[] => {
    if (period > data.length) return Array(data.length).fill(null);

    const sma: (number | null)[] = Array(period - 1).fill(null);
    for (let i = period - 1; i < data.length; i++) {
        const sum = data.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val, 0);
        sma.push(sum / period);
    }
    return sma;
};

export const calculateRSI = (data: number[], period: number = 14): (number | null)[] => {
    if (period >= data.length) return Array(data.length).fill(null);

    const rsi: (number | null)[] = Array(period).fill(null);
    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
        const change = data[i] - data[i - 1];
        if (change > 0) {
            gains += change;
        } else {
            losses -= change;
        }
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    if (avgLoss === 0) {
        rsi.push(100);
    } else {
        const rs = avgGain / avgLoss;
        rsi.push(100 - (100 / (1 + rs)));
    }

    for (let i = period + 1; i < data.length; i++) {
        const change = data[i] - data[i - 1];
        let currentGain = 0;
        let currentLoss = 0;

        if (change > 0) {
            currentGain = change;
        } else {
            currentLoss = -change;
        }

        avgGain = (avgGain * (period - 1) + currentGain) / period;
        avgLoss = (avgLoss * (period - 1) + currentLoss) / period;

        if (avgLoss === 0) {
            rsi.push(100);
        } else {
            const rs = avgGain / avgLoss;
            rsi.push(100 - (100 / (1 + rs)));
        }
    }

    return rsi;
};

export const calculateMACD = (data: number[], shortPeriod: number = 12, longPeriod: number = 26, signalPeriod: number = 9): ({ macd: number; signal: number; histogram: number; } | null)[] => {
    if (longPeriod >= data.length) return Array(data.length).fill(null);

    const calculateEMA = (emaData: number[], period: number): number[] => {
        const k = 2 / (period + 1);
        const ema: number[] = [emaData[0]];
        for (let i = 1; i < emaData.length; i++) {
            ema.push(emaData[i] * k + ema[i - 1] * (1 - k));
        }
        return ema;
    };

    const shortEMA = calculateEMA(data, shortPeriod);
    const longEMA = calculateEMA(data, longPeriod);

    const macdLine = shortEMA.map((val, i) => val - longEMA[i]);
    const signalLine = calculateEMA(macdLine, signalPeriod);
    const histogram = macdLine.map((val, i) => val - signalLine[i]);

    const result: ({ macd: number; signal: number; histogram: number; } | null)[] = [];
    for (let i = 0; i < data.length; i++) {
        if (i < longPeriod - 1) {
            result.push(null);
        } else {
            result.push({
                macd: macdLine[i],
                signal: signalLine[i],
                histogram: histogram[i],
            });
        }
    }

    return result;
};
