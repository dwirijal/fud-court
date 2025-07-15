# Workflow Aplikasi Fud Court

## Flowchart Utama
```mermaid
flowchart TD
  %% Server Data Fetch
  A1[User buka /markets/dashboard]
  A1 --> B1[fetchMarketData]
  B1 --> C1[GET /coins/markets dari CoinGecko]
  B1 --> C2[GET /global dari CoinGecko]
  B1 --> C3[GET /fear-greed dari API Fear & Greed]
  B1 --> C4[GET /protocols dari DefiLlama]
  B1 --> C5[GET /stablecoins dari DefiLlama]
  B1 --> C6[GET /historicalChainTvl dari DefiLlama]

  %% Field Mapping
  C1 --> D1[current_price, market_cap, market_cap_rank, total_volume, ath, price_change_percentage_24h, symbol, name, image]
  C2 --> D2[btc_dominance, eth_dominance, total_market_cap, total_volume_24h]
  C3 --> D3[fear_and_greed_index, value_classification]
  C4 --> D4[protocol_name, tvl, change_1d, change_7d, chains]
  C5 --> D5[stablecoin_name, symbol, circulating, peggedUSD, price, pegType, pegMechanism, chains]
  C6 --> D6[date, tvl]

  %% Data Processing
  D1 & D2 & D3 & D4 & D5 & D6 --> E1[Server olah data: mapping, agregasi, scoring]

  %% Komponen Dashboard
  E1 --> F1[SummaryBar: market_cap, volume, btc_dominance, eth_dominance, fear_and_greed_index]
  E1 --> F2[DetailedMarketSummarySection: market_cap, volume, dominance, ath, dsb]
  E1 --> F3[DetailedMarketStatsSection: statistik detail]
  E1 --> F4[IndicatorExplanationCards: skor, value_classification, dsb]
  E1 --> F5[MarketDataTable: current_price, market_cap, rank, dsb]
  E1 --> F6[StablecoinMetricsCard: stablecoin_name, circulating, peggedUSD, price]

  %% Stablecoin Metrics Page (Client)
  G1[User buka /markets/stablecoin-metrics]
  G1 --> H1[useEffect: getDefiLlamaStablecoins]
  H1 --> I1[GET /stablecoins dari DefiLlama]
  I1 --> J1[stablecoin_name, symbol, circulating, peggedUSD, price, pegType, pegMechanism, chains]
  J1 --> K1[State React: stablecoins[]]
  K1 --> L1[Render Stablecoin Card: name, symbol, circulating, price, pegType, pegMechanism, chains]
  L1 --> M1[User klik Muat Lebih Banyak]
  M1 --> K1

  %% Penyimpanan Data
  C1 & C2 & C3 & C4 & C5 & C6 --> N1[Cache Supabase (jika ada)]

  %% Interaksi User
  F5 --> O1[User filter, sort, load more]
  O1 --> P1[Client fetch data tambahan dari API, update state]

  %% Dialog Modal
  F4 --> Q1[User klik buka dialog detail indikator]
  Q1 --> R1[Render komponen penjelasan indikator]
```

## Breakdown API, Field, Komponen, dan Penyimpanan
```mermaid
flowchart TD
  subgraph CoinGecko
    A1[/coins/markets/] -->|field: harga, market cap, volume, ath, dsb| B1[Server fetchMarketData]
    A2[/global/] -->|field: total_market_cap, btc_dominance, dsb| B1
  end
  subgraph FearGreed
    A3[/fear-greed/] -->|field: value, value_classification| B1
  end
  subgraph DefiLlama
    A4[/protocols/] -->|field: tvl, change_1d, dsb| B1
    A5[/stablecoins/] -->|field: name, peggedUSD, price, dsb| B1
    A5 -->|Client fetch (stablecoin-metrics)| C1[useEffect, state React]
    A6[/historicalChainTvl/] -->|field: date, tvl| B1
  end
  B1 --> D1[Cache Supabase]
  B1 --> E1[Props ke komponen dashboard]
  C1 --> F1[Stablecoin Card Grid]
``` 