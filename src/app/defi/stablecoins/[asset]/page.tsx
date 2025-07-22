'use client';

import { useEffect, useState } from 'react';
import { DefiLlamaClient, StablecoinData } from '@/lib/api-clients/crypto/defiLlama';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils/utils';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

interface StablecoinDetailPageProps {
  params: { asset: string };
}

export default function StablecoinDetailPage({ params }: StablecoinDetailPageProps) {
  const { asset } = params;
  const [stablecoinData, setStablecoinData] = useState<any | null>(null); // Using any for now due to complex nested structure
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStablecoinDetails = async () => {
      try {
        const defiLlama = new DefiLlamaClient();
        // DefiLlama's /stablecoin/{asset} endpoint returns historical mcap and chain distribution
        const data = await defiLlama.request<any>(`https://stablecoins.llama.fi/stablecoin/${asset}`);
        setStablecoinData(data);
      } catch (err) {
        setError('Failed to fetch stablecoin details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (asset) {
      fetchStablecoinDetails();
    }
  }, [asset]);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (loading || !stablecoinData) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4"><Skeleton className="h-8 w-64" /></h1>
        <p className="text-muted-foreground mb-4"><Skeleton className="h-4 w-48" /></p>

        <Card className="mb-4">
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
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
      <h1 className="text-2xl font-bold mb-4">{stablecoinData.name} ({stablecoinData.symbol})</h1>
      <p className="text-muted-foreground mb-4">Peg Type: {stablecoinData.pegType} | Peg Mechanism: {stablecoinData.pegMechanism}</p>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Historical Total Circulating Supply (USD)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Circulating Supply (USD)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stablecoinData.totalCirculating?.map((entry: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(entry.date * 1000).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">${entry.totalCirculating.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Circulating Supply by Chain</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chain</TableHead>
                  <TableHead className="text-right">Circulating Supply (USD)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(stablecoinData.chainCirculating || {}).map(([chainName, chainData]: [string, any]) => (
                  <TableRow key={chainName}>
                    <TableCell>{chainName}</TableCell>
                    <TableCell className="text-right">${chainData[chainData.length - 1]?.circulating?.toLocaleString() || 'N/A'}</TableCell>
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