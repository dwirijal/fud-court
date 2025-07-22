'use client';

import { useEffect, useState, use } from 'react';
import { CoinGeckoAPI, CoinDetails } from '@/lib/api-clients/crypto/coinGecko';
import { BinanceAPI } from '@/lib/api-clients/crypto/binance';
import { DeFiLlamaAPI } from '@/lib/api-clients/crypto/defillama';
import { DexScreenerAPI } from '@/lib/api-clients/crypto/dexscreener';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Globe, 
  Twitter, 
  MessageSquare, 
  Star, 
  StarOff,
  TrendingUp, 
  TrendingDown,
  DollarSign,
  BarChart3,
  Activity,
  Clock,
  ExternalLink,
  Heart,
  AlertCircle,
  Info,
  Users,
  Code,
  Zap
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CoinDetailPageProps {
  params: { id: string };
}

interface BinanceTicker {
  symbol: string;
  price: string;
  priceChangePercent: string;
  volume: string;
  baseAsset: string;
  quoteAsset: string;
}

interface DeFiLlamaProtocol {
  tvl: number;
  chains: string[];
  category: string;
}

interface DexScreenerPair {
  chainId: string;
  dexId: string;
  pairAddress: string;
  baseToken: {
    symbol: string;
    name: string;
  };
  quoteToken: {
    symbol: string;
    name: string;
  };
  priceUsd: string;
  volume: {
    h24: number;
  };
  priceChange: {
    h24: number;
  };
}

interface BookmarkData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  currentPrice: number;
  addedAt: string;
}

