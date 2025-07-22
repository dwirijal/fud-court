'use client';

import { useEffect, useState } from 'react';
import { DefiLlamaClient, Protocol } from '@/lib/api-clients/crypto/defiLlama';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils/utils';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

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

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (loading || !protocols.length) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">DeFi Protocols Overview</h1>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(10)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
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
                      <Link href={`/defi/protocols/${protocol.slug}`} className="block w-full h-full py-2 px-4">
                        {protocol.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/defi/protocols/${protocol.slug}`} className="block w-full h-full py-2 px-4">
                        {protocol.category}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/defi/protocols/${protocol.slug}`} className="block w-full h-full py-2 px-4">
                        ${protocol.tvl?.toLocaleString()}
                      </Link>
                    </TableCell>
                    <TableCell className={cn(
                      "text-right",
                      protocol.change_1d >= 0 ? 'text-green-500' : 'text-red-500'
                    )}>
                      <Link href={`/defi/protocols/${protocol.slug}`} className="block w-full h-full py-2 px-4">
                        {protocol.change_1d?.toFixed(2)}%
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/defi/protocols/${protocol.slug}`} className="block w-full h-full py-2 px-4">
                        {protocol.chains.join(', ')}
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
