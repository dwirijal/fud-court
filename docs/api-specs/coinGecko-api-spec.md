# CoinGecko Public API

OpenAPI specification for the public endpoints of the CoinGecko REST API, based on the implementation in `src/api/crypto/coinGecko.ts`.

**Version:** v3

---

## Servers

*   **URL:** `https://api.coingecko.com/api/v3`

---

## Tags

*   **General:** General server information and connectivity.
*   **Coins:** Endpoints for retrieving cryptocurrency data.
*   **Search:** Endpoints for searching assets.
*   **Global:** Endpoints for global market data.

---

## Endpoints

### General

#### GET /ping
**Summary:** Check API Server Status
**Description:** Checks if the API server is up and running.
**Responses:**
*   `200`: API status message.

### Coins

#### GET /simple/price
**Summary:** Get Simple Price
**Description:** Get the current price of any cryptocurrencies in any other supported currencies that you need.
**Parameters:**
*   `ids` (query, required): A comma-separated string of coin IDs (e.g., bitcoin,ethereum).
*   `vs_currencies` (query, required): A comma-separated string of fiat currency symbols (e.g., usd,eur).
**Responses:**
*   `200`: A JSON object of coin prices.

#### GET /coins/markets
**Summary:** Get Coin Market Data
**Description:** Get cryptocurrency market data, including price, market cap, and volume.
**Parameters:**
*   `vs_currency` (query, required): The target currency of market data (e.g., usd, eur).
*   `ids` (query, optional): A comma-separated string of coin IDs to filter by.
*   `per_page` (query, optional, default: 100): Total results per page.
*   `page` (query, optional, default: 1): Page through results.
**Responses:**
*   `200`: An array of coin market data.

#### GET /coins/{id}
**Summary:** Get Coin Details
**Description:** Get detailed data for a single coin.
**Parameters:**
*   `id` (path, required): The ID of the coin (e.g., bitcoin).
**Responses:**
*   `200`: Detailed information for a single coin.

#### GET /coins/{id}/market_chart
**Summary:** Get Coin Market Chart
**Description:** Get historical market data (price, market cap, and volume) for a coin.
**Parameters:**
*   `id` (path, required): The ID of the coin (e.g., bitcoin).
*   `vs_currency` (query, required): The target currency.
*   `days` (query, required): Data up to number of days ago (e.g., 1, 7, 30).
**Responses:**
*   `200`: Historical market data.

### Search

#### GET /search/trending
**Summary:** Get Trending Search Data
**Description:** Get the top 7 trending coins on CoinGecko as searched by users in the last 24 hours.
**Responses:**
*   `200`: A list of trending coins.

### Global

#### GET /global
**Summary:** Get Global Market Data
**Description:** Get global cryptocurrency market data.
**Responses:**
*   `200`: Global market data.

---

## Schemas

### Coin
*   `id` (string)
*   `symbol` (string)
*   `name` (string)
*   `image` (string, format: uri)
*   `current_price` (number)
*   `market_cap` (number)
*   `market_cap_rank` (integer)
*   `total_volume` (number)
*   `price_change_percentage_24h` (number)

### CoinDetails
*   `id` (string)
*   `symbol` (string)
*   `name` (string)
*   `description` (object)
    *   `en` (string)
*   `image` (object)
    *   `thumb` (string, format: uri)
    *   `small` (string, format: uri)
    *   `large` (string, format: uri)
*   `market_cap_rank` (integer)
*   `market_data` (object)

### MarketData
*   `prices` (array of arrays of numbers)
*   `market_caps` (array of arrays of numbers)
*   `total_volumes` (array of arrays of numbers)

### TrendingResults
*   `coins` (array of objects)
    *   `item` (object)

### GlobalData
*   `data` (object)
    *   `active_cryptocurrencies` (integer)
    *   `markets` (integer)
    *   `total_market_cap` (object with additional properties of type number)
    *   `total_volume` (object with additional properties of type number)
    *   `market_cap_percentage` (object with additional properties of type number)