export default function CoinDetailPage({ params }: CoinDetailPageProps) {
  const { id } = use(params);
  
  // Main data states
  const [coin, setCoin] = useState<CoinDetails | null>(null);
  const [binancePairs, setBinancePairs] = useState<BinanceTicker[]>([]);
  const [defiData, setDefiData] = useState<DeFiLlamaProtocol | null>(null);
  const [dexPairs, setDexPairs] = useState<DexScreenerPair[]>([]);
  
  // Loading states
  const [loadingStates, setLoadingStates] = useState({
    coingecko: true,
    binance: true,
    defillama: true,
    dexscreener: true,
  });
  
  // UI states
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Initialize APIs
  const coinGecko = new CoinGeckoAPI();
  const binanceAPI = new BinanceAPI();
  const defiLlama = new DeFiLlamaAPI();
  const dexScreener = new DexScreenerAPI();

  // Utility functions
  const formatCurrency = (value: number | undefined | null) => {
    if (value === undefined || value === null) return 'N/A';
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  const formatNumber = (value: number | undefined | null) => {
    if (value === undefined || value === null) return 'N/A';
    return value.toLocaleString();
  };

  const formatPercentage = (value: number | undefined | null) => {
    if (value === undefined || value === null) return 'N/A';
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getPriceChangeColor = (value: number | undefined | null) => {
    if (value === undefined || value === null) return 'text-muted-foreground';
    return value >= 0 ? 'text-green-500' : 'text-red-500';
  };

  const getPriceChangeIcon = (value: number | undefined | null) => {
    if (value === undefined || value === null) return null;
    return value >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  // Bookmark functions
  const checkBookmarkStatus = () => {
    const bookmarks = JSON.parse(localStorage.getItem('coin-bookmarks') || '[]');
    setIsBookmarked(bookmarks.some((bookmark: BookmarkData) => bookmark.id === id));
  };

  const toggleBookmark = () => {
    if (!coin) return;
    
    const bookmarks: BookmarkData[] = JSON.parse(localStorage.getItem('coin-bookmarks') || '[]');
    
    if (isBookmarked) {
      const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
      localStorage.setItem('coin-bookmarks', JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
    } else {
      const newBookmark: BookmarkData = {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image?.small || '',
        currentPrice: coin.market_data?.current_price?.usd || 0,
        addedAt: new Date().toISOString(),
      };
      bookmarks.push(newBookmark);
      localStorage.setItem('coin-bookmarks', JSON.stringify(bookmarks));
      setIsBookmarked(true);
    }
  };

  // Data fetching functions
  const fetchCoinGeckoData = async () => {
    try {
      const data = await coinGecko.getCoinById({
        id: id,
        localization: false,
        tickers: false,
        market_data: true,
        community_data: true,
        developer_data: true,
        sparkline: false,
      });
      setCoin(data);
    } catch (err) {
      console.error('CoinGecko fetch error:', err);
      setError('Failed to fetch coin details from CoinGecko');
    } finally {
      setLoadingStates(prev => ({ ...prev, coingecko: false }));
    }
  };

  const fetchBinanceData = async () => {
    try {
      if (coin?.symbol) {
        const tickers = await binanceAPI.getTopTradingPairs(coin.symbol.toUpperCase());
        setBinancePairs(tickers.slice(0, 5)); // Top 5 pairs
      }
    } catch (err) {
      console.error('Binance fetch error:', err);
    } finally {
      setLoadingStates(prev => ({ ...prev, binance: false }));
    }
  };

  const fetchDeFiLlamaData = async () => {
    try {
      if (coin?.name) {
        const protocol = await defiLlama.getProtocol(coin.name);
        setDefiData(protocol);
      }
    } catch (err) {
      console.error('DeFiLlama fetch error:', err);
    } finally {
      setLoadingStates(prev => ({ ...prev, defillama: false }));
    }
  };

  const fetchDexScreenerData = async () => {
    try {
      if (coin?.symbol) {
        const pairs = await dexScreener.searchPairs(coin.symbol);
        setDexPairs(pairs.slice(0, 3)); // Top 3 DEX pairs
      }
    } catch (err) {
      console.error('DexScreener fetch error:', err);
    } finally {
      setLoadingStates(prev => ({ ...prev, dexscreener: false }));
    }
  };

  // Effects
  useEffect(() => {
    if (id) {
      fetchCoinGeckoData();
    }
  }, [id]);

  useEffect(() => {
    if (coin) {
      checkBookmarkStatus();
      fetchBinanceData();
      fetchDeFiLlamaData();
      fetchDexScreenerData();
    }
  }, [coin]);

  // Loading component
  if (loadingStates.coingecko) {
    return (
      <div className="p-4 max-w-7xl mx-auto">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-10 w-24" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-8 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Skeleton className="h-96 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !coin) {
    return (
      <div className="p-4 max-w-7xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="p-4 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Coin not found</h2>
          <p className="text-muted-foreground">The requested cryptocurrency could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            {coin.image?.large && (
              <Image 
                src={coin.image.large} 
                alt={coin.name} 
                width={64} 
                height={64} 
                className="rounded-full"
              />
            )}
            <div>
              <div className="flex items-center space-x-2">
                <CardTitle className="text-3xl font-bold">
                  {coin.name} ({coin.symbol.toUpperCase()})
                </CardTitle>
                {coin.market_cap_rank && (
                  <Badge variant="secondary">#{coin.market_cap_rank}</Badge>
                )}
              </div>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-2xl font-bold">
                  {formatCurrency(coin.market_data?.current_price?.usd)}
                </span>
                <div className={`flex items-center space-x-1 ${getPriceChangeColor(coin.market_data?.price_change_percentage_24h)}`}>
                  {getPriceChangeIcon(coin.market_data?.price_change_percentage_24h)}
                  <span className="font-semibold">
                    {formatPercentage(coin.market_data?.price_change_percentage_24h)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant={isBookmarked ? "default" : "outline"}
              size="sm"
              onClick={toggleBookmark}
            >
              {isBookmarked ? <Star className="h-4 w-4 mr-1 fill-current" /> : <StarOff className="h-4 w-4 mr-1" />}
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Market Cap</p>
                <p className="text-xl font-bold">
                  {formatCurrency(coin.market_data?.market_cap?.usd)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">24h Volume</p>
                <p className="text-xl font-bold">
                  {formatCurrency(coin.market_data?.total_volume?.usd)}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Circulating Supply</p>
                <p className="text-xl font-bold">
                  {formatNumber(coin.market_data?.circulating_supply)} {coin.symbol.toUpperCase()}
                </p>
                {coin.market_data?.max_supply && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Progress</span>
                      <span>
                        {((coin.market_data.circulating_supply / coin.market_data.max_supply) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={(coin.market_data.circulating_supply / coin.market_data.max_supply) * 100} 
                      className="h-1"
                    />
                  </div>
                )}
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">All-Time High</p>
                <p className="text-xl font-bold">
                  {formatCurrency(coin.market_data?.ath?.usd)}
                </p>
                <p className={`text-sm ${getPriceChangeColor(coin.market_data?.ath_change_percentage?.usd)}`}>
                  {formatPercentage(coin.market_data?.ath_change_percentage?.usd)} from ATH
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="chart">Chart</TabsTrigger>
          <TabsTrigger value="markets">Markets</TabsTrigger>
          <TabsTrigger value="defi">DeFi</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About {coin.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  dangerouslySetInnerHTML={{ 
                    __html: coin.description?.en?.slice(0, 500) + '...' || 'No description available.' 
                  }}
                  className="prose dark:prose-invert max-w-none text-sm"
                />
              </CardContent>
            </Card>

            {/* Key Information */}
            <Card>
              <CardHeader>
                <CardTitle>Key Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {coin.genesis_date && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Genesis Date:
                    </span>
                    <span>{new Date(coin.genesis_date).toLocaleDateString()}</span>
                  </div>
                )}
                {coin.hashing_algorithm && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center">
                      <Code className="h-4 w-4 mr-2" />
                      Algorithm:
                    </span>
                    <span>{coin.hashing_algorithm}</span>
                  </div>
                )}
                {coin.market_data?.max_supply && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Supply:</span>
                    <span>{formatNumber(coin.market_data.max_supply)} {coin.symbol.toUpperCase()}</span>
                  </div>
                )}
                <Separator />
                <div className="flex flex-wrap gap-2">
                  {coin.links?.homepage?.[0] && (
                    <a href={coin.links.homepage[0]} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <Globe className="w-4 h-4 mr-1" />
                        Website
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </a>
                  )}
                  {coin.links?.twitter_screen_name && (
                    <a href={`https://twitter.com/${coin.links.twitter_screen_name}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <Twitter className="w-4 h-4 mr-1" />
                        Twitter
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </a>
                  )}
                  {coin.links?.telegram_channel_identifier && (
                    <a href={`https://t.me/${coin.links.telegram_channel_identifier}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Telegram
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Price Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Price Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">24 Hours</p>
                  <p className={`text-lg font-bold ${getPriceChangeColor(coin.market_data?.price_change_percentage_24h)}`}>
                    {formatPercentage(coin.market_data?.price_change_percentage_24h)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">7 Days</p>
                  <p className={`text-lg font-bold ${getPriceChangeColor(coin.market_data?.price_change_percentage_7d)}`}>
                    {formatPercentage(coin.market_data?.price_change_percentage_7d)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">30 Days</p>
                  <p className={`text-lg font-bold ${getPriceChangeColor(coin.market_data?.price_change_percentage_30d)}`}>
                    {formatPercentage(coin.market_data?.price_change_percentage_30d)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle>Price Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-96">
                <iframe
                  src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview&symbol=${coin.symbol.toUpperCase()}USD&interval=D&hidesidetoolbar=1&hidetoptoolbar=1&symboledit=1&saveimage=1&toolbarbg=F1F3F6&studies=[]&hideideas=1&theme=light&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_source=localhost&utm_medium=widget_new&utm_campaign=chart&utm_term=${coin.symbol.toUpperCase()}USD`}
                  className="w-full h-full border-0"
                  allowTransparency={true}
                  scrolling="no"
                  allowFullScreen={true}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="markets" className="space-y-6">
          {/* Binance Trading Pairs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Top Trading Pairs (Binance)</CardTitle>
              {loadingStates.binance && <Skeleton className="h-4 w-16" />}
            </CardHeader>
            <CardContent>
              {binancePairs.length > 0 ? (
                <div className="space-y-3">
                  {binancePairs.map((pair, index) => (
                    <div key={pair.symbol} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{index + 1}</Badge>
                        <div>
                          <p className="font-semibold">{pair.baseAsset}/{pair.quoteAsset}</p>
                          <p className="text-sm text-muted-foreground">Volume: {formatCurrency(Number(pair.volume))}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${Number(pair.price).toFixed(4)}</p>
                        <p className={`text-sm ${getPriceChangeColor(Number(pair.priceChangePercent))}`}>
                          {formatPercentage(Number(pair.priceChangePercent))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !loadingStates.binance && (
                  <p className="text-muted-foreground text-center py-4">
                    No trading pairs found on Binance
                  </p>
                )
              )}
            </CardContent>
          </Card>

          {/* DEX Pairs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>DEX Trading Pairs</CardTitle>
              {loadingStates.dexscreener && <Skeleton className="h-4 w-16" />}
            </CardHeader>
            <CardContent>
              {dexPairs.length > 0 ? (
                <div className="space-y-3">
                  {dexPairs.map((pair, index) => (
                    <div key={pair.pairAddress} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{pair.dexId}</Badge>
                        <div>
                          <p className="font-semibold">{pair.baseToken.symbol}/{pair.quoteToken.symbol}</p>
                          <p className="text-sm text-muted-foreground">{pair.chainId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${Number(pair.priceUsd).toFixed(6)}</p>
                        <p className={`text-sm ${getPriceChangeColor(pair.priceChange.h24)}`}>
                          {formatPercentage(pair.priceChange.h24)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !loadingStates.dexscreener && (
                  <p className="text-muted-foreground text-center py-4">
                    No DEX pairs found
                  </p>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="defi">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>DeFi Information</CardTitle>
              {loadingStates.defillama && <Skeleton className="h-4 w-16" />}
            </CardHeader>
            <CardContent>
              {defiData ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Value Locked (TVL)</p>
                      <p className="text-2xl font-bold">{formatCurrency(defiData.tvl)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <Badge variant="secondary">{defiData.category}</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Supported Chains</p>
                    <div className="flex flex-wrap gap-2">
                      {defiData.chains.map((chain) => (
                        <Badge key={chain} variant="outline">{chain}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                !loadingStates.defillama && (
                  <div className="text-center py-8">
                    <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No DeFi protocol data available</p>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          {/* Community Data */}
          {coin.community_data && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-500">
                      {formatNumber(coin.community_data.twitter_followers)}
                    </p>
                    <p className="text-sm text-muted-foreground">Twitter Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-500">
                      {formatNumber(coin.community_data.reddit_subscribers)}
                    </p>
                    <p className="text-sm text-muted-foreground">Reddit Subscribers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {formatNumber(coin.community_data.facebook_likes)}
                    </p>
                    <p className="text-sm text-muted-foreground">Facebook Likes</p