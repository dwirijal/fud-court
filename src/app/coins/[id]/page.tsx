'use client';

import { useEffect, useState, use } from 'react';
import { CoinGeckoAPI, CoinDetails } from '@/lib/api-clients/crypto/coinGecko';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton
import { Button } from '@/components/ui/button';
import { Globe, Twitter, MessageSquare, GitFork, Star, Users, Code, AlertTriangle, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface CoinDetailPageProps {
  params: { id: string };
}

export default function CoinDetailPage({ params }: CoinDetailPageProps) {
  const { id } = use(params); // Unwrap the params Promise
  const [coin, setCoin] = useState<CoinDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoinDetails = async () => {
      try {
        const coinGecko = new CoinGeckoAPI();
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
        setError('Failed to fetch coin details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCoinDetails();
    }
  }, [id]);

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || value === null) return 'N/A';
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  const formatNumber = (value: number | undefined) => {
    if (value === undefined || value === null) return 'N/A';
    return value.toLocaleString();
  };

  const getPriceChangeColor = (value: number | undefined) => {
    if (value === undefined || value === null) return 'text-muted-foreground';
    return value >= 0 ? 'text-green-500' : 'text-red-500';
  };

  const getPriceChangeIcon = (value: number | undefined) => {
    if (value === undefined || value === null) return null;
    return value >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="p-4">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48 mb-1" />
                <Skeleton className="h-4 w-40 mb-1" />
                <Skeleton className="h-4 w-44" />
              </div>
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
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
    <div className="p-4">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center space-x-4">
          {coin.image?.large && (
            <Image src={coin.image.large} alt={coin.name} width={64} height={64} className="rounded-full" />
          )}
          <div>
            <CardTitle className="text-3xl font-bold">{coin.name} ({coin.symbol.toUpperCase()})</CardTitle>
            {coin.market_cap_rank && (
              <p className="text-muted-foreground">Rank #{coin.market_cap_rank}</p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Market Data</h3>
              <p>Current Price: {formatCurrency(coin.market_data?.current_price?.usd)}</p>
              <p>Market Cap: {formatCurrency(coin.market_data?.market_cap?.usd)}</p>
              <p>Total Volume (24h): {formatCurrency(coin.market_data?.total_volume?.usd)}</p>
              <div className="flex items-center space-x-1">
                {getPriceChangeIcon(coin.market_data?.price_change_percentage_24h)}
                <span className={getPriceChangeColor(coin.market_data?.price_change_percentage_24h)}>
                  {coin.market_data?.price_change_percentage_24h?.toFixed(2)}% (24h)
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Description</h3>
              <div
                dangerouslySetInnerHTML={{ __html: coin.description?.en || 'No description available.' }}
                className="prose dark:prose-invert max-w-none"
              />
            </div>
          </div>
          <Separator className="my-4" />

          {/* Supply and ATH/ATL */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Circulating Supply</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(coin.market_data?.circulating_supply)}
                </div>
                {coin.market_data?.max_supply && (
                  <div className="mt-2">
                    <span className="text-muted-foreground">Max Supply:</span> {formatNumber(coin.market_data.max_supply)}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">All-Time High (ATH)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(coin.market_data?.ath?.usd)}
                </div>
                <div className={`text-sm ${getPriceChangeColor(coin.market_data?.ath_change_percentage?.usd)}`}>
                  {getPriceChangeIcon(coin.market_data?.ath_change_percentage?.usd)}
                  {coin.market_data?.ath_change_percentage?.usd?.toFixed(2)}% from ATH
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {coin.market_data?.ath_date?.usd ? new Date(coin.market_data.ath_date.usd).toLocaleDateString() : 'N/A'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">All-Time Low (ATL)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(coin.market_data?.atl?.usd)}
                </div>
                <div className={`text-sm ${getPriceChangeColor(coin.market_data?.atl_change_percentage?.usd)}`}>
                  {getPriceChangeIcon(coin.market_data?.atl_change_percentage?.usd)}
                  {coin.market_data?.atl_change_percentage?.usd?.toFixed(2)}% from ATL
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {coin.market_data?.atl_date?.usd ? new Date(coin.market_data.atl_date.usd).toLocaleDateString() : 'N/A'}
                </p>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-4" />

          {/* General Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">General Information</CardTitle>
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
              {coin.links?.homepage?.[0] && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Website:</span>
                  <a href={coin.links.homepage[0]} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm">
                      <Globe className="w-4 h-4 mr-1" />
                      Homepage
                    </Button>
                  </a>
                </div>
              )}
              {coin.links?.twitter_screen_name && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Twitter:</span>
                  <a href={`https://twitter.com/${coin.links.twitter_screen_name}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm">
                      <Twitter className="w-4 h-4 mr-1" />
                      @{coin.links.twitter_screen_name}
                    </Button>
                  </a>
                </div>
              )}
              {coin.links?.telegram_channel_identifier && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Telegram:</span>
                  <a href={`https://t.me/${coin.links.telegram_channel_identifier}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Telegram
                    </Button>
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Community and Social Stats */}
          {(coin.community_data || coin.developer_data) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {coin.community_data && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Community Data</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Twitter Followers:</span>
                      <span>{formatNumber(coin.community_data.twitter_followers)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reddit Subscribers:</span>
                      <span>{formatNumber(coin.community_data.reddit_subscribers)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Facebook Likes:</span>
                      <span>{formatNumber(coin.community_data.facebook_likes)}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {coin.developer_data && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Developer Data</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Forks:</span>
                      <span>{formatNumber(coin.developer_data.forks)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stars:</span>
                      <span>{formatNumber(coin.developer_data.stars)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Issues:</span>
                      <span>{formatNumber(coin.developer_data.total_issues)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pull Requests Merged:</span>
                      <span>{formatNumber(coin.developer_data.pull_requests_merged)}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
