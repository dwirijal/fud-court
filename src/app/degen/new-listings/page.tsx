'use client';

import { useEffect, useState } from 'react';
import { DexScreenerClient, DexScreenerPair } from '@/lib/api-clients/crypto/dexScreener';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils/utils';
import Link from 'next/link';

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

  if (loading) {
    return <div className="p-4">Loading new listings...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!newPairs.length) {
    return <div className="p-4">No new listings data available.</div>;
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
                      <Link href={`/degen/tokens/${pair.baseToken.address}`} className="flex items-center gap-2">
                        {pair.baseToken.symbol}/{pair.quoteToken.symbol}
                      </Link>
                    </TableCell>
                    <TableCell>{pair.chainId}</TableCell>
                    <TableCell>{pair.dexId}</TableCell>
                    <TableCell className="text-right">${parseFloat(pair.priceUsd || '0').toFixed(6)}</TableCell>
                    <TableCell className="text-right">${pair.volume.h24?.toLocaleString()}</TableCell>
                    <TableCell>{pair.pairCreatedAt ? new Date(pair.pairCreatedAt).toLocaleString() : 'N/A'}</TableCell>
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
