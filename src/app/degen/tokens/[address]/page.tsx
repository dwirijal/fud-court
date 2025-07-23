
'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Copy, ArrowUp, ArrowDown, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GeckoTerminalAPI, Pool, Token, OHLCVData } from '@/lib/api-clients/crypto/geckoterminal';

interface TokenDetailPageProps {
  params: { address: string };
}

const formatCurrency = (value: number | string | undefined | null, precision = 2) => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (numValue === undefined || numValue === null) return 'N/A';
  if (Math.abs(numValue) > 1 || numValue === 0) {
    return `$${numValue.toLocaleString(undefined, { minimumFractionDigits: precision, maximumFractionDigits: precision })}`;
  }
  return `$${numValue.toPrecision(4)}`;
};

const GeckoTerminalPriceChart = ({ network, poolAddress }: { network: string; poolAddress: string }) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loadingChart, setLoadingChart] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      if(!network || !poolAddress) return;
      setLoadingChart(true);
      try {
        const api = new GeckoTerminalAPI();
        const ohlcv = await api.getPoolOHLCV(network, poolAddress, { timeframe: 'hour', limit: 100 });
        const formattedData = api.formatOHLCVForChart(ohlcv);
        setChartData(formattedData);
      } catch (error) {
        console.error("Failed to fetch chart data from GeckoTerminal:", error);
      } finally {
        setLoadingChart(false);
      }
    };

    fetchChartData();
  }, [network, poolAddress]);

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
            dataKey="datetime" 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
            tickFormatter={(time) => new Date(time).toLocaleTimeString()}
        />
        <YAxis 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
            tickFormatter={(price) => formatCurrency(price, 4)}
            domain={['dataMin', 'dataMax']}
            allowDataOverflow={false}
            width={80}
        />
        <Tooltip
            contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))'
            }}
            formatter={(value: number) => [formatCurrency(value, 6), "Price"]}
        />
        <Area type="monotone" dataKey="close" stroke="hsl(var(--primary))" fill="url(#colorPrice)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};


