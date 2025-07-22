'use client';

import { useEffect, useState } from 'react';
import { DefiLlamaClient, Chain } from '@/lib/api-clients/crypto/defiLlama';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

export default function DefiChainsPage() {
  const [chains, setChains] = useState<Chain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChains = async () => {
      try {
        const defiLlama = new DefiLlamaClient();
        const data = await defiLlama.getChains();
        setChains(data);
      } catch (err) {
        setError('Failed to fetch DeFi chains data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChains();
  }, []);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (loading || !chains.length) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">DeFi Chains Overview</h1>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(10)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
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
      <h1 className="text-2xl font-bold mb-4">DeFi Chains Overview</h1>
      <Card>
        <CardHeader>
          <CardTitle>Chains by TVL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">TVL (USD)</TableHead>
                  <TableHead>Token Symbol</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chains.map((chain) => (
                  <TableRow key={chain.name}>
                    <TableCell className="font-medium">
                      <Link href={`/defi/chains/${chain.name}`} className="block w-full h-full py-2 px-4">
                        {chain.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/defi/chains/${chain.name}`} className="block w-full h-full py-2 px-4">
                        ${chain.tvl?.toLocaleString()}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/defi/chains/${chain.name}`} className="block w-full h-full py-2 px-4">
                        {chain.tokenSymbol || 'N/A'}
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
