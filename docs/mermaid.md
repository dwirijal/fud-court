flowchart TD
    subgraph "User Interaction (Updated)"
        A1[Buka Homepage dengan ModernHero]
        A2[Buka /market-sentiment]
        A3[Buka /markets/dashboard]
        A4[Buka halaman detail koin]
    end

    subgraph "Client-Side Data Fetching (Primary Strategy)"
        A1 --> B1["useRealTimePrices() Hook"]
        A2 --> B2["useRealTimePrices(['bitcoin', 'ethereum'])"]
        A3 --> B3["usePortfolioTracker() / useTopMovers()"]
        A4 --> B4["useTokenSearch() / useWatchlist()"]
        
        B1 --> C1["CoinGecko API Direct Call"]
        B2 --> C2["CoinGecko API Direct Call"]
        B3 --> C3["CoinGecko API Direct Call"]
        B4 --> C4["CoinGecko API Direct Call"]
        
        C1 --> D1["localStorage Cache (5 min)"]
        C2 --> D2["Market Calculations Library"]
        C3 --> D3["localStorage Cache (5 min)"]
        C4 --> D4["localStorage Cache (5 min)"]
        
        D2 --> E2["calculateMarketSentiment()"]
        D2 --> E3["calculateTechnicalIndicators()"]
        E2 --> F2["Market Sentiment Page Render"]
        E3 --> F3["Bento Grid Layout"]
    end
    
    subgraph "Backup Server-Side Caching (Optional)"
        G1[Supabase MCP Server] --> H1["execute_sql for caching"]
        G1 --> H2["apply_migration for schema updates"]
        H1 --> I1["Cache frequently requested data"]
        H2 --> I2["Maintain data structure"]
    end

    subgraph "Market Calculation Engine"
        J1[Market Data Input] --> K1["validateMarketData()"]
        K1 --> K2["calculateMarketSentiment()"]
        K1 --> K3["calculateTechnicalIndicators()"]
        K1 --> K4["calculateSupportResistance()"]
        
        K2 --> L1["Market Sentiment Score"]
        K3 --> L2["Volatility Index, Liquidity Ratio"]
        K4 --> L3["Support/Resistance Levels"]
        
        L1 --> M1["Rate Limited Calculations"]
        L2 --> M1
        L3 --> M1
        M1 --> M2["Real-time Display Updates"]
    end

    subgraph "External APIs (Rate Limited)"
        N1[CoinGecko API] --> O1["Price Data, Market Cap, Volume"]
        N2[DeFiLlama API] --> O2["TVL Data, Gas Prices"]
        N3[Ghost CMS API] --> O3["News Articles"]
        
        O1 --> P1["Client-side Rate Limiter (50/min)"]
        O2 --> P2["Client-side Rate Limiter"]
        O3 --> P3["Client-side Rate Limiter"]
    end

    subgraph "Modern UI Components"
        Q1[ModernHero] --> R1["Framer Motion Animations"]
        Q2[MarketSentimentPage] --> R2["Bento Grid Layout"]
        Q3[TechnicalIndicatorCard] --> R3["Real-time Updates"]
        Q4[SupportResistanceChart] --> R4["Recharts Integration"]
        
        R1 --> S1["Gradient Backgrounds, Floating Elements"]
        R2 --> S2["Responsive Grid System"]
        R3 --> S3["Live Price Feeds"]
        R4 --> S4["Interactive Charts"]
    end

    subgraph "Design System (Updated)"
        T1[CSS Custom Properties] --> U1["Modular Scale (1.125 ratio)"]
        T2[Tailwind Config] --> U2["Custom Color Palette"]
        T3[Component Library] --> U3["Atomic Design Pattern"]
        
        U1 --> V1["Typography Scale"]
        U2 --> V2["Dark Theme Colors"]
        U3 --> V3["Reusable Components"]
    end
