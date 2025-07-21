# DefiLlama API

Docs for defillama's open API

Need higher rate limits or priority support? We offer a premium plan for 300$/mo. To get it, go to https://defillama.com/subscription

**Version:** 1.0.0-oas3

---

## Servers

*   **URL:** `https://api.llama.fi`

---

## Tags

*   **TVL:** Retrieve TVL data
*   **coins:** General blockchain data used by defillama and open-sourced
*   **stablecoins:** Data from our stablecoins dashboard
*   **yields:** Data from our yields/APY dashboard
*   **volumes:** Data from our volumes dashboards
*   **fees and revenue:** Data from our fees and revenue dashboard

---

## Endpoints

### TVL

#### GET /protocols
**Summary:** List all protocols on defillama along with their tvl
**Responses:**
*   `200`: Array of all protocols with their TVL data

#### GET /protocol/{protocol}
**Summary:** Get historical TVL of a protocol and breakdowns by token and chain
**Parameters:**
*   `protocol` (path, required): protocol slug (Example: `aave`)
**Responses:**
*   `200`: Protocol details with historical TVL data and chain breakdowns
*   `404`: Protocol not found

#### GET /v2/historicalChainTvl
**Summary:** Get historical TVL (excludes liquid staking and double counted tvl) of DeFi on all chains
**Responses:**
*   `200`: Historical TVL data for all chains combined

#### GET /v2/historicalChainTvl/{chain}
**Summary:** Get historical TVL (excludes liquid staking and double counted tvl) of a chain
**Parameters:**
*   `chain` (path, required): chain slug, you can get these from /chains or the chains property on /protocols (Example: `Ethereum`)
**Responses:**
*   `200`: Historical TVL data for the specified chain
*   `404`: Chain not found

#### GET /tvl/{protocol}
**Summary:** Simplified endpoint to get current TVL of a protocol
**Description:** Simplified endpoint that only returns a number, the current TVL of a protocol
**Parameters:**
*   `protocol` (path, required): protocol slug (Example: `uniswap`)
**Responses:**
*   `200`: Current TVL of the protocol in USD
*   `404`: Protocol not found

#### GET /v2/chains
**Summary:** Get current TVL of all chains
**Responses:**
*   `200`: Array of all chains with their TVL data

### coins

#### GET /prices/current/{coins}
**Summary:** Get current prices of tokens by contract address
**Description:** The goal of this API is to price as many tokens as possible, including exotic ones that never get traded, which makes them impossible to price by looking at markets.

The base of our data are prices pulled from coingecko, which is then extended through multiple means:
- We price all bridged tokens by using the price of the token in it's original chain, so we fetch all bridged versions of USDC on arbitrum, fantom, avax... and price all them using the price for the token on Ethereum, which we know. Right now we support 10 different bridging protocols.
- We have multiple adapters to price specialized sets of tokens by running custom code:
  - We price yearn's yToken LPs by checking how much underlying token can be withdrawn for each LP
  - Aave, compound and euler LP tokens are also priced based on their relationship against underlying tokens
  - Uniswap, curve, balancer and stargate LPs are priced using the underlying tokens in each pair
  - GMX's GLP token is priced based on the value of tokens given on withdrawal (which includes calculations based on trader's PnL)
  
  - Synthetix tokens are priced using forex prices of the coin they are pegged to
- For tokens that we haven't been able to price in any other way, we find the pool with most liquidity for each on uniswap, curve and serum and then use the prices provided on those exchanges.
  
  Unlike all the other tokens, we can't confirm that these prices are correct, so we only ingest the ones that have sufficient liquidity and, even in that case, we attach a `confidence` value to them that is related to the depth of liquidity and which represents our confidence in the quality of each price. API consumers can choose to filter out prices with low confidence values.
  
 Our API server is fully open source and we are constantly adding more pricing adapters, extending the amount of tokens we support.
  
Tokens are queried using {chain}:{address}, where chain is an identifier such... [truncated]
**Servers:**
*   **URL:** `https://coins.llama.fi`
**Parameters:**
*   `coins` (path, required): set of comma-separated tokens defined as {chain}:{address} (Example: `ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1,coingecko:ethereum,bsc:0x762539b45a1dcce3d36d080f74d1aed37844b878,ethereum:0xdB25f211AB05b1c97D595516F45794528a807ad8`)
*   `searchWidth` (query, optional): time range on either side to find price data, defaults to 6 hours (Example: `4h`)
**Responses:**
*   `200`: successful operation
*   `502`: Internal error

