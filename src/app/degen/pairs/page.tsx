'use client';

import { useEffect, useState } from 'react';
import { DexScreenerClient, DexScreenerPair } from '@/lib/api-clients/crypto/dexScreener';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils/utils';

export default function DegenPairsPage() {
  const [pairs, setPairs] = useState<DexScreenerPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPairs = async () => {
      try {
        const dexScreener = new DexScreenerClient();
        // Using search with a common query like 'USDT' to get popular pairs
        const searchResults = await dexScreener.search('USDT'); 
        setPairs(searchResults.pairs || []);
      } catch (err) {
        setError('Failed to fetch DEX pairs data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPairs();
  }, []);

  if (loading) {
    return <div className="p-4">Loading DEX pairs...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!pairs.length) {
    return <div className="p-4">No DEX pairs data available.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Hot Trading Pairs</h1>
      <Card>
        <CardHeader>
          <CardTitle>Popular Pairs (via USDT search)</CardTitle>
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
                  <TableHead className="text-right">Liquidity (USD)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pairs.map((pair) => (
                  <TableRow key={pair.pairAddress}>
                    <TableCell className="font-medium">{pair.baseToken.symbol}/{pair.quoteToken.symbol}</TableCell>
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
                    <TableCell className="text-right">${pair.liquidity?.usd?.toLocaleString() || 'N/A'}</TableCell>
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
