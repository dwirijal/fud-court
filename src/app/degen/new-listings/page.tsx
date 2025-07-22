'use client';

import { useEffect, useState } from 'react';
import { DexScreenerClient, DexScreenerPair } from '@/lib/api-clients/crypto/dexScreener';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils/utils';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

export default function NewListingsPage() {
  const [newPairs, setNewPairs] = useState<DexScreenerPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewListings = async () => {
      try {
        const dexScreener = new DexScreenerClient();
        // Search for a common token (e.g., USDT) to get a broad range of pairs
        // Then filter and sort by creation time to simulate new listings.
        const searchResults = await dexScreener.search('USDT'); 
        
        const sortedPairs = (searchResults.pairs || [])
          .filter(pair => pair.pairCreatedAt) // Ensure pairCreatedAt exists
          .sort((a, b) => (b.pairCreatedAt || 0) - (a.pairCreatedAt || 0)); // Sort descending

        setNewPairs(sortedPairs.slice(0, 50)); // Take top 50 newest pairs
      } catch (err) {
        setError('Failed to fetch new listings data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewListings();
  }, []);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (loading || !newPairs.length) {
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
          <CardTitle>Recently Listed Pairs (Simulated)</CardTitle>
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
                  <TableHead className="text-right">24h Volume</TableHead>
                  <TableHead>Listed At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newPairs.map((pair) => (
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
                    <TableCell className="text-right">
                      <Link href={`/degen/tokens/${pair.baseToken.address}`} className="block w-full h-full py-2 px-4">
                        ${pair.volume.h24?.toLocaleString()}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/degen/tokens/${pair.baseToken.address}`} className="block w-full h-full py-2 px-4">
                        {pair.pairCreatedAt ? new Date(pair.pairCreatedAt).toLocaleString() : 'N/A'}
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