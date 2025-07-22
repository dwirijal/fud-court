
'use client';

import { useEffect, useState, useMemo } from 'react';
import { CoinGeckoAPI } from '@/lib/api-clients/crypto/coinGecko';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/utils';

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

type SortKey = keyof TrendingCoinItem;

export default function TrendingCoinsPage() {
  const [trendingCoins, setTrendingCoins] = useState<TrendingCoinItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' }>({ key: 'score', direction: 'descending' });

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

  const sortedCoins = useMemo(() => {
    let sortableItems = trendingCoins ? [...trendingCoins] : [];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [trendingCoins, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: SortKey) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    }
    return sortConfig.direction === 'ascending' ? (
      <ArrowUpDown className="ml-2 h-4 w-4" />
    ) : (
      <ArrowUpDown className="ml-2 h-4 w-4" />
    );
  };

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
                  <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('market_cap_rank')}>
                      Rank {getSortIndicator('market_cap_rank')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('name')}>
                      Name {getSortIndicator('name')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('symbol')}>
                      Symbol {getSortIndicator('symbol')}
                    </Button>
                  </TableHead>
                   <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('score')}>
                      Score {getSortIndicator('score')}
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCoins.map((coin) => (
                  <TableRow key={coin.id}>
                    <TableCell>{coin.market_cap_rank}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {coin.thumb && <Image src={coin.thumb} alt={coin.name} width={20} height={20} className="rounded-full" />}
                        {coin.name}
                      </div>
                    </TableCell>
                    <TableCell className="uppercase">{coin.symbol}</TableCell>
                    <TableCell>{coin.score}</TableCell>
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
