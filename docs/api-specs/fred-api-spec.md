# FRED API Integration Specification

This document outlines the integration of the **FRED (Federal Reserve Economic Data)** API into the Fud Court application. This integration powers the Global Economic Dashboard, providing users with critical macroeconomic context to inform their financial decisions.

## 1. Overview

- **API Provider**: Federal Reserve Bank of St. Louis
- **API Documentation**: [https://fred.stlouisfed.org/docs/api/fred/](https://fred.stlouisfed.org/docs/api/fred/)
- **Purpose**: To fetch and display major economic indicators, such as GDP, inflation (CPI), unemployment rates, and federal funds rates.

## 2. Implementation Details

- **Client Location**: `src/lib/api-clients/economics/fred.ts` (Assumed location, client not shown in provided context but this is the logical path).
- **Data Fetching Action**: `src/app/market/global/actions.ts` contains the `fetchFredData` server action, which is responsible for calling the FRED API.
- **Configuration**: `src/config/fred-indicators.ts` defines the specific indicator series IDs and their groupings (e.g., Economic Growth, Labor Market).

### How It Works

1.  The `GlobalMarketOverviewPage` component, located at `src/app/market/global/page.tsx`, initiates a data request.
2.  The `fetchInitialData` function calls the `fetchFredData` server action, requesting the latest data points for all configured KPI and category indicators.
3.  When a user clicks on a specific indicator in the data table, the `handleIndicatorSelect` function is triggered.
4.  This function calls `fetchFredData` again, but this time requests a longer historical series (200 data points) for the selected indicator.
5.  The historical data is then passed to the `AdvancedIndicatorChart` component, which calculates and renders technical analysis overlays (SMA, RSI, MACD) using the utility functions in `src/lib/utils/financialCalculations.ts`.

## 3. Displayed Data & Features

- **Key Performance Indicators (KPIs)**: A top-level view of the most critical metrics (GDP Growth, Unemployment, Inflation, Fed Rate).
- **Categorized Indicators**: Data is grouped into logical categories like "Labor Market," "Inflation & Prices," and "Housing Sector" for easy navigation.
- **Interactive Charts**: For each indicator, users can view:
    - A historical price chart.
    - **Simple Moving Average (SMA)**: A 20-period SMA overlay to identify trends.
    - **Relative Strength Index (RSI)**: An oscillator to gauge market momentum and overbought/oversold conditions.
    - **Moving Average Convergence Divergence (MACD)**: A trend-following momentum indicator showing the relationship between two moving averages.

## 4. Environment Variables

To enable the FRED API integration, the following environment variable must be set in your `.env` file:

```
NEXT_PUBLIC_FRED_API_KEY=your_fred_api_key
```

You can obtain a free API key from the [FRED website](https://fred.stlouisfed.org/docs/api/api_key.html).
