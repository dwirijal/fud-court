

import { z } from 'zod';


// This is our internal, simplified type for crypto data.
// We map the more complex CoinGecko type to this.
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
  price_change_percentage_1h_in_currency: number | null;
  price_change_percentage_24h_in_currency: number | null;
  price_change_percentage_7d_in_currency: number | null;
  sparkline_in_7d?: {
    price: number[];
  };
  ath: number;
  ath_market_cap: number | null;
  last_updated: string;
}

// This is the shape of the data returned by the CoinGecko /coins/markets endpoint
export interface CGMarket {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    fully_diluted_valuation: number | null;
    total_volume: number;
    high_24h: number;
    low_24h: number;
    price_change_24h: number;
    price_change_percentage_24h: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
    ath: number;
    ath_change_percentage: number;
    ath_date: string;
    atl: number;
    atl_change_percentage: number;
    atl_date: string;
    roi: {
        times: number;
        currency: string;
        percentage: number;
    } | null;
    last_updated: string;
    sparkline_in_7d?: {
        price: number[];
    };
    price_change_percentage_1h_in_currency?: number;
    price_change_percentage_24h_in_currency?: number;
    price_change_percentage_7d_in_currency?: number;
    ath_market_cap: number | null;
}

export interface DetailedCoinData {
  id: string;
  symbol: string;
  name: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  description: {
    en: string;
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
    repos_url: {
      github: string[];
      bitbucket: string[];
    };
    subreddit_url: string;
    twitter_screen_name: string;
  };
  current_price: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  ath: number;
  ath_date: string;
  atl: number;
  atl_date: string;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_30d: number;
  price_change_percentage_1y: number;
  sentiment_votes_up_percentage: number;
  sentiment_votes_down_percentage: number;
  genesis_date: string;
}

export interface KlineData {
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
  ignore: string;
}



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
  // SEO fields from Ghost
  meta_title?: string | null;
  meta_description?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  twitter_title?: string | null;
  twitter_description?: string | null;
  twitter_image?: string | null;
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


// Fear & Greed Data
export interface FearGreedData {
    value: number;
    value_classification: 'Extreme Fear' | 'Fear' | 'Neutral' | 'Greed' | 'Extreme Greed';
}

// Market Stats for Dominance Card
export interface MarketStats {
    totalMarketCap: number;
    btcMarketCap: number;
    ethMarketCap: number;
    solMarketCap: number;
    ethTvl: number;
    solTvl: number;
    stablecoinMarketCap: number;
    btcDominance: number;
    ethDominance: number;
    solDominance: number;
    stablecoinDominance: number;
    maxHistoricalMarketCap: number;
}

// Type for displaying the list of coins used in analysis
export interface TopCoinForAnalysis {
    name: string;
    symbol: string;
    current_price: number;
    ath: number;
    price_change_percentage_24h: number | null;
}


// A combined type for the resilient fetchMarketData function
export interface CombinedMarketData {
    totalMarketCap: number;
    maxHistoricalMarketCap: number;
    totalVolume24h: number;
    avg30DayVolume: number;
    btcDominance: number;
    fearAndGreedIndex: number;
    topCoins: {
        price_change_percentage_24h: number | null;
        ath: number;
        current_price: number;
        name: string;
        symbol: string;
    }[];
    btcMarketCap: number;
    ethMarketCap: number;
    solMarketCap: number;
    ethTvl: number;
    solTvl: number;
    stablecoinMarketCap: number;
    ethDominance: number;
    solDominance: number;
    stablecoinDominance: number;
    maxHistoricalMarketCapDate: string;
    topCoinsForAnalysis: TopCoinForAnalysis[];
}

// DefiLlama Types matching the new schema
export interface DefiLlamaProtocol {
  id: string;
  name: string;
  symbol: string | null;
  category: string | null;
  chains: string[] | null;
  tvl: number | null;
  chain_tvls: any | null; // jsonb
  change_1d: number | null;
  change_7d: number | null;
}

export interface DefiLlamaStablecoin {
  id: string;
  name: string;
  symbol: string | null;
  peg_type: string | null;
  peg_mechanism: string | null;
  circulating_pegged_usd: number | null;
  chains: string[] | null;
  chain_circulating: any | null; // jsonb
  price: number | null;
}


export interface DefiLlamaHistoricalTvl {
  date: number; // Unix timestamp
  tvl: number; // Total Value Locked in USD
}
