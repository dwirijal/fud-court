'use client';

import { useEffect, useState } from 'react';
import { DefiLlamaClient, StablecoinData } from '@/lib/api-clients/crypto/defiLlama';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils/utils';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

export default function StablecoinsPage() {
  const [stablecoins, setStablecoins] = useState<StablecoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStablecoins = async () => {
      try {
        const defiLlama = new DefiLlamaClient();
        const response = await defiLlama.getStablecoins();
        setStablecoins(response.peggedAssets);
      } catch (err) {
        setError('Failed to fetch stablecoins data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStablecoins();
  }, []);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (loading || !stablecoins.length) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Stablecoin Analytics</h1>
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
                    <TableHead><Skeleton className="h-4 w-28" /></TableHead>
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
      <h1 className="text-2xl font-bold mb-4">Stablecoin Analytics</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Stablecoins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Peg Type</TableHead>
                  <TableHead>Peg Mechanism</TableHead>
                  <TableHead className="text-right">Price (USD)</TableHead>
                  <TableHead className="text-right">Circulating (USD)</TableHead>
                  <TableHead>Chains</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stablecoins.map((stablecoin) => (
                  <TableRow key={stablecoin.id}>
                    <TableCell className="font-medium">
                      <Link href={`/defi/stablecoins/${stablecoin.id}`} className="block w-full h-full py-2 px-4">
                        {stablecoin.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/defi/stablecoins/${stablecoin.id}`} className="block w-full h-full py-2 px-4">
                        {stablecoin.symbol}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/defi/stablecoins/${stablecoin.id}`} className="block w-full h-full py-2 px-4">
                        {stablecoin.pegType}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/defi/stablecoins/${stablecoin.id}`} className="block w-full h-full py-2 px-4">
                        {stablecoin.pegMechanism}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/defi/stablecoins/${stablecoin.id}`} className="block w-full h-full py-2 px-4">
                        ${stablecoin.price?.toFixed(4) || 'N/A'}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/defi/stablecoins/${stablecoin.id}`} className="block w-full h-full py-2 px-4">
                        ${stablecoin.circulating?.peggedUSD?.toLocaleString() || 'N/A'}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/defi/stablecoins/${stablecoin.id}`} className="block w-full h-full py-2 px-4">
                        {stablecoin.chains.join(', ')}
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
