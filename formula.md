# Mathematical Formulas in Fud Court

## Data Processing Overview
(Penjelasan singkat tahapan pengolahan data, boleh tetap ada di sini)

## 1. Currency Conversion
### USD to Target Currency Exchange Rate
**Formula:**
Exchange Rate (USD to Target Currency) = (Bitcoin Price in Target Currency) / (Bitcoin Price in USD)

## 2. Market Dominance Calculations
**Formulas:**
Bitcoin Market Cap = Total Market Cap × max(0, min(100, Bitcoin Dominance)) / 100
Ethereum Market Cap = Total Market Cap × max(0, min(100, Ethereum Dominance)) / 100
Solana Dominance = (Solana Market Cap / max(1, Total Market Cap)) × 100
Stablecoin Dominance = (Stablecoin Market Cap / max(1, Total Market Cap)) × 100

## 3. Historical Market Cap Adjustment
**Formula:**
Adjusted Max Historical Market Cap = max(Hardcoded Max Historical Cap, Current Total Market Cap)

## 4. Volatility Index
**Formula:**
Volatility Index = √(Σ(Price Change%)² / n) × 100

## 5. Liquidity Ratio
**Formula:**
Liquidity Ratio = (24h Trading Volume / Market Cap) × 100

## 6. Market Sentiment Score
**Formula:**
Market Sentiment Score = (
    (Price Change 24h × 0.3) +
    (Volume Change 24h × 0.2) +
    (Market Cap Change 24h × 0.2) +
    (Dominance Change × 0.3)
) / 4
Score = (Raw Score + 100) / 2

## 7. Risk-Adjusted Returns (Sharpe Ratio)
**Formula:**
Sharpe Ratio = (Average Return - Risk-Free Rate) / Standard Deviation of Returns

## 8. Support/Resistance Levels
**Formulas:**
Support Level = Price × (1 - (ATH Drawdown × 0.618))
Resistance Level = Price × (1 + (Recovery Factor × 0.382))

## 9. Price Prediction Model (SMA, EMA, Price Signal)
**Formulas:**
SMA(n) = (P₁ + P₂ + ... + Pₙ) / n
EMA(n) = (Price × (2/(n+1))) + (Previous EMA × (1-(2/(n+1))))
Price Signal = (EMA(12) - EMA(26)) / EMA(26) × 100

## 10. Volatility Index
**Formula:**
`Volatility = sqrt(Σ(price_change_i^2) / n) * 100`
- `price_change_i`: Perubahan harga untuk periode ke-i.
- `n`: Jumlah periode.

## 11. Liquidity Ratio
**Formula:**
`Liquidity Ratio = (Volume 24 Jam / Kapitalisasi Pasar) * 100`

## 12. Market Sentiment Score
**Formula:**
`Raw Score = ((PriceChange * 0.3) + (VolumeChange * 0.2) + (MarketCapChange * 0.2) + (DominanceChange * 0.3)) / 4`
`Normalized Score = (Raw Score + 100) / 2`

## 13. Support/Resistance Levels (Fibonacci Based)
**Formula:**
`Support = CurrentPrice * (1 - ((ATH - CurrentPrice) / ATH) * 0.618)`
`Resistance = CurrentPrice * (1 + ((CurrentPrice - ATL) / (ATH - ATL)) * 0.382)`

## 14. Price Signal (MACD-like)
**Formula:**
`Price Signal = (EMA(12) - EMA(26)) / EMA(26) * 100`

## 15. Sharpe Ratio
**Formula:**
`Sharpe Ratio = (Rata-rata Return - Tingkat Bebas Risiko) / Standar Deviasi Return`

## Validation and Error Handling
### 1. Input Validation
function validateMarketData(data) { ... }
### 2. Outlier Detection
function detectOutliers(values) { ... }
### 3. Rate Limiting Protection
function rateLimitedCalculation(calculation, maxPerSecond = 10) { ... }