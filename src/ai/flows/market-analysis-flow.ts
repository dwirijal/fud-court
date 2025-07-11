
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

// Updated weights based on the new 5-component model
const weights = {
  marketCap: 0.25, // S1
  volume: 0.20,      // S2
  fearAndGreed: 0.20,// S3
  ath: 0.25,         // S4
  marketBreadth: 0.10// S5
};

const marketAnalysisFlow = ai.defineFlow(
  {
    name: 'marketAnalysisFlow',
    inputSchema: MarketAnalysisInputSchema,
    outputSchema: MarketAnalysisOutputSchema,
  },
  async (input) => {
    // 1. Market Cap Score (S1)
    const s1_marketCap = (input.totalMarketCap / input.maxHistoricalMarketCap) * 100;

    // 2. Volume Score (S2)
    const raw_volume_score = (input.totalVolume24h / input.avg30DayVolume) * 100;
    const capped_volume_score = Math.min(raw_volume_score, 200);
    const s2_volume = capped_volume_score / 2;

    // 3. Fear and Greed Score (S3)
    const s3_fearAndGreed = input.fearAndGreedIndex;

    // 4. ATH Score (S4)
    const n_ath = input.topCoins.length;
    const distanceFromAthSum = input.topCoins.reduce((sum, coin) => {
        // Rumus: (ATH - Price) / ATH * 100
        const distance = ((coin.ath - coin.current_price) / coin.ath) * 100;
        return sum + (distance > 0 ? distance : 0); // only count if below ATH
    }, 0);
    const avgDistanceFromAth = n_ath > 0 ? (distanceFromAthSum / n_ath) : 0;
    const s4_ath = 100 - avgDistanceFromAth;

    // 5. Market Breadth Score (S5)
    const risingTokens = input.topCoins.filter(c => (c.price_change_percentage_24h || 0) > 0).length;
    const n_breadth = input.topCoins.length;
    const s5_marketBreadth = n_breadth > 0 ? (risingTokens / n_breadth) * 100 : 0;

    // Normalize all scores to be within 0-100 and handle potential outliers
    const normalize = (value: number) => Math.max(0, Math.min(100, value));

    const finalScores = {
        marketCap: normalize(s1_marketCap),
        volume: normalize(s2_volume),
        fearAndGreed: normalize(s3_fearAndGreed),
        ath: normalize(s4_ath),
        marketBreadth: normalize(s5_marketBreadth),
    };

    // Calculate final macro score (M)
    const macroScore = 
        finalScores.marketCap * weights.marketCap +
        finalScores.volume * weights.volume +
        finalScores.fearAndGreed * weights.fearAndGreed +
        finalScores.ath * weights.ath +
        finalScores.marketBreadth * weights.marketBreadth;
    
    const finalScore = Math.round(macroScore);

    // Interpretation based on the new 5-tier system
    let interpretation: MarketAnalysisOutput['interpretation'];
    let summary: string;

    if (finalScore >= 80) {
        interpretation = 'Strong Bullish';
        summary = 'Market is showing strong bullish signals, indicating potential euphoria. Exercise caution.';
    } else if (finalScore >= 60) {
        interpretation = 'Healthy Bullish';
        summary = 'Market sentiment is positive, suggesting a healthy accumulation or early trend phase.';
    } else if (finalScore >= 40) {
        interpretation = 'Neutral';
        summary = 'The market is in a neutral zone, indicating a "wait and see" approach or sideways movement.';
    } else if (finalScore >= 20) {
        interpretation = 'Bearish';
        summary = 'Market sentiment is bearish, suggesting a distribution phase with high risk.';
    } else {
        interpretation = 'Capitulation Zone';
        summary = 'Extreme fear in the market. Potential for high-risk, high-reward opportunities.';
    }

    return {
      macroScore: finalScore,
      interpretation,
      summary,
      componentScores: {
        marketCap: Math.round(finalScores.marketCap),
        volume: Math.round(finalScores.volume),
        fearAndGreed: Math.round(finalScores.fearAndGreed),
        ath: Math.round(finalScores.ath),
        marketBreadth: Math.round(finalScores.marketBreadth),
      }
    };
  }
);


export async function analyzeMarketSentiment(input: MarketAnalysisInput): Promise<MarketAnalysisOutput> {
  return marketAnalysisFlow(input);
}