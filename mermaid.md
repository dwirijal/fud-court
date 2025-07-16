flowchart TD
    subgraph "User Interaction"
        A1[Buka /markets/dashboard]
        A2[Buka /markets/stablecoin-metrics]
        A3[Buka halaman detail koin]
    end

    subgraph "Server-Side Data Fetching (via fetchMarketData)"
        A1 --> B1[fetchMarketData]
        B1 --> C1["Cache Supabase (crypto_data, global_market_data, fear_and_greed)"]
        C1 --> D1["Mapping & Agregasi Data"]
        D1 --> E1["Props ke Komponen Dashboard"]
    end
    
    subgraph "Client-Side Data Fetching"
        A2 --> F1["useEffect -> getDefiLlamaStablecoins"]
        F1 --> G1["Cache Supabase (defillama_stablecoins)"]
        G1 --> H1["State React: stablecoins[]"]
        H1 --> I1["Render Stablecoin Card Grid"]

        A3 --> J1["useEffect -> getDetailedCoinData & getKlinesData"]
        J1 --> K1["Cache Supabase (crypto_data)"]
        J1 --> K2["Binance API (klines)"]
        K1 & K2 --> L1["State React: detailedCoin, klineData"]
        L1 --> M1["Render Halaman Detail Koin (Chart, Stats)"]
    end

    subgraph "External APIs (Background Sync to Supabase)"
        N1[CoinGecko API] --> O1["Sinkronisasi ke Supabase (crypto_data, global_market_data)"]
        N2[Fear & Greed API] --> O2["Sinkronisasi ke Supabase (fear_and_greed)"]
        N3[DefiLlama API] --> O3["Sinkronisasi ke Supabase (defillama_protocols, defillama_stablecoins, defillama_historical_tvl)"]
        N4[CoinMarketCap API] --> O4["(Potensial) getTopCoinsFromCoinMarketCap"]
        N5[Binance API] --> O5["(Potensial) getTopCoinsFromBinance"]
    end

    subgraph "Component Mapping"
        E1 --> P1[SummaryBar]
        E1 --> P2[DetailedMarketSummarySection]
        E1 --> P3[MarketDataTable]
        E1 --> P4[IndicatorExplanationCards]
    end