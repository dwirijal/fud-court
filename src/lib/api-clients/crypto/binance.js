"use strict";
/**
 * Binance TypeScript Client - FREE ENDPOINTS ONLY
 * Documentation: https://binance-docs.github.io/apidocs/spot/en/
 *
 * FREE PLAN LIMITATIONS:
 * - Rate limit: 1200 requests/minute per IP
 * - Weight limit: 6000 weight/minute per IP
 * - Only includes endpoints available on the free/public plan
 * - No private endpoints (account info, trading, etc.)
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinanceHelpers = exports.BinanceAPI = void 0;
// ============================================
// MAIN BINANCE API CLASS
// ============================================
var BinanceAPI = /** @class */ (function () {
    function BinanceAPI() {
        this.baseURL = 'https://api.binance.com/api/v3';
        this.baseURLV1 = 'https://api.binance.com/api/v1';
        // Rate limit weights for each endpoint
        this.rateLimits = {
            '/time': { weight: 1, description: 'Test connectivity to the Rest API and get the current server time' },
            '/exchangeInfo': { weight: 10, description: 'Current exchange trading rules and symbol information' },
            '/depth': { weight: 1, description: 'Get order book' }, // 1-5 based on limit
            '/trades': { weight: 1, description: 'Get recent trades list' },
            '/historicalTrades': { weight: 5, description: 'Get older market trades' },
            '/aggTrades': { weight: 1, description: 'Get compressed, aggregate trades' },
            '/klines': { weight: 1, description: 'Kline/candlestick bars' },
            '/avgPrice': { weight: 1, description: 'Current average price' },
            '/ticker/24hr': { weight: 1, description: '24hr ticker price change statistics' }, // 1-40 based on symbol count
            '/ticker/price': { weight: 1, description: 'Symbol price ticker' }, // 1-2 based on symbol count
            '/ticker/bookTicker': { weight: 1, description: 'Symbol order book ticker' }, // 1-2 based on symbol count
            '/ticker': { weight: 2, description: 'Rolling window price change statistics' }
        };
    }
    /**
     * Make HTTP request to Binance API
     * @private
     */
    BinanceAPI.prototype.makeRequest = function (endpoint) {
        return __awaiter(this, void 0, void 0, function () {
            var url, response, errorMessage, errorBody, _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        url = endpoint.startsWith('/v1/')
                            ? "".concat(this.baseURLV1).concat(endpoint.slice(4))
                            : "".concat(this.baseURL).concat(endpoint);
                        return [4 /*yield*/, fetch(url, {
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
                                }
                            })];
                    case 1:
                        response = _b.sent();
                        if (!!response.ok) return [3 /*break*/, 6];
                        errorMessage = "HTTP ".concat(response.status, ": ").concat(response.statusText);
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, response.json()];
                    case 3:
                        errorBody = _b.sent();
                        if (errorBody.msg) {
                            errorMessage = "".concat(errorMessage, " - ").concat(errorBody.msg);
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 5: throw new Error(errorMessage);
                    case 6: return [4 /*yield*/, response.json()];
                    case 7: return [2 /*return*/, _b.sent()];
                    case 8:
                        error_1 = _b.sent();
                        if (error_1 instanceof TypeError && error_1.message.includes('fetch')) {
                            throw new Error('Network error: Unable to connect to Binance API');
                        }
                        throw error_1;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get rate limit information for an endpoint
     */
    BinanceAPI.prototype.getRateLimitInfo = function (endpoint) {
        return this.rateLimits[endpoint] || null;
    };
    // ============================================
    // GENERAL ENDPOINTS
    // ============================================
    /**
     * Test connectivity to the Rest API and get the current server time
     * Weight: 1
     */
    BinanceAPI.prototype.ping = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest('/ping')];
            });
        });
    };
    /**
     * Test connectivity to the Rest API and get the current server time
     * Weight: 1
     */
    BinanceAPI.prototype.getServerTime = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest('/time')];
            });
        });
    };
    /**
     * Current exchange trading rules and symbol information
     * Weight: 10
     * @param symbol Optional symbol to get info for specific trading pair
     */
    BinanceAPI.prototype.getExchangeInfo = function (symbol) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint;
            return __generator(this, function (_a) {
                endpoint = symbol ? "/exchangeInfo?symbol=".concat(symbol) : '/exchangeInfo';
                return [2 /*return*/, this.makeRequest(endpoint)];
            });
        });
    };
    // ============================================
    // MARKET DATA ENDPOINTS  
    // ============================================
    /**
     * Get order book (market depth)
     * Weight: Adjusted based on the limit:
     * - 1 for limit <= 100
     * - 5 for limit <= 500
     * - 10 for limit <= 1000
     * - 50 for limit <= 5000
     *
     * @param symbol Trading pair (e.g., 'BTCUSDT')
     * @param limit Valid limits: 5, 10, 20, 50, 100, 500, 1000, 5000
     */
    BinanceAPI.prototype.getOrderBook = function (symbol_1) {
        return __awaiter(this, arguments, void 0, function (symbol, limit) {
            if (limit === void 0) { limit = 100; }
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest("/depth?symbol=".concat(symbol.toUpperCase(), "&limit=").concat(limit))];
            });
        });
    };
    /**
     * Get recent trades list (up to last 500)
     * Weight: 1
     * @param symbol Trading pair (e.g., 'BTCUSDT')
     * @param limit Default 500; max 1000
     */
    BinanceAPI.prototype.getRecentTrades = function (symbol_1) {
        return __awaiter(this, arguments, void 0, function (symbol, limit) {
            if (limit === void 0) { limit = 500; }
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest("/trades?symbol=".concat(symbol.toUpperCase(), "&limit=").concat(limit))];
            });
        });
    };
    /**
     * Get older market trades (requires API key in production)
     * Weight: 5
     * @param symbol Trading pair
     * @param limit Default 500; max 1000
     * @param fromId Trade id to fetch from INCLUSIVE
     */
    BinanceAPI.prototype.getHistoricalTrades = function (symbol_1) {
        return __awaiter(this, arguments, void 0, function (symbol, limit, fromId) {
            var endpoint;
            if (limit === void 0) { limit = 500; }
            return __generator(this, function (_a) {
                endpoint = "/historicalTrades?symbol=".concat(symbol.toUpperCase(), "&limit=").concat(limit);
                if (fromId)
                    endpoint += "&fromId=".concat(fromId);
                return [2 /*return*/, this.makeRequest(endpoint)];
            });
        });
    };
    /**
     * Get compressed, aggregate trades. Trades that fill at the time, from the same order, with the same price will have the quantity aggregated.
     * Weight: 1
     * @param symbol Trading pair
     * @param fromId ID to get aggregate trades from INCLUSIVE
     * @param startTime Timestamp in ms to get aggregate trades from INCLUSIVE
     * @param endTime Timestamp in ms to get aggregate trades until INCLUSIVE
     * @param limit Default 500; max 1000
     */
    BinanceAPI.prototype.getAggTrades = function (symbol_1, fromId_1, startTime_1, endTime_1) {
        return __awaiter(this, arguments, void 0, function (symbol, fromId, startTime, endTime, limit) {
            var endpoint;
            if (limit === void 0) { limit = 500; }
            return __generator(this, function (_a) {
                endpoint = "/aggTrades?symbol=".concat(symbol.toUpperCase(), "&limit=").concat(limit);
                if (fromId)
                    endpoint += "&fromId=".concat(fromId);
                if (startTime)
                    endpoint += "&startTime=".concat(startTime);
                if (endTime)
                    endpoint += "&endTime=".concat(endTime);
                return [2 /*return*/, this.makeRequest(endpoint)];
            });
        });
    };
    /**
     * Kline/candlestick bars for a symbol
     * Weight: 1
     * @param symbol Trading pair
     * @param interval Kline interval
     * @param limit Default 500; max 1000
     * @param startTime Start time in milliseconds
     * @param endTime End time in milliseconds
     */
    BinanceAPI.prototype.getKlines = function (symbol_1, interval_1) {
        return __awaiter(this, arguments, void 0, function (symbol, interval, limit, startTime, endTime) {
            var endpoint, rawData;
            if (limit === void 0) { limit = 500; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endpoint = "/klines?symbol=".concat(symbol.toUpperCase(), "&interval=").concat(interval, "&limit=").concat(limit);
                        if (startTime)
                            endpoint += "&startTime=".concat(startTime);
                        if (endTime)
                            endpoint += "&endTime=".concat(endTime);
                        return [4 /*yield*/, this.makeRequest(endpoint)];
                    case 1:
                        rawData = _a.sent();
                        return [2 /*return*/, rawData.map(function (kline) { return ({
                                openTime: kline[0],
                                open: kline[1],
                                high: kline[2],
                                low: kline[3],
                                close: kline[4],
                                volume: kline[5],
                                closeTime: kline[6],
                                quoteAssetVolume: kline[7],
                                numberOfTrades: kline[8],
                                takerBuyBaseAssetVolume: kline[9],
                                takerBuyQuoteAssetVolume: kline[10]
                            }); })];
                }
            });
        });
    };
    /**
     * Current average price for a symbol
     * Weight: 1
     * @param symbol Trading pair
     */
    BinanceAPI.prototype.getAvgPrice = function (symbol) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest("/avgPrice?symbol=".concat(symbol.toUpperCase()))];
            });
        });
    };
    // ============================================
    // TICKER ENDPOINTS
    // ============================================
    /**
     * 24hr ticker price change statistics
     * Weight: 1 for single symbol, 40 when symbol omitted
     * @param symbol Optional - if omitted, returns for all symbols
     */
    BinanceAPI.prototype.getTicker24hr = function (symbol) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint;
            return __generator(this, function (_a) {
                endpoint = symbol ? "/ticker/24hr?symbol=".concat(symbol.toUpperCase()) : '/ticker/24hr';
                return [2 /*return*/, this.makeRequest(endpoint)];
            });
        });
    };
    /**
     * Rolling window price change statistics
     * Weight: 2 for single symbol, 40 when symbol omitted
     * @param symbol Trading pair
     * @param windowSize Defaults to 1d if no parameter provided
     * Supported windowSize values:
     * - 1m,2m....59m for minutes
     * - 1h, 2h....23h for hours
     * - 1d...7d for days
     */
    BinanceAPI.prototype.getTickerPrice = function (symbol, windowSize) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, params;
            return __generator(this, function (_a) {
                endpoint = '/ticker';
                params = [];
                if (symbol)
                    params.push("symbol=".concat(symbol.toUpperCase()));
                if (windowSize)
                    params.push("windowSize=".concat(windowSize));
                if (params.length)
                    endpoint += '?' + params.join('&');
                return [2 /*return*/, this.makeRequest(endpoint)];
            });
        });
    };
    /**
     * Latest price for a symbol or symbols
     * Weight: 1 for single symbol, 2 when symbol omitted
     * @param symbol Optional - if omitted, returns for all symbols
     */
    BinanceAPI.prototype.getPrice = function (symbol) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint;
            return __generator(this, function (_a) {
                endpoint = symbol ? "/ticker/price?symbol=".concat(symbol.toUpperCase()) : '/ticker/price';
                return [2 /*return*/, this.makeRequest(endpoint)];
            });
        });
    };
    /**
     * Best price/qty on the order book for a symbol or symbols
     * Weight: 1 for single symbol, 2 when symbol omitted
     * @param symbol Optional - if omitted, returns for all symbols
     */
    BinanceAPI.prototype.getBookTicker = function (symbol) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint;
            return __generator(this, function (_a) {
                endpoint = symbol ? "/ticker/bookTicker?symbol=".concat(symbol.toUpperCase()) : '/ticker/bookTicker';
                return [2 /*return*/, this.makeRequest(endpoint)];
            });
        });
    };
    return BinanceAPI;
}());
exports.BinanceAPI = BinanceAPI;
// ============================================
// HELPER UTILITIES
// ============================================
exports.BinanceHelpers = {
    /**
     * All available kline intervals
     */
    intervals: [
        '1s', '1m', '3m', '5m', '15m', '30m',
        '1h', '2h', '4h', '6h', '8h', '12h',
        '1d', '3d', '1w', '1M'
    ],
    /**
     * Convert timestamp to Date object
     */
    timestampToDate: function (timestamp) { return new Date(timestamp); },
    /**
     * Get price change percentage as number
     */
    getPriceChangePercent: function (ticker) { return parseFloat(ticker.priceChangePercent); },
    /**
     * Get current price as number
     */
    getCurrentPrice: function (ticker) {
        return 'lastPrice' in ticker ? parseFloat(ticker.lastPrice) : parseFloat(ticker.price);
    },
    /**
     * Format price with specified decimal places
     */
    formatPrice: function (price, decimals) {
        if (decimals === void 0) { decimals = 8; }
        return parseFloat(price.toString()).toFixed(decimals);
    },
    /**
     * Format volume with appropriate units
     */
    formatVolume: function (volume) {
        var vol = parseFloat(volume.toString());
        if (vol >= 1e9)
            return (vol / 1e9).toFixed(2) + 'B';
        if (vol >= 1e6)
            return (vol / 1e6).toFixed(2) + 'M';
        if (vol >= 1e3)
            return (vol / 1e3).toFixed(2) + 'K';
        return vol.toFixed(2);
    },
    /**
     * Calculate spread from order book
     */
    calculateSpread: function (orderBook) {
        var bestBid = parseFloat(orderBook.bids[0][0]);
        var bestAsk = parseFloat(orderBook.asks[0][0]);
        var spread = bestAsk - bestBid;
        var spreadPercent = (spread / bestBid) * 100;
        return {
            spread: spread,
            spreadPercent: spreadPercent,
            bestBid: bestBid,
            bestAsk: bestAsk
        };
    },
    /**
     * Calculate volume weighted average price from order book
     */
    calculateVWAP: function (orderBook, depth) {
        if (depth === void 0) { depth = 5; }
        var calculateVWAPSide = function (orders) {
            var totalVolume = 0;
            var totalValue = 0;
            for (var i = 0; i < Math.min(depth, orders.length); i++) {
                var price = parseFloat(orders[i][0]);
                var volume = parseFloat(orders[i][1]);
                totalValue += price * volume;
                totalVolume += volume;
            }
            return totalVolume > 0 ? totalValue / totalVolume : 0;
        };
        return {
            bidVWAP: calculateVWAPSide(orderBook.bids),
            askVWAP: calculateVWAPSide(orderBook.asks)
        };
    },
    /**
     * Validate symbol format
     */
    validateSymbol: function (symbol) {
        return /^[A-Z0-9]+$/.test(symbol.toUpperCase()) && symbol.length >= 3;
    },
    /**
     * Get time periods for historical data
     */
    getTimePeriods: function () { return ({
        '1h': 60 * 60 * 1000,
        '1d': 24 * 60 * 60 * 1000,
        '1w': 7 * 24 * 60 * 60 * 1000,
        '1M': 30 * 24 * 60 * 60 * 1000
    }); },
    /**
     * Calculate RSI from kline data
     */
    calculateRSI: function (closes, period) {
        if (period === void 0) { period = 14; }
        var rsi = [];
        var gains = [];
        var losses = [];
        for (var i = 1; i < closes.length; i++) {
            var difference = closes[i] - closes[i - 1];
            gains.push(difference > 0 ? difference : 0);
            losses.push(difference < 0 ? Math.abs(difference) : 0);
        }
        var avgGain = gains.slice(0, period).reduce(function (sum, gain) { return sum + gain; }, 0) / period;
        var avgLoss = losses.slice(0, period).reduce(function (sum, loss) { return sum + loss; }, 0) / period;
        for (var i = period; i < closes.length; i++) {
            if (avgLoss === 0) {
                rsi.push(100);
            }
            else {
                var rs = avgGain / avgLoss;
                rsi.push(100 - (100 / (1 + rs)));
            }
            if (i < gains.length) {
                avgGain = (avgGain * (period - 1) + gains[i]) / period;
                avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
            }
        }
        return rsi;
    }
};
// ============================================
// EXAMPLE USAGE
// ============================================
/*
// Initialize client
const binance = new BinanceAPI();

// Example 1: Get server time
binance.getServerTime().then(time => {
  console.log('Server time:', new Date(time.serverTime));
});

// Example 2: Get Bitcoin price
binance.getPrice('BTCUSDT').then(data => {
  if (!Array.isArray(data)) {
    console.log('BTC Price: $' + BinanceHelpers.formatPrice(data.price, 2));
  }
});

// Example 3: Get 24hr ticker
binance.getTicker24hr('BTCUSDT').then(ticker => {
  if (!Array.isArray(ticker)) {
    console.log('BTC 24hr Change:', ticker.priceChangePercent + '%');
    console.log('Volume:', BinanceHelpers.formatVolume(ticker.volume));
  }
});

// Example 4: Get order book and calculate spread
binance.getOrderBook('BTCUSDT', 20).then(orderBook => {
  const spreadInfo = BinanceHelpers.calculateSpread(orderBook);
  console.log('Best bid:', spreadInfo.bestBid);
  console.log('Best ask:', spreadInfo.bestAsk);
  console.log('Spread:', BinanceHelpers.formatPrice(spreadInfo.spread, 2));
  console.log('Spread %:', spreadInfo.spreadPercent.toFixed(4) + '%');
});

// Example 5: Get historical kline data
binance.getKlines('BTCUSDT', '1h', 100).then(klines => {
  console.log('Got', klines.length, 'hourly candles');
  console.log('Latest close price:', klines[klines.length - 1].close);
  
  // Calculate RSI
  const closes = klines.map(k => parseFloat(k.close));
  const rsi = BinanceHelpers.calculateRSI(closes);
  console.log('Current RSI:', rsi[rsi.length - 1]?.toFixed(2));
});

// Example 6: Monitor multiple symbols
const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];
Promise.all(symbols.map(symbol => binance.getPrice(symbol)))
  .then(prices => {
    prices.forEach(price => {
      if (!Array.isArray(price)) {
        console.log(`${price.symbol}: $${BinanceHelpers.formatPrice(price.price, 2)}`);
      }
    });
  });

// Example 7: Get exchange info for specific symbol
binance.getExchangeInfo('BTCUSDT').then(info => {
  const btcSymbol = info.symbols[0];
  console.log('Base asset:', btcSymbol.baseAsset);
  console.log('Quote asset:', btcSymbol.quoteAsset);
  console.log('Status:', btcSymbol.status);
  console.log('Order types:', btcSymbol.orderTypes.join(', '));
});
*/ 
