
'use client';

import { useEffect, useState, useMemo } from 'react';
import { DexScreenerClient, DexScreenerPair } from '@/lib/api-clients/crypto/dexScreener';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, Droplets, BarChart3, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils/utils';
import Link from 'next/link';

interface TokenDetailPageProps {
  params: { address: string };
}

export default function TokenDetailPage({ params }: TokenDetailPageProps) {
  const { address } = params;
  const [tokenPairs, setTokenPairs] = useState<DexScreenerPair[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenDetails = async () => {
      if (!address) return;
      setLoading(true);
      setError(null);
      try {
        const dexScreener = new DexScreenerClient();
        const response = await dexScreener.getTokens(address);
        if (response.pairs && response.pairs.length > 0) {
          // Sort pairs by 24h volume to find the most relevant one
          const sortedPairs = response.pairs.sort((a, b) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0));
          setTokenPairs(sortedPairs);
        } else {
          setTokenPairs([]);
        }
      } catch (err) {
        setError('Failed to fetch token details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenDetails();
  }, [address]);

  const tokenInfo = useMemo(() => {
    if (!tokenPairs || tokenPairs.length === 0) return null;
    // The base token should be our token of interest
    return tokenPairs[0].baseToken;
  }, [tokenPairs]);

  const aggregatedData = useMemo(() => {
    if (!tokenPairs || tokenPairs.length === 0) {
      return { totalVolume: 0, totalLiquidity: 0 };
    }
    const totalVolume = tokenPairs.reduce((sum, pair) => sum + (pair.volume?.h24 || 0), 0);
    const totalLiquidity = tokenPairs.reduce((sum, pair) => sum + (pair.liquidity?.usd || 0), 0);
    return { totalVolume, totalLiquidity };
  }, [tokenPairs]);

  const formatCurrency = (value: number | undefined | null, precision = 2) => {
    if (value === undefined || value === null) return 'N/A';
    if (value > 1) return `$${value.toLocaleString(undefined, { minimumFractionDigits: precision, maximumFractionDigits: precision })}`;
    return `$${value.toPrecision(4)}`;
  };
  
  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-4 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Card>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
        <Card>
            <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
            <CardContent><Skeleton className="h-40 w-full" /></CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500 text-center">{error}</div>;
  }

  if (!tokenInfo || !tokenPairs || tokenPairs.length === 0) {
    return <div className="p-4 text-muted-foreground text-center">Token not found or no pairs available.</div>;
  }
  
  const mostRelevantPair = tokenPairs[0];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold">{tokenInfo.name} ({tokenInfo.symbol})</h1>
        <p className="text-sm text-muted-foreground break-all">{address}</p>
      </header>

      <Card>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4">
            <DollarSign className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="text-xl font-bold">{formatCurrency(parseFloat(mostRelevantPair.priceUsd ?? '0'))}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <BarChart3 className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">24h Volume</p>
              <p className="text-xl font-bold">{formatCurrency(aggregatedData.totalVolume, 0)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Droplets className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Liquidity</p>
              <p className="text-xl font-bold">{formatCurrency(aggregatedData.totalLiquidity, 0)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Trading Pairs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pair</TableHead>
                  <TableHead>DEX</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">24h Change</TableHead>
                  <TableHead className="text-right">Volume</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokenPairs.map((pair) => (
                  <TableRow key={pair.pairAddress}>
                    <TableCell>
                      <Link href={pair.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                        {pair.baseToken.symbol}/{pair.quoteToken.symbol}
                        <LinkIcon className="h-3 w-3 text-muted-foreground" />
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{pair.dexId}</TableCell>
                    <TableCell className="text-right">{formatCurrency(parseFloat(pair.priceUsd ?? '0'))}</TableCell>
                    <TableCell className={cn(
                      "text-right",
                      (pair.priceChange?.h24 ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'
                    )}>
                      {pair.priceChange?.h24?.toFixed(2) ?? '0.00'}%
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(pair.volume.h24, 0)}</TableCell>
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
