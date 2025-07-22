'use client';

import { useEffect, useState } from 'react';
import { DexScreenerClient, DexScreenerPair } from '@/lib/api-clients/crypto/dexScreener';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils/utils';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

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

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (loading || !pairs.length) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Hot Trading Pairs</h1>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2 mb-4" />
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(10)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
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
                    <TableCell className="font-medium">
                      <Link href={`/degen/tokens/${pair.baseToken.address}`} className="block w-full h-full py-2 px-4">
                        {pair.baseToken.symbol}/{pair.quoteToken.symbol}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/degen/tokens/${pair.baseToken.address}`} className="block w-full h-full py-2 px-4">
                        {pair.chainId}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/degen/tokens/${pair.baseToken.address}`} className="block w-full h-full py-2 px-4">
                        {pair.dexId}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/degen/tokens/${pair.baseToken.address}`} className="block w-full h-full py-2 px-4">
                        ${parseFloat(pair.priceUsd || '0').toFixed(6)}
                      </Link>
                    </TableCell>
                    <TableCell className={cn(
                      "text-right",
                      pair.priceChange.h24 >= 0 ? 'text-green-500' : 'text-red-500'
                    )}>
                      <Link href={`/degen/tokens/${pair.baseToken.address}`} className="block w-full h-full py-2 px-4">
                        {pair.priceChange.h24?.toFixed(2)}%
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/degen/tokens/${pair.baseToken.address}`} className="block w-full h-full py-2 px-4">
                        ${pair.volume.h24?.toLocaleString()}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/degen/tokens/${pair.baseToken.address}`} className="block w-full h-full py-2 px-4">
                        ${pair.liquidity?.usd?.toLocaleString() || 'N/A'}
                      </Link>
                    </TableCell>
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