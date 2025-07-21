"use strict";
// CoinGecko API TypeScript Client - FREE ENDPOINTS ONLY
// Documentation: https://www.coingecko.com/en/api/documentation
// 
// FREE PLAN LIMITATIONS:
// - Rate limit: 30 calls/minute
// - Monthly limit: 10,000 calls
// - Only includes endpoints available on the free Demo plan
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCoinGeckoClient = exports.CoinGeckoAPI = void 0;
var CoinGeckoAPI = /** @class */ (function () {
    function CoinGeckoAPI(config) {
        if (config === void 0) { config = {}; }
        this.baseUrl = config.baseUrl || 'https://api.coingecko.com/api/v3';
        this.timeout = config.timeout || 10000;
        this.headers = __assign({ 'Content-Type': 'application/json' }, config.headers);
    }
    CoinGeckoAPI.prototype.request = function (endpoint, params) {
        return __awaiter(this, void 0, void 0, function () {
            var url, controller, timeoutId, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = new URL("".concat(this.baseUrl).concat(endpoint));
                        if (params) {
                            Object.entries(params).forEach(function (_a) {
                                var key = _a[0], value = _a[1];
                                if (value !== undefined && value !== null) {
                                    url.searchParams.append(key, String(value));
                                }
                            });
                        }
                        controller = new AbortController();
                        timeoutId = setTimeout(function () { return controller.abort(); }, this.timeout);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch(url.toString(), {
                                method: 'GET',
                                headers: this.headers,
                                signal: controller.signal,
                            })];
                    case 2:
                        response = _a.sent();
                        clearTimeout(timeoutId);
                        if (!response.ok) {
                            throw new Error("CoinGecko API error: ".concat(response.status, " ").concat(response.statusText));
                        }
                        return [4 /*yield*/, response.json()];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_1 = _a.sent();
                        clearTimeout(timeoutId);
                        throw error_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // ===== PING =====
    /**
     * Check API server status
     */
    CoinGeckoAPI.prototype.ping = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request('/ping')];
            });
        });
    };
    // ===== SIMPLE PRICE =====
    /**
     * Get current price of coins
     */
    CoinGeckoAPI.prototype.getSimplePrice = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request('/simple/price', params)];
            });
        });
    };
    /**
     * Get list of supported vs currencies
     */
    CoinGeckoAPI.prototype.getSupportedVsCurrencies = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request('/simple/supported_vs_currencies')];
            });
        });
    };
    // ===== COINS =====
    /**
     * Get list of coins with market data
     */
    CoinGeckoAPI.prototype.getCoinsMarkets = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request('/coins/markets', params)];
            });
        });
    };
    /**
     * Get list of all supported coins
     */
    CoinGeckoAPI.prototype.getCoinsList = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request('/coins/list', params)];
            });
        });
    };
    /**
     * Get detailed information about a specific coin
     */
    CoinGeckoAPI.prototype.getCoinById = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id, queryParams;
            return __generator(this, function (_a) {
                id = params.id, queryParams = __rest(params, ["id"]);
                return [2 /*return*/, this.request("/coins/".concat(id), queryParams)];
            });
        });
    };
    /**
     * Get historical market data for a coin
     */
    CoinGeckoAPI.prototype.getCoinMarketChart = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id, queryParams;
            return __generator(this, function (_a) {
                id = params.id, queryParams = __rest(params, ["id"]);
                return [2 /*return*/, this.request("/coins/".concat(id, "/market_chart"), queryParams)];
            });
        });
    };
    /**
     * Get historical market data within a date range
     */
    CoinGeckoAPI.prototype.getCoinMarketChartRange = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id, queryParams;
            return __generator(this, function (_a) {
                id = params.id, queryParams = __rest(params, ["id"]);
                return [2 /*return*/, this.request("/coins/".concat(id, "/market_chart/range"), queryParams)];
            });
        });
    };
    // ===== SEARCH =====
    /**
     * Search for coins, exchanges, and categories
     */
    CoinGeckoAPI.prototype.search = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request('/search', { query: query })];
            });
        });
    };
    // ===== TRENDING =====
    /**
     * Get trending coins
     */
    CoinGeckoAPI.prototype.getTrendingCoins = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request('/search/trending')];
            });
        });
    };
    // ===== GLOBAL =====
    /**
     * Get global cryptocurrency data
     */
    CoinGeckoAPI.prototype.getGlobal = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request('/global')];
            });
        });
    };
    /**
     * Get BTC-to-Currency exchange rates
     */
    CoinGeckoAPI.prototype.getExchangeRates = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request('/exchange_rates')];
            });
        });
    };
    return CoinGeckoAPI;
}());
exports.CoinGeckoAPI = CoinGeckoAPI;
// Usage examples:
var createCoinGeckoClient = function (config) {
    return new CoinGeckoAPI(config);
};
exports.createCoinGeckoClient = createCoinGeckoClient;
// Example usage - ALL FREE ENDPOINTS:
/*
const client = createCoinGeckoClient();

// 1. Check API status
const status = await client.ping();
console.log(status); // { gecko_says: "(V3) To the Moon!" }

// 2. Get Bitcoin and Ethereum prices in USD
const prices = await client.getSimplePrice({
  ids: 'bitcoin,ethereum',
  vs_currencies: 'usd',
  include_24hr_change: true
});
console.log(prices); // { bitcoin: { usd: 43000 }, ethereum: { usd: 2500 } }

// 3. Get supported currencies
const currencies = await client.getSupportedVsCurrencies();
console.log(currencies); // ['usd', 'eur', 'jpy', ...]

// 4. Get top 10 coins by market cap
const topCoins = await client.getCoinsMarkets({
  vs_currency: 'usd',
  order: 'market_cap_desc',
  per_page: 10,
  page: 1
});

// 5. Get all coins list
const allCoins = await client.getCoinsList();

// 6. Get Bitcoin details
const bitcoin = await client.getCoinById({
  id: 'bitcoin',
  market_data: true
});

// 7. Get Bitcoin price history for last 30 days
const history = await client.getCoinMarketChart({
  id: 'bitcoin',
  vs_currency: 'usd',
  days: 30
});

// 8. Get Bitcoin price history within date range
const rangeHistory = await client.getCoinMarketChartRange({
  id: 'bitcoin',
  vs_currency: 'usd',
  from: 1609459200, // Jan 1, 2021
  to: 1640995200    // Dec 31, 2021
});

// 9. Search for coins
const searchResults = await client.search('bitcoin');

// 10. Get trending coins
const trending = await client.getTrendingCoins();

// 11. Get global crypto market data
const globalData = await client.getGlobal();

// 12. Get BTC exchange rates
const exchangeRates = await client.getExchangeRates();
*/ 
