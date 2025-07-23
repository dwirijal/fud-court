'use client';

import { useEffect, useState } from 'react';
import { GeckoTerminalAPI, Pool } from '@/lib/api-clients/crypto/geckoterminal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils/utils';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function DegenTrendingPage() {
  const [trendingPools, setTrendingPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingPools = async () => {
      try {
        const api = new GeckoTerminalAPI();
        const response = await api.getTrendingPools(['base_token', 'quote_token', 'dex']);
        setTrendingPools(response.data);
      } catch (err) {
        setError('Failed to fetch trending DEX pools data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingPools();
  }, []);

  const formatCurrency = (value: string | number | undefined, precision = 2) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (num === undefined || num === null) return 'N/A';
    return `$${num.toLocaleString(undefined, { minimumFractionDigits: precision, maximumFractionDigits: precision })}`;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (loading || !trendingPools.length) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Trending DEX Pools</h1>
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
      <h1 className="text-2xl font-bold mb-4">Trending DEX Pools</h1>
      <Card>
        <CardHeader>
          <CardTitle>Top Trending Pools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pair</TableHead>
                  <TableHead>Network</TableHead>
                  <TableHead>DEX</TableHead>
                  <TableHead className="text-right">Price (USD)</TableHead>
                  <TableHead className="text-right">24h Change (%)</TableHead>
                  <TableHead className="text-right">24h Volume</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trendingPools.map((pool) => (
                  <TableRow key={pool.id}>
                    <TableCell className="font-medium">
                      <Link href={`/degen/tokens/${pool.relationships.base_token.data.id.split('_')[1]}`} className="block w-full h-full py-2 px-4">
                        {pool.attributes.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/degen/tokens/${pool.relationships.base_token.data.id.split('_')[1]}`} className="block w-full h-full py-2 px-4">
                        {pool.id.split('_')[0]}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/degen/tokens/${pool.relationships.base_token.data.id.split('_')[1]}`} className="block w-full h-full py-2 px-4">
                        {pool.relationships.dex.data.id.split('_')[1]}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/degen/tokens/${pool.relationships.base_token.data.id.split('_')[1]}`} className="block w-full h-full py-2 px-4">
                        {formatCurrency(pool.attributes.base_token_price_usd, 6)}
                      </Link>
                    </TableCell>
                    <TableCell className={cn(
                      "text-right",
                      parseFloat(pool.attributes.price_change_percentage.h24) >= 0 ? 'text-green-500' : 'text-red-500'
                    )}>
                      <Link href={`/degen/tokens/${pool.relationships.base_token.data.id.split('_')[1]}`} className="block w-full h-full py-2 px-4">
                        {parseFloat(pool.attributes.price_change_percentage.h24).toFixed(2)}%
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/degen/tokens/${pool.relationships.base_token.data.id.split('_')[1]}`} className="block w-full h-full py-2 px-4">
                        {formatCurrency(pool.attributes.volume_usd.h24)}
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
