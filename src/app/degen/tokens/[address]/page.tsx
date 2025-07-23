'use client';

import { useEffect, useState, useMemo } from 'react';
import { DexScreenerClient, DexScreenerPair } from '@/lib/api-clients/crypto/dexScreener';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, Droplets, BarChart3, Link as LinkIcon, ArrowRightLeft, Copy, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BitqueryClient } from '@/lib/api-clients/crypto/bitquery';

interface TokenDetailPageProps {
  params: { address: string };
}

interface PriceData {
  time: string;
  price: number;
}

const formatCurrency = (value: number | undefined | null, precision = 2) => {
  if (value === undefined || value === null) return 'N/A';
  if (value > 1) return `$${value.toLocaleString(undefined, { minimumFractionDigits: precision, maximumFractionDigits: precision })}`;
  if (value === 0) return `$0.00`;
  return `$${value.toPrecision(4)}`;
};

const BitqueryPriceChart = ({ tokenAddress, chainId }: { tokenAddress: string; chainId: string }) => {
  const [chartData, setChartData] = useState<PriceData[]>([]);
  const [loadingChart, setLoadingChart] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoadingChart(true);
      try {
        const bitquery = new BitqueryClient();
        const trades = await bitquery.getHourlyPriceData(tokenAddress, chainId);
        
        const formattedData = trades.map(trade => ({
          time: new Date(trade.block.timestamp.iso8601).toLocaleString(),
          price: trade.trade.price,
        })).reverse(); // Reverse to have time ascending

        setChartData(formattedData);
      } catch (error) {
        console.error("Failed to fetch chart data from Bitquery:", error);
      } finally {
        setLoadingChart(false);
      }
    };

    fetchChartData();
  }, [tokenAddress, chainId]);

  if (loadingChart) {
    return <Skeleton className="h-96 w-full" />;
  }
  
  if (chartData.length === 0) {
    return <div className="h-96 flex items-center justify-center text-muted-foreground">No chart data available.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
            dataKey="time" 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
            tickFormatter={(time) => new Date(time).toLocaleTimeString()}
        />
        <YAxis 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
            tickFormatter={(price) => formatCurrency(price, 4)}
            domain={['dataMin', 'dataMax']}
        />
        <Tooltip
            contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))'
            }}
            formatter={(value: number) => [formatCurrency(value, 6), "Price"]}
        />
        <Area type="monotone" dataKey="price" stroke="hsl(var(--primary))" fill="url(#colorPrice)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};


export default function TokenDetailPage({ params }: TokenDetailPageProps) {
  const { address } = params;
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

  const mostRelevantPair = useMemo(() => {
    if (!tokenPairs || tokenPairs.length === 0) return null;
    return tokenPairs[0];
  }, [tokenPairs]);


  const aggregatedData = useMemo(() => {
    if (!tokenPairs || tokenPairs.length === 0) {
      return { totalVolume: 0, totalLiquidity: 0, totalBuys24h: 0, totalSells24h: 0 };
    }
    const totalVolume = tokenPairs.reduce((sum, pair) => sum + (pair.volume?.h24 || 0), 0);
    const totalLiquidity = tokenPairs.reduce((sum, pair) => sum + (pair.liquidity?.usd || 0), 0);
    const totalBuys24h = tokenPairs.reduce((sum, pair) => sum + (pair.txns?.h24?.buys || 0), 0);
    const totalSells24h = tokenPairs.reduce((sum, pair) => sum + (pair.txns?.h24?.sells || 0), 0);
    return { totalVolume, totalLiquidity, totalBuys24h, totalSells24h };
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

  if (!tokenInfo || !tokenPairs || tokenPairs.length === 0 || !mostRelevantPair) {
    return <div className="p-4 text-muted-foreground text-center">Token not found or no pairs available.</div>;
  }
  
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold">{tokenInfo.name} ({tokenInfo.symbol})</h1>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground break-all">{address}</p>
          <Button variant="ghost" size="icon" onClick={handleCopy} className="h-7 w-7">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
                <CardTitle>Price Chart (Hourly)</CardTitle>
            </CardHeader>
            <CardContent>
              <BitqueryPriceChart tokenAddress={address} chainId={mostRelevantPair.chainId} />
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

        {/* Right column */}
        <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader><CardTitle>Token Info</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Price</span>
                      <span className="font-bold">{formatCurrency(parseFloat(mostRelevantPair.priceUsd ?? '0'))}</span>
                  </div>
                  <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">24h Volume</span>
                      <span className="font-mono">{formatCurrency(aggregatedData.totalVolume, 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Liquidity</span>
                      <span className="font-mono">{formatCurrency(aggregatedData.totalLiquidity, 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Market Cap</span>
                      <span className="font-mono">{formatCurrency(mostRelevantPair.marketCap, 0)}</span>
                  </div>
              </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>24h Transactions</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-green-500 flex items-center gap-2"><ArrowUp/> Buys</span>
                        <span className="font-mono">{aggregatedData.totalBuys24h.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-red-500 flex items-center gap-2"><ArrowDown/> Sells</span>
                        <span className="font-mono">{aggregatedData.totalSells24h.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-2">
                        <span className="text-sm text-muted-foreground">Total</span>
                        <span className="font-mono">{(aggregatedData.totalBuys24h + aggregatedData.totalSells24h).toLocaleString()}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
