'use client';

import { useEffect, useState } from 'react';
import { CoinGeckoAPI, CoinDetails } from '@/lib/api-clients/crypto/coinGecko';
import { BinanceAPI } from '@/lib/api-clients/crypto/binance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Globe, Twitter, ExternalLink, Calendar, DollarSign, BarChart3, Activity } from 'lucide-react';
import Image from 'next/image';

interface CoinDetailPageProps {
  params: { id: string };
}

interface BinanceKlineData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface DefiLlamaData {
  tvl?: number;
  protocol?: string;
  category?: string;
}

export default function CoinDetailPage({ params }: CoinDetailPageProps) {
  const { id } = params;
  const [coin, setCoin] = useState<CoinDetails | null>(null);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [binanceData, setBinanceData] = useState<BinanceKlineData[]>([]);
  const [defiLlamaData, setDefiLlamaData] = useState<DefiLlamaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'1' | '7' | '30' | '365'>('7');

  useEffect(() => {
    const fetchCoinDetails = async () => {
      try {
        const coinGecko = new CoinGeckoAPI();
        
        // Fetch coin details
        const coinData = await coinGecko.getCoinById({
          id: id,
          localization: false,
          tickers: true,
          market_data: true,
          community_data: true,
          developer_data: true,
          sparkline: true,
        });
        setCoin(coinData);

        // Fetch price history
        const historyData = await coinGecko.getCoinMarketChart({
          id: id,
          vs_currency: 'usd',
          days: timeRange,
          interval: timeRange === '1' ? 'hourly' : 'daily'
        });

        const formattedHistory = historyData.prices.map(([timestamp, price]: [number, number]) => ({
          timestamp,
          date: new Date(timestamp).toLocaleDateString(),
          price: price,
        }));
        setPriceHistory(formattedHistory);

        // Try to fetch Binance data if symbol exists
        if (coinData.symbol) {
          await fetchBinanceData(coinData.symbol.toUpperCase());
        }

        // Try to fetch DefiLlama data
        await fetchDefiLlamaData(coinData.name);

      } catch (err) {
        setError('Failed to fetch coin details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCoinDetails();
    }
  }, [id, timeRange]);

  const fetchBinanceData = async (symbol: string) => {
    try {
      setChartLoading(true);
      const binanceAPI = new BinanceAPI();
      const klineData = await binanceAPI.getKlines(`${symbol}USDT`, '1d', 30);
      
      const formattedBinanceData = klineData.map((kline: any) => ({
        timestamp: kline[0],
        open: parseFloat(kline[1]),
        high: parseFloat(kline[2]),
        low: parseFloat(kline[3]),
        close: parseFloat(kline[4]),
        volume: parseFloat(kline[5]),
      }));
      
      setBinanceData(formattedBinanceData);
    } catch (err) {
      console.log('Binance data not available for this symbol');
    } finally {
      setChartLoading(false);
    }
  };

  const fetchDefiLlamaData = async (name: string) => {
    try {
      // This would be a call to DefiLlama API
      // For demo purposes, we'll simulate some data
      const response = await fetch(`https://api.llama.fi/protocol/${name.toLowerCase()}`);
      if (response.ok) {
        const data = await response.json();
        setDefiLlamaData(data);
      }
    } catch (err) {
      console.log('DefiLlama data not available');
    }
  };

  const formatCurrency = (value: number | undefined) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: value < 0.01 ? 6 : 2,
      maximumFractionDigits: value < 0.01 ? 6 : 2,
    }).format(value);
  };

  const formatNumber = (value: number | undefined) => {
    if (!value) return 'N/A';
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toFixed(2);
  };

  const getPriceChangeColor = (change: number | undefined) => {
    if (!change) return 'text-muted-foreground';
    return change >= 0 ? 'text-green-500' : 'text-red-500';
  };

  const getPriceChangeIcon = (change: number | undefined) => {
    if (!change) return null;
    return change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Activity className="w-6 h-6 animate-spin" />
          <span>Loading coin details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!coin) {
    return <div className="p-4">Coin not found.</div>;
  }

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
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
                  <h1 className="text-3xl font-bold">{coin.name}</h1>
                  <Badge variant="secondary">{coin.symbol?.toUpperCase()}</Badge>
                  {coin.market_cap_rank && (
                    <Badge variant="outline">Rank #{coin.market_cap_rank}</Badge>
                  )}
                </div>
                <div className="flex items-center space-x-4 mt-2">
                  {coin.links?.homepage?.[0] && (
                    <a href={coin.links.homepage[0]} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm">
                        <Globe className="w-4 h-4 mr-1" />
                        Website
                      </Button>
                    </a>
                  )}
                  {coin.links?.twitter_screen_name && (
                    <a href={`https://twitter.com/${coin.links.twitter_screen_name}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm">
                        <Twitter className="w-4 h-4 mr-1" />
                        Twitter
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold">
                {formatCurrency(coin.market_data?.current_price?.usd)}
              </div>
              <div className={`flex items-center space-x-1 ${getPriceChangeColor(coin.market_data?.price_change_percentage_24h)}`}>
                {getPriceChangeIcon(coin.market_data?.price_change_percentage_24h)}
                <span>
                  {coin.market_data?.price_change_percentage_24h?.toFixed(2)}% (24h)
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Market Cap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(coin.market_data?.market_cap?.usd)}
            </div>
            <div className={`text-sm ${getPriceChangeColor(coin.market_data?.market_cap_change_percentage_24h)}`}>
              {coin.market_data?.market_cap_change_percentage_24h?.toFixed(2)}% (24h)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Trading Volume (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(coin.market_data?.total_volume?.usd)}
            </div>
            <div className="text-sm text-muted-foreground">
              Vol/MCap: {((coin.market_data?.total_volume?.usd || 0) / (coin.market_data?.market_cap?.usd || 1) * 100).toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Circulating Supply</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(coin.market_data?.circulating_supply)}
            </div>
            {coin.market_data?.max_supply && (
              <div className="mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>
                    {((coin.market_data.circulating_supply / coin.market_data.max_supply) * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={(coin.market_data.circulating_supply / coin.market_data.max_supply) * 100}
                  className="h-2"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">All-Time High</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(coin.market_data?.ath?.usd)}
            </div>
            <div className={`text-sm ${getPriceChangeColor(coin.market_data?.ath_change_percentage?.usd)}`}>
              {coin.market_data?.ath_change_percentage?.usd?.toFixed(2)}% from ATH
            </div>
            {coin.market_data?.ath_date?.usd && (
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(coin.market_data.ath_date.usd).toLocaleDateString()}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts and Data Tabs */}
      <Tabs defaultValue="price" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="price">Price Chart</TabsTrigger>
          <TabsTrigger value="binance">Binance Data</TabsTrigger>
          <TabsTrigger value="defi">DeFi Data</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="price" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Price History</CardTitle>
                <div className="flex space-x-2">
                  {(['1', '7', '30', '365'] as const).map((range) => (
                    <Button
                      key={range}
                      variant={timeRange === range ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTimeRange(range)}
                    >
                      {range === '1' ? '1D' : range === '7' ? '7D' : range === '30' ? '30D' : '1Y'}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: '400px' }}>
                <ResponsiveContainer>
                  <AreaChart data={priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(Number(value)), 'Price']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="binance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Binance OHLC Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chartLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Activity className="w-6 h-6 animate-spin" />
                  <span className="ml-2">Loading Binance data...</span>
                </div>
              ) : binanceData.length > 0 ? (
                <div style={{ width: '100%', height: '400px' }}>
                  <ResponsiveContainer>
                    <LineChart data={binanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()} />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [formatCurrency(Number(value)), name]}
                        labelFormatter={(timestamp) => new Date(Number(timestamp)).toLocaleDateString()}
                      />
                      <Line type="monotone" dataKey="close" stroke="#8884d8" strokeWidth={2} name="Close Price" />
                      <Line type="monotone" dataKey="high" stroke="#82ca9d" strokeWidth={1} name="High" />
                      <Line type="monotone" dataKey="low" stroke="#ffc658" strokeWidth={1} name="Low" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Binance data not available for this symbol
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="defi" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>DeFi Protocol Data</CardTitle>
            </CardHeader>
            <CardContent>
              {defiLlamaData ? (
                <div className="space-y-4">
                  {defiLlamaData.tvl && (
                    <div>
                      <h4 className="font-semibold">Total Value Locked (TVL)</h4>
                      <p className="text-2xl font-bold">{formatCurrency(defiLlamaData.tvl)}</p>
                    </div>
                  )}
                  {defiLlamaData.category && (
                    <div>
                      <h4 className="font-semibold">Category</h4>
                      <Badge>{defiLlamaData.category}</Badge>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  DeFi data not available for this token
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>About {coin.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: coin.description?.en?.substring(0, 1000) + (coin.description?.en && coin.description.en.length > 1000 ? '...' : '') || 'No description available.' 
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technical Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {coin.genesis_date && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Genesis Date:</span>
                    <span>{new Date(coin.genesis_date).toLocaleDateString()}</span>
                  </div>
                )}
                
                {coin.hashing_algorithm && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hashing Algorithm:</span>
                    <span>{coin.hashing_algorithm}</span>
                  </div>
                )}

                {coin.market_data?.max_supply && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Supply:</span>
                    <span>{formatNumber(coin.market_data.max_supply)}</span>
                  </div>
                )}

                {coin.market_data?.total_supply && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Supply:</span>
                    <span>{formatNumber(coin.market_data.total_supply)}</span>
                  </div>
                )}

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">7d Change:</span>
                    <div className={getPriceChangeColor(coin.market_data?.price_change_percentage_7d)}>
                      {coin.market_data?.price_change_percentage_7d?.toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">30d Change:</span>
                    <div className={getPriceChangeColor(coin.market_data?.price_change_percentage_30d)}>
                      {coin.market_data?.price_change_percentage_30d?.toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">1y Change:</span>
                    <div className={getPriceChangeColor(coin.market_data?.price_change_percentage_1y)}>
                      {coin.market_data?.price_change_percentage_1y?.toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ATL:</span>
                    <div>{formatCurrency(coin.market_data?.atl?.usd)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Community and Social Stats */}
          {(coin.community_data || coin.developer_data) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {coin.community_data && (
                <Card>
                  <CardHeader>
                    <CardTitle>Community Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {coin.community_data.twitter_followers && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Twitter Followers:</span>
                        <span>{coin.community_data.twitter_followers.toLocaleString()}</span>
                      </div>
                    )}
                    {coin.community_data.reddit_subscribers && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reddit Subscribers:</span>
                        <span>{coin.community_data.reddit_subscribers.toLocaleString()}</span>
                      </div>
                    )}
                    {coin.community_data.telegram_channel_user_count && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Telegram Users:</span>
                        <span>{coin.community_data.telegram_channel_user_count.toLocaleString()}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {coin.developer_data && (
                <Card>
                  <CardHeader>
                    <CardTitle>Developer Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {coin.developer_data.stars && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">GitHub Stars:</span>
                        <span>{coin.developer_data.stars.toLocaleString()}</span>
                      </div>
                    )}
                    {coin.developer_data.forks && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">GitHub Forks:</span>
                        <span>{coin.developer_data.forks.toLocaleString()}</span>
                      </div>
                    )}
                    {coin.developer_data.commit_count_4_weeks && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Commits (4w):</span>
                        <span>{coin.developer_data.commit_count_4_weeks}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}