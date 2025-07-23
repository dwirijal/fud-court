'use client';

import { useEffect, useState, useMemo } from 'react';
import { DefiLlamaClient, ProtocolDetails } from '@/lib/api-clients/crypto/defiLlama';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
        const data = await defiLlama.getProtocolTVL(protocol);
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

  const historicalTvlData = useMemo(() => {
    if (!protocolData?.chainTvls) return [];
    
    // Attempt to get Ethereum data, otherwise the first available chain
    const chainKey = Object.keys(protocolData.chainTvls).includes('Ethereum') 
      ? 'Ethereum' 
      : Object.keys(protocolData.chainTvls)[0];
      
    if (!chainKey || !protocolData.chainTvls[chainKey]?.tvl) return [];
    
    return protocolData.chainTvls[chainKey].tvl.map(entry => ({
      date: new Date(entry.date * 1000).toLocaleDateString(),
      tvl: entry.totalLiquidityUSD
    }));
  }, [protocolData]);
  
  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  if (loading) {
    return (
        <div className="p-4 space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-48" />
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-40 w-full" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-64 w-full" />
                </CardContent>
            </Card>
        </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!protocolData) {
    return <div className="p-4">Protocol not found.</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">{protocolData.name} ({protocolData.symbol})</h1>
      <p className="text-muted-foreground">Category: {protocolData.category}</p>

      <Card>
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
          <CardTitle>Historical TVL Trend</CardTitle>
        </CardHeader>
        <CardContent>
            {historicalTvlData.length > 0 ? (
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={historicalTvlData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorTvl" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                        <XAxis dataKey="date" tick={{fontSize: 12}} />
                        <YAxis tickFormatter={(value) => formatCurrency(value)} tick={{fontSize: 12}} />
                        <Tooltip
                            formatter={(value: number) => [formatCurrency(value), 'TVL']}
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: 'var(--radius-2)'
                            }}
                        />
                        <Area type="monotone" dataKey="tvl" stroke="hsl(var(--primary))" fill="url(#colorTvl)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <p className="text-muted-foreground text-center py-8">No historical TVL data available to display chart.</p>
            )}
            <p className="text-sm text-muted-foreground mt-4">
              Note: Historical TVL is shown for a single chain, typically Ethereum if available.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}