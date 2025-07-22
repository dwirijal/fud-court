'use client';

import { useEffect, useState, use } from 'react';
import { DexScreenerClient, DexScreenerPair } from '@/lib/api-clients/crypto/dexScreener';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils/utils';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

interface TokenDetailPageProps {
  params: { address: string };
}

export default function TokenDetailPage({ params }: TokenDetailPageProps) {
  const { address } = use(params); // Unwrap the params Promise
  const [tokenPairs, setTokenPairs] = useState<DexScreenerPair[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenDetails = async () => {
      try {
        const dexScreener = new DexScreenerClient();
        const response = await dexScreener.getTokens(address);
        setTokenPairs(response.pairs);
      } catch (err) {
        setError('Failed to fetch token details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      fetchTokenDetails();
    }
  }, [address]);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (loading || !tokenPairs) {
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
                    <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, i) => (
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

  const tokenInfo = tokenPairs[0].baseToken.address.toLowerCase() === address.toLowerCase()
    ? tokenPairs[0].baseToken
    : tokenPairs[0].quoteToken;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Token Details: {tokenInfo.name} ({tokenInfo.symbol})</h1>
      <p className="text-muted-foreground mb-4">Address: {address}</p>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Associated Pairs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pair</TableHead>
                  <TableHead>Chain</TableHead>
                  <TableHead>DEX</TableHead>
                  <TableHead className="text-right">Price (USD)</TableHead>
                  <TableHead className="text-right">24h Change (%)</TableHead>
                  <TableHead className="text-right">24h Volume</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokenPairs.map((pair) => (
                  <TableRow key={pair.pairAddress}>
                    <TableCell className="font-medium">
                      <Link href={`/degen/tokens/${pair.baseToken.address}`} className="flex items-center gap-2">
                        {pair.baseToken.symbol}/{pair.quoteToken.symbol}
                      </Link>
                    </TableCell>
                    <TableCell>{pair.chainId}</TableCell>
                    <TableCell>{pair.dexId}</TableCell>
                    <TableCell className="text-right">${parseFloat(pair.priceUsd || '0').toFixed(6)}</TableCell>
                    <TableCell className={cn(
                      "text-right",
                      pair.priceChange.h24 >= 0 ? 'text-green-500' : 'text-red-500'
                    )}>
                      {pair.priceChange.h24?.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">${pair.volume.h24?.toLocaleString()}</TableCell>
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