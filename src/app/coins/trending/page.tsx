'use client';

import { useEffect, useState } from 'react';
import { CoinGeckoAPI } from '@/lib/api-clients/crypto/coinGecko';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';

interface TrendingCoinItem {
  id: string;
  coin_id: number;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  small: string;
  large: string;
  slug: string;
  price_btc: number;
  score: number;
}

export default function TrendingCoinsPage() {
  const [trendingCoins, setTrendingCoins] = useState<TrendingCoinItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingCoins = async () => {
      try {
        const coinGecko = new CoinGeckoAPI();
        const response = await coinGecko.getTrendingCoins();
        setTrendingCoins(response.coins.map(c => c.item));
      } catch (err) {
        setError('Failed to fetch trending coins.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingCoins();
  }, []);

  if (loading) {
    return <div className="p-4">Loading trending coins...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!trendingCoins || trendingCoins.length === 0) {
    return <div className="p-4">No trending coins data available.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Trending Cryptocurrencies</h1>
      <Card>
        <CardHeader>
          <CardTitle>Top 7 Trending Coins (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Price (BTC)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trendingCoins.map((coin) => (
                  <TableRow key={coin.id}>
                    <TableCell>{coin.market_cap_rank}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {coin.thumb && <Image src={coin.thumb} alt={coin.name} width={20} height={20} className="rounded-full" />}
                        {coin.name}
                      </div>
                    </TableCell>
                    <TableCell className="uppercase">{coin.symbol}</TableCell>
                    <TableCell>{coin.price_btc?.toFixed(8)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
