

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
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_24h_in_currency: number;
  price_change_percentage_7d_in_currency: number;
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
export interface DiscordMember {
  id: string;
  name: string;
  avatarUrl: string;
  roles: string[];
  joinedAt: string;
}

export interface DiscordChannel {
    id: string;
    name: string;
    type: 'Text' | 'Voice' | 'Announcement' | 'Category';
    category: string;
    parentId: string | null;
}

export interface DiscordGuildData {
    name: string;
    iconUrl: string | null;
    totalMembers: number;
    onlineMembers: number;
    totalChannels: number;
}
