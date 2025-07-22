'use client';

import { useEffect, useState } from 'react';
import { DefiLlamaClient } from '@/lib/api-clients/crypto/defiLlama';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils/utils';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

interface DexProtocol {
  name: string;
  displayName: string;
  total24h: number;
  total7d: number;
  change_1d: number;
  change_7d: number;
  chains: string[];
}

export default function DexsPage() {
  const [dexs, setDexs] = useState<DexProtocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDexs = async () => {
      try {
        const defiLlama = new DefiLlamaClient();
        const response = await defiLlama.getDexVolume();
        setDexs(response.protocols);
      } catch (err) {
        setError('Failed to fetch DEX volume data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDexs();
  }, []);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (loading || !dexs.length) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">DEX Volume Analytics</h1>
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
      <h1 className="text-2xl font-bold mb-4">DEX Volume Analytics</h1>
      <Card>
        <CardHeader>
          <CardTitle>All DEXs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">24h Volume (USD)</TableHead>
                  <TableHead className="text-right">24h Change (%)</TableHead>
                  <TableHead className="text-right">7d Volume (USD)</TableHead>
                  <TableHead className="text-right">7d Change (%)</TableHead>
                  <TableHead>Chains</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dexs.map((dex) => (
                  <TableRow key={dex.name}>
                    <TableCell className="font-medium">
                      <Link href={`/defi/dexs/${dex.name}`} className="block w-full h-full py-2 px-4">
                        {dex.displayName || dex.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/defi/dexs/${dex.name}`} className="block w-full h-full py-2 px-4">
                        ${dex.total24h?.toLocaleString()}
                      </Link>
                    </TableCell>
                    <TableCell className={cn(
                      "text-right",
                      dex.change_1d >= 0 ? 'text-green-500' : 'text-red-500'
                    )}>
                      <Link href={`/defi/dexs/${dex.name}`} className="block w-full h-full py-2 px-4">
                        {dex.change_1d?.toFixed(2)}%
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/defi/dexs/${dex.name}`} className="block w-full h-full py-2 px-4">
                        ${dex.total7d?.toLocaleString()}
                      </Link>
                    </TableCell>
                    <TableCell className={cn(
                      "text-right",
                      dex.change_7d >= 0 ? 'text-green-500' : 'text-red-500'
                    )}>
                      <Link href={`/defi/dexs/${dex.name}`} className="block w-full h-full py-2 px-4">
                        {dex.change_7d?.toFixed(2)}%
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/defi/dexs/${dex.name}`} className="block w-full h-full py-2 px-4">
                        {dex.chains.join(', ')}
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
