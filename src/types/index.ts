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
}

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  sparkline: number[];
}