export default function TokenDetailPage({ params }: TokenDetailPageProps) {
  const { address } = params;
  const [tokenInfo, setTokenInfo] = useState<Token | null>(null);
  const [tokenPools, setTokenPools] = useState<Pool[]>([]);
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
      const api = new GeckoTerminalAPI();

      try {
        const searchResponse = await api.search({ query: address });
        
        const tokenFromSearch = searchResponse.data.find(
          (item: any) => item.type === 'token' && item.attributes.address.toLowerCase() === address.toLowerCase()
        );

        if (!tokenFromSearch) {
          setError('Token not found.');
          setLoading(false);
          return;
        }

        const networkId = tokenFromSearch.relationships.network.data.id;
        
        const [tokenDetailsResponse, tokenPoolsResponse] = await Promise.all([
            api.getToken(networkId, address),
            api.getTokenPools(networkId, address, ['base_token', 'quote_token', 'dex'])
        ]);

        setTokenInfo(tokenDetailsResponse.data);

        const sortedPools = tokenPoolsResponse.data.sort((a, b) => parseFloat(b.attributes.volume_usd.h24) - parseFloat(a.attributes.volume_usd.h24));
        setTokenPools(sortedPools);

      } catch (err) {
        setError('Failed to fetch token details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenDetails();
  }, [address]);
  
  const mostRelevantPool = useMemo(() => {
    if (tokenPools.length === 0) return null;
    return tokenPools[0];
  }, [tokenPools]);

  const arbitrageOpportunity = useMemo(() => {
    if (tokenPools.length < 2) return null;

    const liquidPools = tokenPools
      .filter(p => parseFloat(p.attributes.reserve_in_usd) > 1000)
      .map(p => ({
        dex: p.relationships.dex.data.id.split('_')[1],
        price: parseFloat(p.attributes.base_token_price_usd)
      }));

    if (liquidPools.length < 2) return null;

    const lowest = liquidPools.reduce((prev, curr) => (prev.price < curr.price ? prev : curr));
    const highest = liquidPools.reduce((prev, curr) => (prev.price > curr.price ? prev : curr));

    if (lowest.dex === highest.dex || lowest.price === 0) return null;

    const percentage = ((highest.price - lowest.price) / lowest.price) * 100;

    if (percentage > 1) { // Only show if profit is > 1%
      return { lowest, highest, percentage };
    }

    return null;
  }, [tokenPools]);
  
  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-4 max-w-5xl mx-auto">
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

  if (!tokenInfo || !mostRelevantPool) {
    return <div className="p-4 text-muted-foreground text-center">Token not found or no pools available.</div>;
  }
  
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold">{tokenInfo.attributes.name} ({tokenInfo.attributes.symbol})</h1>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground break-all">{address}</p>
          <Button variant="ghost" size="icon" onClick={handleCopy} className="h-7 w-7">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
                <CardTitle>Price Chart (Hourly)</CardTitle>
            </CardHeader>
            <CardContent>
              <GeckoTerminalPriceChart network={mostRelevantPool.id.split('_')[0]} poolAddress={mostRelevantPool.attributes.address} />
            </CardContent>
          </Card>

           {arbitrageOpportunity && (
            <Card className="border-accent">
              <CardHeader>
                <CardTitle className="text-accent flex items-center gap-2">
                  <TrendingUp />
                  Peluang Arbitrase
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row items-center justify-around gap-4 text-center">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Beli di</p>
                  <p className="font-bold text-lg capitalize">{arbitrageOpportunity.lowest.dex}</p>
                  <p className="font-mono">{formatCurrency(arbitrageOpportunity.lowest.price, 6)}</p>
                </div>
                <div className="flex-1">
                  <ArrowDown className="h-8 w-8 text-red-500 bg-red-500/10 p-1 rounded-full mx-auto my-2 md:hidden" />
                  <ArrowUp className="h-8 w-8 text-green-500 bg-green-500/10 p-1 rounded-full mx-auto my-2 md:hidden" />
                  <p className="text-2xl font-bold text-green-500">
                    +{arbitrageOpportunity.percentage.toFixed(2)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Potensi Keuntungan</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Jual di</p>
                  <p className="font-bold text-lg capitalize">{arbitrageOpportunity.highest.dex}</p>
                  <p className="font-mono">{formatCurrency(arbitrageOpportunity.highest.price, 6)}</p>
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
                    {tokenPools.map((pool) => (
                      <TableRow key={pool.id}>
                        <TableCell>
                           {pool.attributes.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground capitalize">{pool.relationships.dex.data.id.split('_')[1]}</TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(pool.attributes.base_token_price_usd, 6)}</TableCell>
                        <TableCell className={cn(
                          "text-right",
                          parseFloat(pool.attributes.price_change_percentage.h24) >= 0 ? 'text-green-500' : 'text-red-500'
                        )}>
                          {parseFloat(pool.attributes.price_change_percentage.h24).toFixed(2)}%
                        </TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(pool.attributes.volume_usd.h24, 0)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader><CardTitle>Token Info</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Price</span>
                      <span className="font-bold">{formatCurrency(tokenInfo.attributes.price_usd)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">24h Volume</span>
                      <span className="font-mono">{formatCurrency(tokenInfo.attributes.volume_usd.h24, 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Reserve</span>
                      <span className="font-mono">{formatCurrency(tokenInfo.attributes.total_reserve_in_usd, 0)}</span>
                  </div>
                   <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Market Cap</span>
                      <span className="font-mono">{formatCurrency(tokenInfo.attributes.market_cap_usd, 0)}</span>
                  </div>
                   <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Website</span>
                      <Button variant="link" size="sm" asChild>
                        <a href={tokenInfo.attributes.websites?.[0]} target="_blank" rel="noopener noreferrer">
                          Visit <ExternalLink className="h-3 w-3 ml-1"/>
                        </a>
                      </Button>
                  </div>
              </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>24h Transactions</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-green-500 flex items-center gap-2"><TrendingUp/> Buys</span>
                        <span className="font-mono">{mostRelevantPool.attributes.transactions.h24.buys.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-red-500 flex items-center gap-2"><TrendingDown/> Sells</span>
                        <span className="font-mono">{mostRelevantPool.attributes.transactions.h24.sells.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-2">
                        <span className="text-sm text-muted-foreground">Total</span>
                        <span className="font-mono">{(mostRelevantPool.attributes.transactions.h24.buys + mostRelevantPool.attributes.transactions.h24.sells).toLocaleString()}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
