
import { z } from 'zod';

// Market Analysis Flow Types
const TopCoinSchema = z.object({
  price_change_percentage_24h: z.number().nullable(),
  ath: z.number(),
  current_price: z.number(),
});

export const MarketAnalysisInputSchema = z.object({
  totalMarketCap: z.number().describe('Current total market capitalization in USD.'),
  maxHistoricalMarketCap: z.number().describe('The maximum historical total market capitalization in USD.'),
  totalVolume24h: z.number().describe('Current total 24h trading volume in USD.'),
  avg30DayVolume: z.number().describe('The average 30-day trading volume in USD.'),
  btcDominance: z.number().describe('Bitcoin dominance percentage.'),
  fearAndGreedIndex: z.number().min(0).max(100).describe('The Fear and Greed Index value.'),
  topCoins: z.array(TopCoinSchema).describe('A list of top coins with their price and ATH data.'),
});
export type MarketAnalysisInput = z.infer<typeof MarketAnalysisInputSchema>;

export const MarketAnalysisOutputSchema = z.object({
  macroScore: z.number().min(0).max(100).describe('The final calculated macro score for the market.'),
  marketCondition: z.enum([
      'Bullish ekstrem / Euforia',
      'Bullish sehat',
      'Netral / Sideways',
      'Bearish / Distribusi',
      'Capitulation / Fear ekstrem',
  ]).describe('The interpretation of the macro score.'),
  components: z.object({
    marketCapScore: z.number(),
    volumeScore: z.number(),
    fearGreedScore: z.number(),
    athScore: z.number(),
    marketBreadthScore: z.number(),
  }).describe('The individual scores for each component of the analysis.'),
  confidenceScore: z.number().min(0).max(100).describe('A score from 0 to 100 representing the confidence in the analysis based on the quality and completeness of the input data.'),
});
export type MarketAnalysisOutput = z.infer<typeof MarketAnalysisOutputSchema>;
