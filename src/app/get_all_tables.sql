-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.FUD Court Analytics (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT FUD Court Analytics_pkey PRIMARY KEY (id)
);
CREATE TABLE public.coingecko_cache (
  id text NOT NULL,
  data jsonb,
  updated_at timestamp with time zone,
  CONSTRAINT coingecko_cache_pkey PRIMARY KEY (id)
);
CREATE TABLE public.crypto_data (
  id text NOT NULL,
  symbol text,
  name text,
  image text,
  current_price numeric,
  market_cap numeric,
  market_cap_rank integer,
  total_volume numeric,
  high_24h numeric,
  low_24h numeric,
  price_change_percentage_1h_in_currency numeric,
  price_change_percentage_24h_in_currency numeric,
  price_change_percentage_7d_in_currency numeric,
  sparkline_in_7d jsonb,
  ath numeric,
  ath_market_cap numeric,
  last_updated timestamp with time zone DEFAULT now(),
  new_column text,
  CONSTRAINT crypto_data_pkey PRIMARY KEY (id)
);
CREATE TABLE public.defillama_historical_tvl (
  date bigint NOT NULL,
  tvl numeric,
  last_updated timestamp with time zone DEFAULT now(),
  CONSTRAINT defillama_historical_tvl_pkey PRIMARY KEY (date)
);
CREATE TABLE public.defillama_protocols (
  id text NOT NULL,
  name text NOT NULL,
  symbol text,
  category text,
  chains ARRAY,
  tvl numeric,
  chain_tvls jsonb,
  change_1d numeric,
  change_7d numeric,
  last_updated timestamp with time zone DEFAULT now(),
  CONSTRAINT defillama_protocols_pkey PRIMARY KEY (id)
);
CREATE TABLE public.defillama_stablecoins (
  id text NOT NULL,
  name text NOT NULL,
  symbol text,
  peg_type text,
  peg_mechanism text,
  circulating_pegged_usd numeric,
  chains ARRAY,
  chain_circulating jsonb,
  price numeric,
  last_updated timestamp with time zone DEFAULT now(),
  CONSTRAINT defillama_stablecoins_pkey PRIMARY KEY (id)
);