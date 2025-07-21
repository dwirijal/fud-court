# DexScreener Public API

OpenAPI specification for the public endpoints of the DexScreener REST API, based on the implementation in `src/api/crypto/dexScreener.ts`.

**Version:** 1.0.0

---

## Servers

*   **URL:** `https://api.dexscreener.com/latest`

---

## Tags

*   **Pairs:** Endpoints for retrieving pair and token data.
*   **Search:** Endpoints for searching pairs.

---

## Endpoints

#### GET /dex/search/
**Summary:** Search for Pairs
**Description:** Search for pairs by token symbol, name, or address.
**Parameters:**
*   `q` (query, required): The search query string.
**Responses:**
*   `200`: A list of pairs matching the search query.

#### GET /dex/pairs/{chainId}/{pairAddresses}
**Summary:** Get Pairs by Addresses
**Description:** Get information for up to 30 pairs by their addresses on a specific chain.
**Parameters:**
*   `chainId` (path, required): The blockchain identifier (e.g., ethereum, bsc).
*   `pairAddresses` (path, required): A comma-separated string of pair addresses.
**Responses:**
*   `200`: A list of the requested pairs.

#### GET /dex/tokens/{tokenAddresses}
**Summary:** Get Pairs for Tokens
**Description:** Get all pairs that include one of the specified token addresses.
**Parameters:**
*   `tokenAddresses` (path, required): A comma-separated string of token addresses.
**Responses:**
*   `200`: A list of pairs associated with the given tokens.

---

## Schemas

### DexScreenerPair
*   `chainId` (string)
*   `dexId` (string)
*   `url` (string, format: uri)
*   `pairAddress` (string)
*   `baseToken` (Token)
*   `quoteToken` (Token)
*   `priceNative` (string)
*   `priceUsd` (string)
*   `volume` (object)
    *   `h24` (number)
    *   `h6` (number)
    *   `h1` (number)
    *   `m5` (number)
*   `priceChange` (object)
    *   `h24` (number)
    *   `h6` (number)
    *   `h1` (number)
    *   `m5` (number)
*   `liquidity` (object)
    *   `usd` (number)

### Token
*   `address` (string)
*   `name` (string)
*   `symbol` (string)

### DexScreenerSearchResult
*   `schemaVersion` (string)
*   `pairs` (array of DexScreenerPair)

### DexScreenerTokenResponse
*   `schemaVersion` (string)
*   `pairs` (array of DexScreenerPair)
