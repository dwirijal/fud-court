'use client';

import { Suspense } from 'react';
import { PortfolioTracker } from '@/components/molecules/portfolio-tracker';
import { GasTracker } from '@/components/molecules/gas-tracker';
import { useRealTimePrices, useTopMovers, useTVLTracker, useWatchlist } from '@/hooks/use-crypto-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Star, StarOff } from 'lucide-react';

function PriceWidget() {
  const { data: prices, loading, error } = useRealTimePrices(['bitcoin', 'ethereum', 'solana']);

  if (loading) return <div className="animate-skeleton h-20 w-full rounded"></div>;
  if (error) return <div className="text-status-error">Error: {error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-Time Prices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {prices?.map((coin) => (
            <div key={coin.id} className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
              <div>
                <p className="font-medium capitalize">{coin.id}</p>
                <p className="text-sm text-text-secondary">${coin.current_price.toLocaleString()}</p>
              </div>
              <Badge variant={coin.price_change_percentage_24h >= 0 ? 'default' : 'destructive'}>
                {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TopMoversWidget() {
  const { data: movers, loading, error } = useTopMovers();

  if (loading) return <div className="animate-skeleton h-40 w-full rounded"></div>;
  if (error) return <div className="text-status-error">Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="text-market-up" size={20} />
            Top Gainers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {movers?.gainers.slice(0, 5).map((coin) => (
              <div key={coin.id} className="flex items-center justify-between text-sm">
                <span className="capitalize">{coin.id}</span>
                <Badge variant="default">+{coin.price_change_percentage_24h?.toFixed(2)}%</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="text-market-down" size={20} />
            Top Losers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {movers?.losers.slice(0, 5).map((coin) => (
              <div key={coin.id} className="flex items-center justify-between text-sm">
                <span className="capitalize">{coin.id}</span>
                <Badge variant="destructive">{coin.price_change_percentage_24h?.toFixed(2)}%</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TVLWidget() {
  const { data: protocols, loading, error } = useTVLTracker();

  if (loading) return <div className="animate-skeleton h-60 w-full rounded"></div>;
  if (error) return <div className="text-status-error">Error: {error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>DeFi TVL Tracker</CardTitle>
        <p className="text-text-secondary">Top protocols by Total Value Locked</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {protocols?.slice(0, 10).map((protocol, index) => (
            <div key={protocol.name} className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-accent-primary text-black rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium">{protocol.name}</p>
                  <p className="text-sm text-text-secondary">
                    ${(protocol.tvl / 1e9).toFixed(2)}B TVL
                  </p>
                </div>
              </div>
              <Badge variant={protocol.change24h >= 0 ? 'default' : 'destructive'}>
                {protocol.change24h >= 0 ? '+' : ''}{protocol.change24h.toFixed(2)}%
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function WatchlistWidget() {
  const { watchlist, addToWatchlist, removeFromWatchlist, prices } = useWatchlist();

  const toggleWatchlist = (coinId: string) => {
    if (watchlist.includes(coinId)) {
      removeFromWatchlist(coinId);
    } else {
      addToWatchlist(coinId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Watchlist</CardTitle>
        <p className="text-text-secondary">Your tracked cryptocurrencies</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {watchlist.length === 0 ? (
            <p className="text-text-secondary text-center py-4">
              No coins in watchlist. Add some popular coins:
            </p>
          ) : (
            prices.data?.map((coin) => (
              <div key={coin.id} className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
                <div>
                  <p className="font-medium capitalize">{coin.id}</p>
                  <p className="text-sm text-text-secondary">${coin.current_price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={coin.price_change_percentage_24h >= 0 ? 'default' : 'destructive'}>
                    {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleWatchlist(coin.id)}
                  >
                    <StarOff size={16} />
                  </Button>
                </div>
              </div>
            ))
          )}
          
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
            {['bitcoin', 'ethereum', 'solana'].map((coinId) => (
              <Button
                key={coinId}
                variant={watchlist.includes(coinId) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleWatchlist(coinId)}
                className="flex items-center gap-1"
              >
                {watchlist.includes(coinId) ? <StarOff size={12} /> : <Star size={12} />}
                <span className="capitalize">{coinId}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardDemo() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Crypto Dashboard Demo</h1>
        <p className="text-text-secondary">
          Showcasing client-side API features for better performance and reduced server load
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Suspense fallback={<div className="animate-skeleton h-40 w-full rounded"></div>}>
            <PortfolioTracker />
          </Suspense>
          
          <Suspense fallback={<div className="animate-skeleton h-60 w-full rounded"></div>}>
            <TVLWidget />
          </Suspense>
          
          <Suspense fallback={<div className="animate-skeleton h-40 w-full rounded"></div>}>
            <TopMoversWidget />
          </Suspense>
        </div>

        <div className="space-y-6">
          <Suspense fallback={<div className="animate-skeleton h-32 w-full rounded"></div>}>
            <PriceWidget />
          </Suspense>
          
          <Suspense fallback={<div className="animate-skeleton h-48 w-full rounded"></div>}>
            <GasTracker />
          </Suspense>
          
          <Suspense fallback={<div className="animate-skeleton h-40 w-full rounded"></div>}>
            <WatchlistWidget />
          </Suspense>
        </div>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Features Demonstrated</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Client-Side Benefits:</h4>
              <ul className="space-y-1 text-text-secondary">
                <li>• Reduced server load</li>
                <li>• Real-time updates</li>
                <li>• Per-user rate limiting</li>
                <li>• localStorage caching</li>
                <li>• Instant UI feedback</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">API Sources:</h4>
              <ul className="space-y-1 text-text-secondary">
                <li>• CoinGecko (Price data)</li>
                <li>• DeFiLlama (TVL & Gas)</li>
                <li>• Real-time polling</li>
                <li>• Automatic retries</li>
                <li>• Error handling</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
