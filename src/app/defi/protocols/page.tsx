'use client';

import { useEffect, useState } from 'react';
import { DefiLlamaClient, Protocol } from '@/lib/api-clients/crypto/defiLlama';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils/utils';
import Link from 'next/link';

export default function DefiProtocolsPage() {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProtocols = async () => {
      try {
        const defiLlama = new DefiLlamaClient();
        const data = await defiLlama.getProtocols();
        setProtocols(data);
      } catch (err) {
        setError('Failed to fetch DeFi protocols data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProtocols();
  }, []);

  if (loading) {
    return <div className="p-4">Loading DeFi protocols...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!protocols.length) {
    return <div className="p-4">No DeFi protocols data available.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">DeFi Protocols Overview</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Protocols</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">TVL (USD)</TableHead>
                  <TableHead className="text-right">24h Change (%)</TableHead>
                  <TableHead>Chains</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {protocols.map((protocol) => (
                  <TableRow key={protocol.id}>
                    <TableCell className="font-medium">
                      <Link href={`/defi/protocols/${protocol.slug}`}>
                        {protocol.name}
                      </Link>
                    </TableCell>
                    <TableCell>{protocol.category}</TableCell>
                    <TableCell className="text-right">${protocol.tvl?.toLocaleString()}</TableCell>
                    <TableCell className={cn(
                      "text-right",
                      protocol.change_1d >= 0 ? 'text-green-500' : 'text-red-500'
                    )}>
                      {protocol.change_1d?.toFixed(2)}%
                    </TableCell>
                    <TableCell>{protocol.chains.join(', ')}</TableCell>
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
