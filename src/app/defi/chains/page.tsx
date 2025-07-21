'use client';

import { useEffect, useState } from 'react';
import { DefiLlamaClient, Chain } from '@/lib/api-clients/crypto/defiLlama';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

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

  if (loading) {
    return <div className="p-4">Loading DeFi chains...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!chains.length) {
    return <div className="p-4">No DeFi chains data available.</div>;
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
                      <Link href={`/defi/chains/${chain.name}`}>
                        {chain.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">${chain.tvl?.toLocaleString()}</TableCell>
                    <TableCell>{chain.tokenSymbol || 'N/A'}</TableCell>
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
