'use client';

import { useEffect, useState } from 'react';
import { GeckoTerminalAPI, Pool } from '@/lib/api-clients/crypto/geckoterminal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils/utils';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function NewListingsPage() {
  const [newPools, setNewPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewPools = async () => {
      try {
        const api = new GeckoTerminalAPI();
        const response = await api.getNewPools(['base_token', 'quote_token', 'dex']);
        setNewPools(response.data);
      } catch (err) {
        setError('Failed to fetch new pools data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewPools();
  }, []);

  const formatCurrency = (value: string | number | undefined, precision = 2) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (num === undefined || num === null) return 'N/A';
    return `$${num.toLocaleString(undefined, { minimumFractionDigits: precision, maximumFractionDigits: precision })}`;
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  }


  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (loading || !newPools.length) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">New Token Listings</h1>
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
      <h1 className="text-2xl font-bold mb-4">New Token Listings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Recently Created Pools</CardTitle>
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
                  <TableHead className="text-right">24h Volume</TableHead>
                  <TableHead>Listed At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newPools.map((pool) => (
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
                    <TableCell className="text-right">
                      <Link href={`/degen/tokens/${pool.relationships.base_token.data.id.split('_')[1]}`} className="block w-full h-full py-2 px-4">
                        {formatCurrency(pool.attributes.volume_usd.h24)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/degen/tokens/${pool.relationships.base_token.data.id.split('_')[1]}`} className="block w-full h-full py-2 px-4">
                        {getTimeAgo(pool.attributes.pool_created_at)}
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
