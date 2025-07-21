'use client';

import { useEffect, useState } from 'react';
import { DefiLlamaClient, YieldPool } from '@/lib/api-clients/crypto/defiLlama';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils/utils';

interface YieldPoolDetailPageProps {
  params: { pool: string };
}

export default function YieldPoolDetailPage({ params }: YieldPoolDetailPageProps) {
  const { pool } = params;
  const [poolData, setPoolData] = useState<YieldPool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoolDetails = async () => {
      try {
        const defiLlama = new DefiLlamaClient();
        const response = await defiLlama.getYieldPool(pool);
        // The API returns an array of historical data, we need the latest pool info
        // Assuming the first item in the data array contains the pool details
        if (response.data && response.data.length > 0) {
          setPoolData(response.data[0]); 
        } else {
          setPoolData(null);
        }
      } catch (err) {
        setError('Failed to fetch yield pool details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (pool) {
      fetchPoolDetails();
    }
  }, [pool]);

  if (loading) {
    return <div className="p-4">Loading yield pool details...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!poolData) {
    return <div className="p-4">Yield pool not found.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{poolData.project} - {poolData.symbol} Pool</h1>
      <p className="text-muted-foreground mb-4">Chain: {poolData.chain}</p>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Current Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <p>TVL (USD): ${poolData.tvlUsd?.toLocaleString()}</p>
          <p>APY: {poolData.apy?.toFixed(2)}%</p>
          <p>APY Base: {poolData.apyBase?.toFixed(2)}%</p>
          <p>APY Reward: {poolData.apyReward?.toFixed(2)}%</p>
          <p>Reward Tokens: {poolData.rewardTokens?.join(', ') || 'N/A'}</p>
          {poolData.poolMeta && <p>Meta: {poolData.poolMeta}</p>}
        </CardContent>
      </Card>

      {/* Historical data can be added here, but DefiLlama's /chart/{pool} returns historical APY/TVL, not just pool info. 
          This would require a chart component. For now, we'll just display current metrics. */}

      {/* Example of how historical data might be displayed if fetched */}
      {/* 
      <Card>
        <CardHeader>
          <CardTitle>Historical APY & TVL</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">TVL (USD)</TableHead>
                <TableHead className="text-right">APY (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {poolData.historicalData?.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(entry.timestamp * 1000).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">${entry.tvlUsd.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{entry.apy.toFixed(2)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      */}
    </div>
  );
}