#### GET /prices/historical/{timestamp}/{coins}
**Summary:** Get historical prices of tokens by contract address
**Description:** See /prices/current for explanation on how prices are sourced.
**Servers:**
*   **URL:** `https://coins.llama.fi`
**Parameters:**
*   `coins` (path, required): set of comma-separated tokens defined as {chain}:{address} (Example: `ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1,coingecko:ethereum,bsc:0x762539b45a1dcce3d36d080f74d1aed37844b878,ethereum:0xdB25f211AB05b1c97D595516F45794528a807ad8`)
*   `timestamp` (path, required): UNIX timestamp of time when you want historical prices (Example: `1648680149`)
*   `searchWidth` (query, optional): time range on either side to find price data, defaults to 6 hours (Example: `4h`)
**Responses:**
*   `200`: successful operation
*   `502`: Internal error

#### GET /batchHistorical
**Summary:** Get historical prices for multiple tokens at multiple different timestamps
**Description:** Strings accepted by period and searchWidth:
Can use regular chart candle notion like ‘4h’ etc where:
W = week, D = day, H = hour, M = minute (not case sensitive)
**Servers:**
*   **URL:** `https://coins.llama.fi`
**Parameters:**
*   `coins` (query, required): object where keys are coins in the form {chain}:{address}, and values are arrays of requested timestamps (Example: `{"avax:0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e": [1666876743, 1666862343], "coingecko:ethereum": [1666869543, 1666862343]}`)
*   `searchWidth` (query, optional): time range on either side to find price data, defaults to 6 hours (Example: `600`)
**Responses:**
*   `200`: successful operation
*   `502`: Internal error

#### GET /chart/{coins}
**Summary:** Get token prices at regular time intervals
**Description:** Strings accepted by period and searchWidth:
Can use regular chart candle notion like ‘4h’ etc where:
W = week, D = day, H = hour, M = minute (not case sensitive)
**Servers:**
*   **URL:** `https://coins.llama.fi`
**Parameters:**
*   `coins` (path, required): set of comma-separated tokens defined as {chain}:{address} (Example: `ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1,coingecko:ethereum,bsc:0x762539b45a1dcce3d36d080f74d1aed37844b878,ethereum:0xdB25f211AB05b1c97D5955116F45794528a807ad8`)
*   `start` (query, optional): unix timestamp of earliest data point requested (Example: `1664364537`)
*   `end` (query, optional): unix timestamp of latest data point requested (Example: `null`)
*   `span` (query, optional): number of data points returned, defaults to 0 (Example: `10`)
*   `period` (query, optional): duration between data points, defaults to 24 hours (Example: `2d`)
*   `searchWidth` (query, optional): time range on either side to find price data, defaults to 10% of period (Example: `600`)
**Responses:**
*   `200`: successful operation
*   `502`: Internal error

#### GET /percentage/{coins}
**Summary:** Get percentage change in price over time
**Description:** Strings accepted by period:
Can use regular chart candle notion like ‘4h’ etc where:
W = week, D = day, H = hour, M = minute (not case sensitive)
**Servers:**
*   **URL:** `https://coins.llama.fi`
**Parameters:**
*   `coins` (path, required): set of comma-separated tokens defined as {chain}:{address} (Example: `ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1,coingecko:ethereum,bsc:0x762539b45a1dcce3d36d080f74d1aed37844b878,ethereum:0xdB25f211AB05b1c97D595516F45794528a807ad8`)
*   `timestamp` (query, optional): timestamp of data point requested, defaults to time now (Example: `1664364537`)
*   `lookForward` (query, optional): whether you want the duration after your given timestamp or not, defaults to false (looking back) (Example: `false`)
*   `period` (query, optional): duration between data points, defaults to 24 hours (Example: `3w`)
**Responses:**
*   `200`: successful operation
*   `502`: Internal error

#### GET /prices/first/{coins}
**Summary:** Get earliest timestamp price record for coins
**Servers:**
*   **URL:** `https://coins.llama.fi`
**Parameters:**
*   `coins` (path, required): set of comma-separated tokens defined as {chain}:{address} (Example: `ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1,coingecko:ethereum,bsc:0x762539b45a1dcce3d36d080f74d1aed37844b878,ethereum:0xdB25f211AB05b1c97D595516F45794528a807ad8`)
**Responses:**
*   `200`: successful operation
*   `502`: Internal error

