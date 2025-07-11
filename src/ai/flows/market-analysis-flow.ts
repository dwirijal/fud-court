
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
  marketCap: 0.25,      // S1
  volume: 0.20,         // S2
  fearAndGreed: 0.20,   // S3
  ath: 0.25,            // S4
  marketBreadth: 0.10   // S5
};

/**
 * Calculates a confidence score based on the validity and completeness of the input data.
 * @param input The market analysis input data.
 * @returns A confidence score between 0 and 100.
 */
function calculateConfidenceScore(input: MarketAnalysisInput): number {
    let confidence = 100;

    // Deduct points for invalid or missing core metrics
    if (input.totalMarketCap <= 0) confidence -= 25;
    if (input.totalVolume24h <= 0) confidence -= 25;
    if (input.fearAndGreedIndex < 0 || input.fearAndGreedIndex > 100) confidence -= 15;

    // Deduct points if the topCoins array is incomplete
    const expectedCoins = 20; // Based on the number of coins we fetch in coingecko.ts
    if (input.topCoins.length < expectedCoins) {
        const missingPercentage = (expectedCoins - input.topCoins.length) / expectedCoins;
        confidence -= missingPercentage * 35; // Max 35 points penalty for missing coins
    }

    // Ensure confidence is not below 0
    return Math.max(0, Math.round(confidence));
}

const marketAnalysisFlow = ai.defineFlow(
  {
    name: 'marketAnalysisFlow',
    inputSchema: MarketAnalysisInputSchema,
    outputSchema: MarketAnalysisOutputSchema,
  },
  async (input) => {
    // 1. Market Cap Score (S1)
    const s1_marketCap = (input.totalMarketCap / input.maxHistoricalMarketCap) * 100;

    // 2. Volume Score (S2) - Capped at 200%, then normalized to 0-100
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
    let marketCondition: MarketAnalysisOutput['marketCondition'];

    if (finalScore >= 80) {
        marketCondition = 'Bullish ekstrem / Euforia';
    } else if (finalScore >= 60) {
        marketCondition = 'Bullish sehat';
    } else if (finalScore >= 40) {
        marketCondition = 'Netral / Sideways';
    } else if (finalScore >= 20) {
        marketCondition = 'Bearish / Distribusi';
    } else {
        marketCondition = 'Capitulation / Fear ekstrem';
    }
    
    const confidenceScore = calculateConfidenceScore(input);

    return {
      macroScore: finalScore,
      marketCondition,
      components: {
        marketCapScore: Math.round(finalScores.marketCap),
        volumeScore: Math.round(finalScores.volume),
        fearGreedScore: Math.round(finalScores.fearAndGreed),
        athScore: Math.round(finalScores.ath),
        marketBreadthScore: Math.round(finalScores.marketBreadth),
      },
      confidenceScore,
    };
  }
);


export async function analyzeMarketSentiment(input: MarketAnalysisInput): Promise<MarketAnalysisOutput> {
  return marketAnalysisFlow(input);
}
