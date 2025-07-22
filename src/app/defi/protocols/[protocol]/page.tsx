'use client';

import { useEffect, useState } from 'react';
import { DefiLlamaClient, ProtocolDetails } from '@/lib/api-clients/crypto/defiLlama';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils/utils';

interface ProtocolDetailPageProps {
  params: { protocol: string };
}

export default function ProtocolDetailPage({ params }: ProtocolDetailPageProps) {
  const { protocol } = params;
  const [protocolData, setProtocolData] = useState<ProtocolDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProtocolDetails = async () => {
      try {
        const defiLlama = new DefiLlamaClient();
        const data = await defiLlama.getProtocolTVL(protocol); // This endpoint returns ProtocolDetails
        setProtocolData(data);
      } catch (err) {
        setError('Failed to fetch protocol details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (protocol) {
      fetchProtocolDetails();
    }
  }, [protocol]);

  if (loading) {
    return <div className="p-4">Loading protocol details...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!protocolData) {
    return <div className="p-4">Protocol not found.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{protocolData.name} ({protocolData.symbol})</h1>
      <p className="text-muted-foreground mb-4">Category: {protocolData.category}</p>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Current TVL by Chain</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chain</TableHead>
                <TableHead className="text-right">TVL (USD)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(protocolData.currentChainTvls || {}).map(([chain, tvl]) => (
                <TableRow key={chain}>
                  <TableCell>{chain}</TableCell>
                  <TableCell className="text-right">${tvl.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historical TVL (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Total Liquidity (USD)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {protocolData.chainTvls?.Ethereum?.tvl?.slice(-30).map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(entry.date * 1000).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">${entry.totalLiquidityUSD.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Note: Historical TVL is shown for Ethereum chain as an example.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