#### GET /block/{chain}/{timestamp}
**Summary:** Get the closest block to a timestamp
**Description:** Runs binary search over a blockchain's blocks to get the closest one to a timestamp.
Every time this is run we add new data to our database, so each query permanently speeds up future queries.
**Servers:**
*   **URL:** `https://coins.llama.fi`
**Parameters:**
*   `chain` (path, required): Chain which you want to get the block from
*   `timestamp` (path, required): UNIX timestamp of the block you are searching for
**Responses:**
*   `200`: successful operation
*   `400`: Invalid chain or timestamp provided

### stablecoins

#### GET /stablecoins
**Summary:** List all stablecoins along with their circulating amounts
**Servers:**
*   **URL:** `https://stablecoins.llama.fi`
**Parameters:**
*   `includePrices` (query, optional): set whether to include current stablecoin prices (Example: `true`)
**Responses:**
*   `200`: Array of all stablecoins with their circulation data

#### GET /stablecoincharts/all
**Summary:** Get historical mcap sum of all stablecoins
**Servers:**
*   **URL:** `https://stablecoins.llama.fi`
**Parameters:**
*   `stablecoin` (query, optional): stablecoin ID, you can get these from /stablecoins (Example: `1`)
**Responses:**
*   `200`: Historical market cap data for all stablecoins

#### GET /stablecoincharts/{chain}
**Summary:** Get historical mcap sum of all stablecoins in a chain
**Servers:**
*   **URL:** `https://stablecoins.llama.fi`
**Parameters:**
*   `chain` (path, required): chain slug, you can get these from /chains or the chains property on /protocols (Example: `Ethereum`)
*   `stablecoin` (query, optional): stablecoin ID, you can get these from /stablecoins (Example: `1`)
**Responses:**
*   `200`: Historical market cap data for stablecoins on specified chain

#### GET /stablecoin/{asset}
**Summary:** Get historical mcap and historical chain distribution of a stablecoin
**Servers:**
*   **URL:** `https://stablecoins.llama.fi`
**Parameters:**
*   `asset` (path, required): stablecoin ID, you can get these from /stablecoins (Example: `1`)
**Responses:**
*   `200`: Historical market cap and chain distribution for specific stablecoin

#### GET /stablecoinchains
**Summary:** Get current mcap sum of all stablecoins on each chain
**Servers:**
*   **URL:** `https://stablecoins.llama.fi`
**Responses:**
*   `200`: Current market cap of stablecoins by chain

#### GET /stablecoinprices
**Summary:** Get historical prices of all stablecoins
**Servers:**
*   **URL:** `https://stablecoins.llama.fi`
**Responses:**
*   `200`: Historical prices for all stablecoins

### yields

#### GET /pools
**Summary:** Retrieve the latest data for all pools, including enriched information such as predictions
**Servers:**
*   **URL:** `https://yields.llama.fi`
**Responses:**
*   `200`: Array of all yield farming pools with their data

#### GET /chart/{pool}
**Summary:** Get historical APY and TVL of a pool
**Servers:**
*   **URL:** `https://yields.llama.fi`
**Parameters:**
*   `pool` (path, required): pool id, can be retrieved from /pools (property is called pool) (Example: `747c1d2a-c668-4682-b9f9-296708a3dd90`)
**Responses:**
*   `200`: Historical APY and TVL data for specified pool

### volumes

#### GET /overview/dexs
**Summary:** List all dexs along with summaries of their volumes and dataType history data
**Servers:**
*   **URL:** `https://api.llama.fi`
**Parameters:**
*   `excludeTotalDataChart` (query, optional): true to exclude aggregated chart from response (Example: `true`)
*   `excludeTotalDataChartBreakdown` (query, optional): true to exclude broken down chart from response (Example: `true`)
**Responses:**
*   `200`: Overview of all DEXs with volume data

