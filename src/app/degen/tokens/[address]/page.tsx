
'use client';

import { useEffect, useState, useMemo } from 'react';
import { DexScreenerClient, DexScreenerPair } from '@/lib/api-clients/crypto/dexScreener';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, Droplets, BarChart3, Link as LinkIcon, ArrowRightLeft, Copy } from 'lucide-react';
import { cn } from '@/lib/utils/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

interface TokenDetailPageProps {
  params: { address: string };
}

export default function TokenDetailPage({ params }: TokenDetailPageProps) {
  const { address } = params;
  const { theme } = useTheme();
  const [tokenPairs, setTokenPairs] = useState<DexScreenerPair[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    toast('Address copied to clipboard!');
  };

  useEffect(() => {
    const fetchTokenDetails = async () => {
      if (!address) return;
      setLoading(true);
      setError(null);
      try {
        const dexScreener = new DexScreenerClient();
        const response = await dexScreener.getTokens(address);
        if (response.pairs && response.pairs.length > 0) {
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

  const arbitrageOpportunity = useMemo(() => {
    if (!tokenPairs || tokenPairs.length < 2) return null;

    const validPairs = tokenPairs.filter(p => 
      p.priceUsd && parseFloat(p.priceUsd) > 0 && p.liquidity?.usd && p.liquidity.usd > 1000
    );

    if (validPairs.length < 2) return null;

    const sortedByPrice = [...validPairs].sort((a, b) => parseFloat(a.priceUsd!) - parseFloat(b.priceUsd!));
    
    const minPricePair = sortedByPrice[0];
    const maxPricePair = sortedByPrice[sortedByPrice.length - 1];

    if (minPricePair.pairAddress === maxPricePair.pairAddress) return null;

    const minPrice = parseFloat(minPricePair.priceUsd!);
    const maxPrice = parseFloat(maxPricePair.priceUsd!);
    const profitPercentage = ((maxPrice - minPrice) / minPrice) * 100;

    if (profitPercentage > 1) { // Only show significant opportunities
      return {
        buy: minPricePair,
        sell: maxPricePair,
        profit: profitPercentage,
      };
    }
    return null;
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
            <CardContent><Skeleton className="h-96 w-full" /></CardContent>
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
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground break-all">{address}</p>
          <Button variant="ghost" size="icon" onClick={handleCopy} className="h-7 w-7">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
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
            <CardTitle>Price Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-96 aspect-video">
            <iframe
                src={`https://dexscreener.com/${mostRelevantPair.chainId}/${mostRelevantPair.pairAddress}?embed=1&theme=${theme}`}
                className="w-full h-full border-0"
                allowFullScreen
            ></iframe>
          </div>
        </CardContent>
      </Card>
      
      {arbitrageOpportunity && (
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-500">
          <CardHeader>
            <CardTitle className="flex items-center text-green-700 dark:text-green-300">
              <ArrowRightLeft className="h-5 w-5 mr-2"/>
              Peluang Arbitrase
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Beli di</p>
              <p className="font-bold">{arbitrageOpportunity.buy.dexId}</p>
              <p className="font-mono text-lg">{formatCurrency(parseFloat(arbitrageOpportunity.buy.priceUsd!), 6)}</p>
            </div>
            <div className="flex flex-col items-center">
                <ArrowRightLeft className="h-8 w-8 text-green-600 hidden md:block" />
                <div className="text-2xl font-bold text-green-600 my-2">
                    +{arbitrageOpportunity.profit.toFixed(2)}%
                </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Jual di</p>
              <p className="font-bold">{arbitrageOpportunity.sell.dexId}</p>
              <p className="font-mono text-lg">{formatCurrency(parseFloat(arbitrageOpportunity.sell.priceUsd!), 6)}</p>
            </div>
          </CardContent>
        </Card>
      )}

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
                    <TableCell className="text-right font-mono">{formatCurrency(parseFloat(pair.priceUsd ?? '0'), 6)}</TableCell>
                    <TableCell className={cn(
                      "text-right",
                      (pair.priceChange?.h24 ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'
                    )}>
                      {pair.priceChange?.h24?.toFixed(2) ?? '0.00'}%
                    </TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(pair.volume.h24, 0)}</TableCell>
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
