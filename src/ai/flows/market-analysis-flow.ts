
'use server';
/**
 * @fileOverview A flow for analyzing crypto market macro indicators to generate a score.
 *
 * - analyzeMarketSentiment - Calculates a macro market score based on various indicators.
 * - MarketAnalysisInput - The input type for the analysis function.
 * - MarketAnalysisOutput - The return type for the analysis function.
 */

import { ai } from '@/ai/genkit';
import { MarketAnalysisInputSchema, MarketAnalysisOutputSchema, type MarketAnalysisInput, type MarketAnalysisOutput } from '@/types';

const weights = {
  marketCap: 0.2,
  volume: 0.1,
  btcDominance: 0.15,
  fearAndGreed: 0.2,
  altseason: 0.1,
  marketBreadth: 0.15,
  ath: 0.1,
};

const marketAnalysisFlow = ai.defineFlow(
  {
    name: 'marketAnalysisFlow',
    inputSchema: MarketAnalysisInputSchema,
    outputSchema: MarketAnalysisOutputSchema,
  },
  async (input) => {
    // 1. Market Cap Normalization
    const mcap_norm = (input.totalMarketCap / input.maxHistoricalMarketCap) * 100;

    // 2. Volume Normalization
    const volume_norm = (input.totalVolume24h / input.avg30DayVolume) * 100;

    // 3. BTC Dominance Score
    const btc_dominance_score = 100 - input.btcDominance;

    // 4. Altseason Score
    const alt_season_score = (input.altcoinMarketCap / input.btcMarketCap) * 100;
    
    // 5. Market Breadth (Token performance)
    const risingTokens = input.topCoins.filter(c => (c.price_change_percentage_24h || 0) > 0).length;
    const market_breadth = (risingTokens / input.topCoins.length) * 100;

    // 6. ATH Score
    const n = input.topCoins.length;
    const distanceFromAthSum = input.topCoins.reduce((sum, coin) => {
        const distance = 1 - (coin.current_price / coin.ath);
        return sum + (distance > 0 ? distance : 0); // only count if below ATH
    }, 0);
    const avgDistanceFromAth = (distanceFromAthSum / n) * 100;
    const ath_score = 100 - avgDistanceFromAth;


    // Normalize all scores to be within 0-100 and handle potential outliers
    const normalize = (value: number) => Math.max(0, Math.min(100, value));

    const finalScores = {
        marketCap: normalize(mcap_norm),
        volume: normalize(volume_norm),
        btcDominance: normalize(btc_dominance_score),
        fearAndGreed: input.fearAndGreedIndex, // Already 0-100
        altseason: normalize(alt_season_score),
        marketBreadth: normalize(market_breadth),
        ath: normalize(ath_score),
    };

    // Calculate final macro score
    const macroScore = 
        finalScores.marketCap * weights.marketCap +
        finalScores.volume * weights.volume +
        finalScores.btcDominance * weights.btcDominance +
        finalScores.fearAndGreed * weights.fearAndGreed +
        finalScores.altseason * weights.altseason +
        finalScores.marketBreadth * weights.marketBreadth +
        finalScores.ath * weights.ath;
    
    const finalScore = Math.round(macroScore);

    // Interpretation
    let interpretation: 'Bullish' | 'Neutral' | 'Bearish';
    let summary: string;

    if (finalScore >= 70) {
        interpretation = 'Bullish';
        summary = 'The market is showing strong bullish signals, indicating high confidence and positive momentum.';
    } else if (finalScore >= 40) {
        interpretation = 'Neutral';
        summary = 'The market is in a neutral zone, showing a mix of signals without a clear directional trend.';
    } else {
        interpretation = 'Bearish';
        summary = 'The market is showing bearish signals, suggesting caution and potential for downward price movement.';
    }

    return {
      macroScore: finalScore,
      interpretation,
      summary,
    };
  }
);


export async function analyzeMarketSentiment(input: MarketAnalysisInput): Promise<MarketAnalysisOutput> {
  return marketAnalysisFlow(input);
}