#### GET /overview/dexs/{chain}
**Summary:** List all dexs along with summaries of their volumes and dataType history data filtering by chain
**Servers:**
*   **URL:** `https://api.llama.fi`
**Parameters:**
*   `chain` (path, required): chain name, list of all supported chains can be found under allChains attribute in /overview/dexs response (Example: `ethereum`)
*   `excludeTotalDataChart` (query, optional): true to exclude aggregated chart from response (Example: `true`)
*   `excludeTotalDataChartBreakdown` (query, optional): true to exclude broken down chart from response (Example: `true`)
**Responses:**
*   `200`: Overview of DEXs on specified chain with volume data

#### GET /summary/dexs/{protocol}
**Summary:** Get summary of dex volume with historical data
**Servers:**
*   **URL:** `https://api.llama.fi`
**Parameters:**
*   `protocol` (path, required): protocol slug (Example: `uniswap`)
*   `excludeTotalDataChart` (query, optional): true to exclude aggregated chart from response (Example: `true`)
*   `excludeTotalDataChartBreakdown` (query, optional): true to exclude broken down chart from response (Example: `true`)
**Responses:**
*   `200`: DEX protocol volume summary with historical data

#### GET /overview/options
**Summary:** List all options dexs along with summaries of their volumes and dataType history data
**Servers:**
*   **URL:** `https://api.llama.fi`
**Parameters:**
*   `excludeTotalDataChart` (query, optional): true to exclude aggregated chart from response (Example: `true`)
*   `excludeTotalDataChartBreakdown` (query, optional): true to exclude broken down chart from response (Example: `true`)
*   `dataType` (query, optional): Desired data type, dailyNotionalVolume by default. (Enum: "dailyPremiumVolume", "dailyNotionalVolume") (Example: `dailyPremiumVolume`)
**Responses:**
*   `200`: Overview of all options DEXs with volume data

---

## Schemas

### Protocol
*   `id` (string)
*   `name` (string)
*   `symbol` (string)
*   `category` (string)
*   `chains` (array of strings)
*   `tvl` (number)
*   `chainTvls` (object with additional properties of type number)
*   `change_1d` (number)
*   `change_7d` (number)

### ProtocolDetails
*   `id` (string)
*   `name` (string)
*   `symbol` (string)
*   `category` (string)
*   `chains` (array of strings)
*   `currentChainTvls` (object with additional properties of type number)
*   `chainTvls` (object with additional properties of type object)
    *   `tvl` (array of objects)
        *   `date` (number)
        *   `totalLiquidityUSD` (number)
    *   `tokens` (array of objects)
        *   `date` (number)
        *   `tokens` (object with additional properties of type number)

### ChainTVL
*   `date` (number)
*   `tvl` (number)

### Chain
*   `gecko_id` (string, nullable)
*   `tvl` (number)
*   `tokenSymbol` (string, nullable)
*   `cmcId` (string, nullable)
*   `name` (string)
*   `chainId` (number, nullable)

### CoinPrice
*   (object with additional properties of type object)
    *   `decimals` (number)
    *   `price` (number)
    *   `symbol` (string)
    *   `timestamp` (number)

### CoinHistory
*   `coins` (object with additional properties of type object)
    *   `decimals` (number)
    *   `price` (number)
    *   `symbol` (string)
    *   `timestamp` (number)

### StablecoinData
*   `id` (string)
*   `name` (string)
*   `symbol` (string)
*   `pegType` (string)
*   `pegMechanism` (string)
*   `circulating` (object)
*   `chains` (array of strings)
*   `price` (number)

### YieldPool
*   `chain` (string)
*   `project` (string)
*   `symbol` (string)
*   `tvlUsd` (number)
*   `apy` (number)
*   `apyBase` (number)
*   `apyReward` (number)
*   `rewardTokens` (array of strings)
*   `pool` (string)
*   `predictions` (object)
    *   `predictedClass` (string)
    *   `predictedProbability` (number)
    *   `binnedConfidence` (number)

### BridgeVolume
*   `date` (string)
*   `depositUSD` (number)
*   `withdrawUSD` (number)
*   `netUSD` (number)

### FeeData
*   `total24h` (number)
*   `total7d` (number)
*   `total30d` (number)
*   `totalAllTime` (number)
*   `breakdown24h` (object with additional properties of type number)

### VolumeData
*   `totalVolume24h` (number)
*   `totalVolume7d` (number)
*   `chains` (object with additional properties of type object)
    *   `total24h` (number)
    *   `total7d` (number)
