# Binance Public API

This document provides an OpenAPI specification for the public endpoints of the Binance REST API, based on the implementation in `src/api/crypto/binance.ts`.

**Base URL:** `https://api.binance.com/api/v3`

---

## Endpoints

### General

#### GET /ping
**Summary:** Test API Connectivity
**Description:** Tests connectivity to the REST API.
**Responses:**
*   `200`: An empty object on success.

#### GET /time
**Summary:** Get Server Time
**Description:** Fetches the current server time.
**Responses:**
*   `200`: The current server time.

#### GET /exchangeInfo
**Summary:** Get Exchange Information
**Description:** Fetches current exchange trading rules and symbol information.
**Parameters:**
*   `symbol` (query, optional): Symbol to get info for (e.g., BTCUSDT).
**Responses:**
*   `200`: Exchange information.

### Market Data

#### GET /depth
**Summary:** Get Order Book
**Description:** Fetches the order book for a specific symbol.
**Parameters:**
*   `symbol` (query, required): Trading symbol (e.g., BTCUSDT).
*   `limit` (query, optional, default: 100): Number of orders to retrieve. (Enum: 5, 10, 20, 50, 100, 500, 1000, 5000)
**Responses:**
*   `200`: The order book.

#### GET /trades
**Summary:** Get Recent Trades
**Description:** Fetches the most recent trades for a symbol.
**Parameters:**
*   `symbol` (query, required): Trading symbol (e.g., BTCUSDT).
*   `limit` (query, optional, default: 500, max: 1000): Number of trades to retrieve.
**Responses:**
*   `200`: A list of recent trades.

#### GET /aggTrades
**Summary:** Get Aggregate Trades
**Description:** Fetches compressed, aggregate trades.
**Parameters:**
*   `symbol` (query, required): Trading symbol (e.g., BTCUSDT).
*   `limit` (query, optional, default: 500, max: 1000): Number of trades to retrieve.
**Responses:**
*   `200`: A list of aggregate trades.

#### GET /klines
**Summary:** Get Kline/Candlestick Data
**Description:** Fetches kline (candlestick) data for a symbol.
**Parameters:**
*   `symbol` (query, required): Trading symbol (e.g., BTCUSDT).
*   `interval` (query, required): The kline interval. (Enum: "1s", "1m", "3m", "5m", "15m", "30m", "1h", "2h", "4h", "6h", "8h", "12h", "1d", "3d", "1w", "1M")
*   `limit` (query, optional, default: 500, max: 1000): Number of klines to retrieve.
**Responses:**
*   `200`: A list of kline data.

#### GET /avgPrice
**Summary:** Get Current Average Price
**Description:** Fetches the current average price for a symbol.
**Parameters:**
*   `symbol` (query, required): Trading symbol (e.g., BTCUSDT).
**Responses:**
*   `200`: The average price.

### Tickers

#### GET /ticker/24hr
**Summary:** Get 24hr Ticker Statistics
**Description:** Fetches 24-hour ticker price change statistics.
**Parameters:**
*   `symbol` (query, optional): Trading symbol (e.g., BTCUSDT). If omitted, all symbols are returned.
**Responses:**
*   `200`: Ticker statistics for one or all symbols.

#### GET /ticker/price
**Summary:** Get Symbol Price Ticker
**Description:** Fetches the latest price for a symbol or symbols.
**Parameters:**
*   `symbol` (query, optional): Trading symbol (e.g., BTCUSDT). If omitted, all symbols are returned.
**Responses:**
*   `200`: Price for one or all symbols.

#### GET /ticker/bookTicker
**Summary:** Get Order Book Ticker
**Description:** Fetches the best price/quantity on the order book for a symbol or symbols.
**Parameters:**
*   `symbol` (query, optional): Trading symbol (e.g., BTCUSDT). If omitted, all symbols are returned.
**Responses:**
*   `200`: Book ticker for one or all symbols.

---

## Schemas

### BinanceServerTime
*   `serverTime` (integer)

### BinanceExchangeInfo
*   `timezone` (string)
*   `serverTime` (integer)
*   `rateLimits` (array of objects)
*   `exchangeFilters` (array of objects)
*   `symbols` (array of BinanceSymbol)

### BinanceSymbol
*   `symbol` (string)
*   `status` (string)
*   `baseAsset` (string)
*   `baseAssetPrecision` (integer)
*   `quoteAsset` (string)
*   `quotePrecision` (integer)
*   `orderTypes` (array of strings)
*   `isSpotTradingAllowed` (boolean)
*   `isMarginTradingAllowed` (boolean)

### BinanceOrderBook
*   `lastUpdateId` (integer)
*   `bids` (array of arrays of strings)
*   `asks` (array of arrays of strings)

### BinanceTrade
*   `id` (integer)
*   `price` (string)
*   `qty` (string)
*   `quoteQty` (string)
*   `time` (integer)
*   `isBuyerMaker` (boolean)

### BinanceAggTrade
*   `a` (integer)
*   `p` (string)
*   `q` (string)
*   `f` (integer)
*   `l` (integer)
*   `T` (integer)
*   `m` (boolean)

### BinanceKline
*   `openTime` (integer)
*   `open` (string)
*   `high` (string)
*   `low` (string)
*   `close` (string)
*   `volume` (string)
*   `closeTime` (integer)
*   `quoteAssetVolume` (string)
*   `numberOfTrades` (integer)

### BinanceAvgPrice
*   `mins` (integer)
*   `price` (string)

### BinanceTicker24hr
*   `symbol` (string)
*   `priceChange` (string)
*   `priceChangePercent` (string)
*   `weightedAvgPrice` (string)
*   `lastPrice` (string)
*   `volume` (string)
*   `quoteVolume` (string)
*   `openTime` (integer)
*   `closeTime` (integer)
*   `count` (integer)

### BinancePrice
*   `symbol` (string)
*   `price` (string)

### BinanceBookTicker
*   `symbol` (string)
*   `bidPrice` (string)
*   `bidQty` (string)
*   `askPrice` (string)
*   `askQty` (string)
