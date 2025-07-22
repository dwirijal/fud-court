'use client';

import { useEffect, useState } from 'react';
import { DefiLlamaClient } from '@/lib/api-clients/crypto/defiLlama';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils/utils';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

interface OptionsDexProtocol {
  name: string;
  total24h: number;
  change_1d: number;
}

export default function OptionsDexsPage() {
  const [optionsDexs, setOptionsDexs] = useState<OptionsDexProtocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOptionsDexs = async () => {
      try {
        const defiLlama = new DefiLlamaClient();
        const response = await defiLlama.getOptionsVolume();
        setOptionsDexs(response.protocols);
      } catch (err) {
        setError('Failed to fetch options DEX volume data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOptionsDexs();
  }, []);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (loading || !optionsDexs.length) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Options DEX Volume Analytics</h1>
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
                    <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
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
      <h1 className="text-2xl font-bold mb-4">Options DEX Volume Analytics</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Options DEXs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">24h Volume (USD)</TableHead>
                  <TableHead className="text-right">24h Change (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {optionsDexs.map((dex) => (
                  <TableRow key={dex.name}>
                    <TableCell className="font-medium">
                      {/* No specific detail page for options DEXs in DefiLlama API, so no Link here */}
                      {dex.name}
                    </TableCell>
                    <TableCell className="text-right">${dex.total24h?.toLocaleString()}</TableCell>
                    <TableCell className={cn(
                      "text-right",
                      dex.change_1d >= 0 ? 'text-green-500' : 'text-red-500'
                    )}>
                      {dex.change_1d?.toFixed(2)}%
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
