import { z } from 'zod';

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  feature_image: string | null;
  published_at: string;
  primary_tag: {
    id: string;
    name: string;
  } | null;
  html?: string;
}

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_24h_in_currency: number;
  price_change_percentage_7d_in_currency: number;
  sparkline_in_7d?: {
    price: number[];
  };
  ath: number;
  ath_market_cap: number | null;
}

// DexScreener Types
interface DexToken {
    address: string;
    name: string;
    symbol: string;
}

interface DexPair {
    address: string;
    url: string;
    platform: {
        id: string;
    };
    baseToken: DexToken;
}

export interface BoostedToken {
    version: string;
    token: DexToken;
    pair: {
        address: string;
        url: string;
    };
    source: string;
    timestamp: number;
    audit: {
        is_honeypot: boolean;
        is_open_source: boolean;
    };
}

// This is the new structure based on the user's example for token profiles.
interface DexLink {
  label: string;
  url: string;
}

export interface TokenProfile {
  url: string;
  chainId: string;
  tokenAddress: string;
  icon?: string;
  header?: string;
  description?: string;
  links?: DexLink[];
}

// Moralis Types
export interface MoralisTrendingToken {
  rank: string;
  logo: string | null;
  name: string;
  symbol: string;
  address: string;
  price_change_24h: string;
  price_usd: string;
}

// Discord Types
export interface DiscordChannel {
    id: string;
    name: string;
    type: 'Text' | 'Voice' | 'Announcement' | 'Category';
    topic: string | null;
    parentId: string | null;
    position: number;
    nsfw: boolean;
    rate_limit_per_user: number;
}

export interface DiscordGuildData {
    name: string;
    iconUrl: string | null;
    totalMembers: number;
    onlineMembers: number;
    totalChannels: number;
}


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
  btcMarketCap: z.number().describe('Current Bitcoin market capitalization in USD.'),
  altcoinMarketCap: z.number().describe('Current market capitalization of all altcoins (total minus BTC).'),
  btcDominance: z.number().describe('Bitcoin dominance percentage.'),
  fearAndGreedIndex: z.number().min(0).max(100).describe('The Fear and Greed Index value.'),
  topCoins: z.array(TopCoinSchema).describe('A list of top coins with their price and ATH data.'),
});
export type MarketAnalysisInput = z.infer<typeof MarketAnalysisInputSchema>;

export const MarketAnalysisOutputSchema = z.object({
  macroScore: z.number().min(0).max(100).describe('The final calculated macro score for the market.'),
  interpretation: z.enum(['Bullish', 'Neutral', 'Bearish']).describe('The interpretation of the macro score.'),
  summary: z.string().describe('A short, one-sentence summary of the current market sentiment based on the score.'),
});
export type MarketAnalysisOutput = z.infer<typeof MarketAnalysisOutputSchema>;
