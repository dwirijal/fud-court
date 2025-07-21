'use client';

import { useEffect, useState } from 'react';
import { DefiLlamaClient, StablecoinData } from '@/lib/api-clients/crypto/defiLlama';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils/utils';
import Link from 'next/link';

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

  if (loading) {
    return <div className="p-4">Loading stablecoins...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!stablecoins.length) {
    return <div className="p-4">No stablecoins data available.</div>;
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
                      <Link href={`/defi/stablecoins/${stablecoin.id}`}>
                        {stablecoin.name}
                      </Link>
                    </TableCell>
                    <TableCell>{stablecoin.symbol}</TableCell>
                    <TableCell>{stablecoin.pegType}</TableCell>
                    <TableCell>{stablecoin.pegMechanism}</TableCell>
                    <TableCell className="text-right">${stablecoin.price?.toFixed(4) || 'N/A'}</TableCell>
                    <TableCell className="text-right">${stablecoin.circulating?.peggedUSD?.toLocaleString() || 'N/A'}</TableCell>
                    <TableCell>{stablecoin.chains.join(', ')}</TableCell>
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
