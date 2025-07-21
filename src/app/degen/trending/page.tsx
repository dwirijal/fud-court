'use client';

import { useEffect, useState } from 'react';
import { DexScreenerClient, DexScreenerPair } from '@/lib/api-clients/crypto/dexScreener';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils/utils';
import Link from 'next/link';

export default function DegenTrendingPage() {
  const [trendingPairs, setTrendingPairs] = useState<DexScreenerPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingPairs = async () => {
      try {
        const dexScreener = new DexScreenerClient();
        // DexScreener's getTrendingPairs uses search internally, so it might return many results.
        // We'll just display them as is for now.
        const response = await dexScreener.getTrendingPairs(); 
        setTrendingPairs(response.pairs || []);
      } catch (err) {
        setError('Failed to fetch trending DEX pairs data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingPairs();
  }, []);

  if (loading) {
    return <div className="p-4">Loading trending DEX pairs...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!trendingPairs.length) {
    return <div className="p-4">No trending DEX pairs data available.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Trending DEX Pairs</h1>
      <Card>
        <CardHeader>
          <CardTitle>Top Trending Pairs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pair</TableHead>
                  <TableHead>Chain</TableHead>
                  <TableHead>DEX</TableHead>
                  <TableHead className="text-right">Price (USD)</TableHead>
                  <TableHead className="text-right">24h Change (%)</TableHead>
                  <TableHead className="text-right">24h Volume</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trendingPairs.map((pair) => (
                  <TableRow key={pair.pairAddress}>
                    <TableCell className="font-medium">
                      <Link href={`/degen/tokens/${pair.baseToken.address}`} className="flex items-center gap-2">
                        {pair.baseToken.symbol}/{pair.quoteToken.symbol}
                      </Link>
                    </TableCell>
                    <TableCell>{pair.chainId}</TableCell>
                    <TableCell>{pair.dexId}</TableCell>
                    <TableCell className="text-right">${parseFloat(pair.priceUsd || '0').toFixed(6)}</TableCell>
                    <TableCell className={cn(
                      "text-right",
                      pair.priceChange.h24 >= 0 ? 'text-green-500' : 'text-red-500'
                    )}>
                      {pair.priceChange.h24?.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">${pair.volume.h24?.toLocaleString()}</TableCell>
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
