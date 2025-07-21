'use client';

import { useEffect, useState } from 'react';
import { DefiLlamaClient, VolumeData } from '@/lib/api-clients/crypto/defiLlama';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils/utils';

interface DexDetailPageProps {
  params: { protocol: string };
}

export default function DexDetailPage({ params }: DexDetailPageProps) {
  const { protocol } = params;
  const [dexData, setDexData] = useState<VolumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDexDetails = async () => {
      try {
        const defiLlama = new DefiLlamaClient();
        const data = await defiLlama.getDexVolumeData(protocol);
        setDexData(data);
      } catch (err) {
        setError('Failed to fetch DEX details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (protocol) {
      fetchDexDetails();
    }
  }, [protocol]);

  if (loading) {
    return <div className="p-4">Loading DEX details...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!dexData) {
    return <div className="p-4">DEX not found.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{protocol} DEX Analytics</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Current Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <p>24h Volume: ${dexData.totalVolume24h?.toLocaleString()}</p>
          <p>7d Volume: ${dexData.totalVolume7d?.toLocaleString()}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Volume by Chain</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chain</TableHead>
                  <TableHead className="text-right">24h Volume (USD)</TableHead>
                  <TableHead className="text-right">7d Volume (USD)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(dexData.chains || {}).map(([chainName, chainVolume]) => (
                  <TableRow key={chainName}>
                    <TableCell>{chainName}</TableCell>
                    <TableCell className="text-right">${chainVolume.total24h?.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${chainVolume.total7d?.toLocaleString()}</TableCell>
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
