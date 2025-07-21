"use strict";
/**
 * DexScreener API TypeScript Client - FREE ENDPOINTS ONLY
 * Documentation: https://docs.dexscreener.com/api/reference
 *
 * FREE PLAN LIMITATIONS:
 * - Rate limit: 300 requests/minute per IP
 * - Weight limit: 300/minute per IP
 * - Only includes endpoints available on the free/public plan
 * - No private endpoints (account info, trading, etc.)
 *
 * Author: DexScreener API Client
 * Version: 1.0.0
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DexScreenerClient = void 0;
// ========================================
// RATE LIMITER CLASS
// ========================================
var RateLimiter = /** @class */ (function () {
    function RateLimiter(maxRequests, timeWindowMs) {
        if (maxRequests === void 0) { maxRequests = 300; }
        if (timeWindowMs === void 0) { timeWindowMs = 60000; }
        this.requests = [];
        this.maxRequests = maxRequests;
        this.timeWindow = timeWindowMs;
    }
    /**
     * Check if request can be made within rate limit
     * Implements sliding window rate limiting
     */
    RateLimiter.prototype.canMakeRequest = function () {
        var _this = this;
        var now = Date.now();
        // Remove old requests outside the time window
        this.requests = this.requests.filter(function (time) { return now - time < _this.timeWindow; });
        return this.requests.length < this.maxRequests;
    };
    /**
     * Record a request attempt
     */
    RateLimiter.prototype.recordRequest = function () {
        this.requests.push(Date.now());
    };
    /**
     * Get time until next request is allowed (in ms)
     */
    RateLimiter.prototype.getTimeUntilReset = function () {
        if (this.requests.length < this.maxRequests)
            return 0;
        var oldestRequest = Math.min.apply(Math, this.requests);
        return this.timeWindow - (Date.now() - oldestRequest);
    };
    /**
     * Get current rate limit status
     */
    RateLimiter.prototype.getStatus = function () {
        var _this = this;
        var now = Date.now();
        this.requests = this.requests.filter(function (time) { return now - time < _this.timeWindow; });
        return {
            remaining: this.maxRequests - this.requests.length,
            resetTime: this.requests.length > 0 ? Math.max.apply(Math, this.requests) + this.timeWindow : now
        };
    };
    return RateLimiter;
}());
// ========================================
// MAIN DEXSCREENER CLIENT
// ========================================
var DexScreenerClient = /** @class */ (function () {
    function DexScreenerClient(options) {
        if (options === void 0) { options = {}; }
        this.baseUrl = options.baseUrl || 'https://api.dexscreener.com';
        this.timeout = options.timeout || 30000;
        this.retryAttempts = options.retryAttempts || 3;
        this.retryDelay = options.retryDelay || 1000;
        this.rateLimiter = new RateLimiter(300, 60000); // 300 requests per minute
    }
    /**
     * Internal method to make HTTP requests with rate limiting and retry logic
     */
    DexScreenerClient.prototype.makeRequest = function (endpoint_1) {
        return __awaiter(this, arguments, void 0, function (endpoint, retryCount) {
            var waitTime, url, controller, timeoutId, response, resetTime, retryAfter, waitTime, data, error_1;
            if (retryCount === void 0) { retryCount = 0; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Check rate limit before making request
                        if (!this.rateLimiter.canMakeRequest()) {
                            waitTime = this.rateLimiter.getTimeUntilReset();
                            throw new Error("Rate limit exceeded. Wait ".concat(Math.ceil(waitTime / 1000), " seconds before next request."));
                        }
                        url = "".concat(this.baseUrl).concat(endpoint);
                        controller = new AbortController();
                        timeoutId = setTimeout(function () { return controller.abort(); }, this.timeout);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 10]);
                        // Record the request attempt
                        this.rateLimiter.recordRequest();
                        return [4 /*yield*/, fetch(url, {
                                method: 'GET',
                                headers: {
                                    'Accept': 'application/json',
                                    'User-Agent': 'DexScreener-TS-Client/1.0.0'
                                },
                                signal: controller.signal
                            })];
                    case 2:
                        response = _a.sent();
                        clearTimeout(timeoutId);
                        if (!(response.status === 429)) return [3 /*break*/, 5];
                        resetTime = response.headers.get('X-RateLimit-Reset');
                        retryAfter = response.headers.get('Retry-After');
                        waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 60000;
                        if (!(retryCount < this.retryAttempts)) return [3 /*break*/, 4];
                        console.warn("Rate limited. Retrying after ".concat(waitTime, "ms..."));
                        return [4 /*yield*/, this.sleep(waitTime)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, this.makeRequest(endpoint, retryCount + 1)];
                    case 4: throw new Error("Rate limit exceeded after ".concat(retryCount, " retries"));
                    case 5:
                        // Handle other HTTP errors
                        if (!response.ok) {
                            throw new Error("HTTP ".concat(response.status, ": ").concat(response.statusText));
                        }
                        return [4 /*yield*/, response.json()];
                    case 6:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 7:
                        error_1 = _a.sent();
                        clearTimeout(timeoutId);
                        if (!(retryCount < this.retryAttempts &&
                            (error_1 instanceof TypeError || error_1.name === 'AbortError'))) return [3 /*break*/, 9];
                        console.warn("Request failed, retrying... (".concat(retryCount + 1, "/").concat(this.retryAttempts, ")"));
                        return [4 /*yield*/, this.sleep(this.retryDelay * Math.pow(2, retryCount))];
                    case 8:
                        _a.sent(); // Exponential backoff
                        return [2 /*return*/, this.makeRequest(endpoint, retryCount + 1)];
                    case 9: throw error_1;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Utility method for delays
     */
    DexScreenerClient.prototype.sleep = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    // ========================================
    // PUBLIC API METHODS - FREE ENDPOINTS ONLY
    // ========================================
    /**
     * GET /latest/dex/tokens/{tokenAddresses}
     * Get pairs for one or more token addresses (comma-separated)
     *
     * @param tokenAddresses - Comma-separated token addresses
     * @returns Promise<DexScreenerTokenResponse>
     */
    DexScreenerClient.prototype.getTokens = function (tokenAddresses) {
        return __awaiter(this, void 0, void 0, function () {
            var addresses;
            return __generator(this, function (_a) {
                addresses = Array.isArray(tokenAddresses)
                    ? tokenAddresses.join(',')
                    : tokenAddresses;
                return [2 /*return*/, this.makeRequest("/latest/dex/tokens/".concat(addresses))];
            });
        });
    };
    /**
     * GET /latest/dex/pairs/{chainId}/{pairAddress}
     * Get pair information by chain ID and pair address
     *
     * @param chainId - Blockchain identifier (e.g., 'ethereum', 'bsc', 'polygon')
     * @param pairAddress - Pair contract address
     * @returns Promise<DexScreenerPairsResponse>
     */
    DexScreenerClient.prototype.getPair = function (chainId, pairAddress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest("/latest/dex/pairs/".concat(chainId, "/").concat(pairAddress))];
            });
        });
    };
    /**
     * GET /latest/dex/pairs/{pairAddresses}
     * Get pairs by addresses (comma-separated, up to 30 addresses)
     *
     * @param pairAddresses - Comma-separated pair addresses
     * @returns Promise<DexScreenerSearchResult>
     */
    DexScreenerClient.prototype.getPairs = function (chainId, pairAddresses) {
        return __awaiter(this, void 0, void 0, function () {
            var addresses;
            return __generator(this, function (_a) {
                addresses = Array.isArray(pairAddresses)
                    ? pairAddresses.join(',')
                    : pairAddresses;
                return [2 /*return*/, this.makeRequest("/latest/dex/pairs/".concat(chainId, "/").concat(addresses))];
            });
        });
    };
    /**
     * GET /latest/dex/search/?q={query}
     * Search for pairs matching query
     *
     * @param query - Search query (token symbol, name, or address)
     * @returns Promise<DexScreenerSearchResult>
     */
    DexScreenerClient.prototype.search = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var encodedQuery;
            return __generator(this, function (_a) {
                encodedQuery = encodeURIComponent(query);
                return [2 /*return*/, this.makeRequest("/latest/dex/search/?q=".concat(encodedQuery))];
            });
        });
    };
    /**
     * GET /orders/v1/{chainId}/{tokenAddress}
     * Get token profile information (if available)
     * Note: This might be limited or require special access
     *
     * @param chainId - Blockchain identifier
     * @param tokenAddress - Token contract address
     * @returns Promise<any> - Profile data structure may vary
     */
    DexScreenerClient.prototype.getTokenProfile = function (chainId, tokenAddress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest("/orders/v1/".concat(chainId, "/").concat(tokenAddress))];
            });
        });
    };
    // ========================================
    // UTILITY METHODS
    // ========================================
    /**
     * Get current rate limit status
     */
    DexScreenerClient.prototype.getRateLimitStatus = function () {
        return this.rateLimiter.getStatus();
    };
    /**
     * Get supported chain IDs
     * Note: This is a static list - check DexScreener docs for updates
     */
    DexScreenerClient.prototype.getSupportedChains = function () {
        return [
            'ethereum',
            'bsc',
            'polygon',
            'avalanche',
            'fantom',
            'cronos',
            'arbitrum',
            'optimism',
            'harmony',
            'moonbeam',
            'moonriver',
            'dogechain',
            'fusion',
            'kcc',
            'oec',
            'heco',
            'celo',
            'metis',
            'boba',
            'aurora',
            'astar',
            'kardia',
            'velas',
            'iotex',
            'thundercore',
            'fuse',
            'smartbch',
            'elastos',
            'hoo',
            'kava',
            'step',
            'godwoken',
            'milkomeda',
            'dfk',
            'klaytn',
            'rei',
            'canto',
            'aptos',
            'cardano',
            'osmosis',
            'terra',
            'injective',
            'sui'
        ];
    };
    /**
     * Helper method to get trending pairs by chain
     * Uses search with empty query to get popular results
     */
    DexScreenerClient.prototype.getTrendingPairs = function (chainId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, nativeTokens;
            return __generator(this, function (_a) {
                query = '';
                if (chainId) {
                    nativeTokens = {
                        'ethereum': 'ETH',
                        'bsc': 'BNB',
                        'polygon': 'MATIC',
                        'avalanche': 'AVAX',
                        'fantom': 'FTM',
                        'arbitrum': 'ARB',
                        'optimism': 'OP'
                    };
                    query = nativeTokens[chainId] || 'USD';
                }
                return [2 /*return*/, this.search(query)];
            });
        });
    };
    /**
     * Helper method to filter pairs by minimum liquidity
     */
    DexScreenerClient.prototype.filterByLiquidity = function (pairs, minLiquidityUsd) {
        return pairs.filter(function (pair) { var _a; return ((_a = pair.liquidity) === null || _a === void 0 ? void 0 : _a.usd) && pair.liquidity.usd >= minLiquidityUsd; });
    };
    /**
     * Helper method to filter pairs by minimum 24h volume
     */
    DexScreenerClient.prototype.filterByVolume = function (pairs, minVolumeUsd) {
        return pairs.filter(function (pair) { return pair.volume.h24 >= minVolumeUsd; });
    };
    /**
     * Helper method to sort pairs by 24h price change
     */
    DexScreenerClient.prototype.sortByPriceChange = function (pairs, descending) {
        if (descending === void 0) { descending = true; }
        return __spreadArray([], pairs, true).sort(function (a, b) {
            var changeA = a.priceChange.h24 || 0;
            var changeB = b.priceChange.h24 || 0;
            return descending ? changeB - changeA : changeA - changeB;
        });
    };
    /**
     * Helper method to format pair data for display
     */
    DexScreenerClient.prototype.formatPairInfo = function (pair) {
        var _a;
        var symbol = "".concat(pair.baseToken.symbol, "/").concat(pair.quoteToken.symbol);
        var price = pair.priceUsd ? "$".concat(parseFloat(pair.priceUsd).toFixed(6)) : 'N/A';
        var change24h = pair.priceChange.h24 ? "".concat(pair.priceChange.h24.toFixed(2), "%") : 'N/A';
        var volume24h = pair.volume.h24 ? "$".concat(pair.volume.h24.toLocaleString()) : 'N/A';
        var liquidity = ((_a = pair.liquidity) === null || _a === void 0 ? void 0 : _a.usd) ? "$".concat(pair.liquidity.usd.toLocaleString()) : 'N/A';
        return "".concat(symbol, " | Price: ").concat(price, " | 24h: ").concat(change24h, " | Vol: ").concat(volume24h, " | Liq: ").concat(liquidity);
    };
    return DexScreenerClient;
}());
exports.DexScreenerClient = DexScreenerClient;
// ========================================
// USAGE EXAMPLES & EXPORT
// ========================================
exports.default = DexScreenerClient;
/**
 * USAGE EXAMPLES:
 *
 * // Initialize client
 * const client = new DexScreenerClient({
 *   timeout: 30000,
 *   retryAttempts: 3
 * });
 *
 * // Search for tokens
 * try {
 *   const searchResults = await client.search('PEPE');
 *   console.log(`Found ${searchResults.pairs.length} pairs`);
 *
 *   // Filter and sort results
 *   const highVolumePairs = client.filterByVolume(searchResults.pairs, 100000);
 *   const sortedPairs = client.sortByPriceChange(highVolumePairs);
 *
 *   sortedPairs.slice(0, 5).forEach(pair => {
 *     console.log(client.formatPairInfo(pair));
 *   });
 * } catch (error) {
 *   console.error('Error:', error);
 * }
 *
 * // Get specific token pairs
 * try {
 *   const tokenData = await client.getTokens('0xa0b86a33e6f8b8b436c9b7fa9e3e0b4c6d7f3a89');
 *   console.log('Token pairs:', tokenData.pairs);
 * } catch (error) {
 *   console.error('Error fetching token:', error);
 * }
 *
 * // Check rate limit status
 * const rateLimitStatus = client.getRateLimitStatus();
 * console.log(`Rate limit - Remaining: ${rateLimitStatus.remaining}`);
 */ 
