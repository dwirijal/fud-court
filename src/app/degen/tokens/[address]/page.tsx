
'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Copy, ArrowUp, ArrowDown, ExternalLink, TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GeckoTerminalAPI, OHLCVData } from '@/lib/api-clients/crypto/geckoterminal';
import { DexScreenerClient, DexScreenerPair } from '@/lib/api-clients/crypto/dexScreener';


interface TokenDetailPageProps {
  params: { address: string };
}

const formatCurrency = (value: number | string | undefined | null, precision = 2) => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (numValue === undefined || numValue === null) return 'N/A';
  if (Math.abs(numValue) >= 1) {
    return `$${numValue.toLocaleString(undefined, { minimumFractionDigits: precision, maximumFractionDigits: precision })}`;
  }
   if (numValue === 0) return '$0.00';
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
  const [tokenPools, setTokenPools] = useState<DexScreenerPair[]>([]);
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
      const dexScreenerApi = new DexScreenerClient();

      try {
        const response = await dexScreenerApi.getTokens(address);
        
        if (!response.pairs || response.pairs.length === 0) {
            setError("Token not found on DexScreener.");
            setLoading(false);
            return;
        }

        const sortedPools = response.pairs.sort((a, b) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0));
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

  const tokenInfo = useMemo(() => {
    if (!mostRelevantPool) return null;
    return mostRelevantPool.baseToken;
  }, [mostRelevantPool]);

  const arbitrageOpportunity = useMemo(() => {
    if (tokenPools.length < 2) return null;

    const liquidPools = tokenPools
      .filter(p => p.liquidity?.usd && p.liquidity.usd > 1000)
      .map(p => ({
        dex: p.dexId,
        price: parseFloat(p.priceUsd || '0')
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
      <div className="p-4 md:p-6 space-y-4 max-w-7xl mx-auto">
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                 <Skeleton className="h-96 w-full" />
                 <Skeleton className="h-40 w-full" />
            </div>
            <div className="lg:col-span-1 space-y-6">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500 text-center">{error}</div>;
  }

  if (!tokenInfo || !mostRelevantPool) {
    return <div className="p-4 text-muted-foreground text-center">Token not found or no pools available.</div>;
  }
  
  const totalVolumeH24 = tokenPools.reduce((sum, pool) => sum + (pool.volume?.h24 || 0), 0);
  const totalLiquidity = tokenPools.reduce((sum, pool) => sum + (pool.liquidity?.usd || 0), 0);
  
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <Card>
        <CardHeader>
            <h1 className="text-3xl font-bold">{tokenInfo.name} ({tokenInfo.symbol})</h1>
            <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground break-all">{address}</p>
            <Button variant="ghost" size="icon" onClick={handleCopy} className="h-7 w-7">
                <Copy className="h-4 w-4" />
            </Button>
            </div>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
                <CardTitle>Price Chart (Hourly)</CardTitle>
            </CardHeader>
            <CardContent>
              <GeckoTerminalPriceChart network={mostRelevantPool.chainId} poolAddress={mostRelevantPool.pairAddress} />
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
                      <TableRow key={pool.pairAddress}>
                        <TableCell>
                           {pool.baseToken.symbol}/{pool.quoteToken.symbol}
                        </TableCell>
                        <TableCell className="text-muted-foreground capitalize">{pool.dexId}</TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(pool.priceUsd, 6)}</TableCell>
                        <TableCell className={cn(
                          "text-right",
                          pool.priceChange.h24 >= 0 ? 'text-green-500' : 'text-red-500'
                        )}>
                          {pool.priceChange.h24.toFixed(2)}%
                        </TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(pool.volume.h24, 0)}</TableCell>
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
                      <span className="font-bold">{formatCurrency(mostRelevantPool.priceUsd)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">24h Volume</span>
                      <span className="font-mono">{formatCurrency(totalVolumeH24, 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Liquidity</span>
                      <span className="font-mono">{formatCurrency(totalLiquidity, 0)}</span>
                  </div>
                   <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Market Cap</span>
                      <span className="font-mono">{formatCurrency(mostRelevantPool.marketCap, 0)}</span>
                  </div>
                   <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Website</span>
                      <Button variant="link" size="sm" asChild>
                        <a href={mostRelevantPool.url} target="_blank" rel="noopener noreferrer">
                          View on DexScreener <ExternalLink className="h-3 w-3 ml-1"/>
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
                        <span className="font-mono">{mostRelevantPool.txns.h24.buys.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-red-500 flex items-center gap-2"><TrendingDown/> Sells</span>
                        <span className="font-mono">{mostRelevantPool.txns.h24.sells.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-2">
                        <span className="text-sm text-muted-foreground">Total</span>
                        <span className="font-mono">{(mostRelevantPool.txns.h24.buys + mostRelevantPool.txns.h24.sells).toLocaleString()}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
      <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <HelpCircle />
                Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Apa itu token "degen"?</AccordionTrigger>
                <AccordionContent>
                  Token "degen" adalah istilah slang untuk cryptocurrency yang sangat spekulatif dan berisiko tinggi. Token-token ini seringkali baru, memiliki likuiditas rendah, dan sangat fluktuatif. Berinvestasi di dalamnya bisa menghasilkan keuntungan besar, tetapi juga kerugian total. Lakukan riset Anda sendiri (DYOR).
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Bagaimana cara mengevaluasi risiko?</AccordionTrigger>
                <AccordionContent>
                  Perhatikan metrik-metrik berikut:
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Likuiditas:</strong> Likuiditas yang rendah berarti sulit untuk menjual token dalam jumlah besar tanpa mempengaruhi harganya secara drastis.</li>
                    <li><strong>Volume:</strong> Volume perdagangan yang rendah menunjukkan kurangnya minat. Waspadalah terhadap lonjakan volume yang tiba-tiba dan tidak wajar.</li>
                    <li><strong>Distribusi Holder:</strong> Jika beberapa dompet memegang sebagian besar pasokan, mereka dapat memanipulasi harga. (Alat untuk ini akan segera hadir!)</li>
                    <li><strong>Usia Kontrak:</strong> Kontrak yang sangat baru lebih berisiko.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Apa itu peluang arbitrase?</AccordionTrigger>
                <AccordionContent>
                  Arbitrase adalah praktik membeli aset di satu pasar dan secara bersamaan menjualnya di pasar lain dengan harga lebih tinggi, mengambil keuntungan dari selisih harga. Kartu "Peluang Arbitrase" kami menyoroti ketika harga token ini berbeda secara signifikan di berbagai bursa terdesentralisasi (DEX), tetapi selalu perhitungkan biaya gas dan slippage.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Mengapa data terkadang berbeda antar DEX?</AccordionTrigger>
                <AccordionContent>
                  Perbedaan harga dan volume terjadi karena setiap bursa terdesentralisasi (DEX) memiliki kumpulan likuiditasnya sendiri. Pasar yang tidak efisien atau perdagangan besar di satu DEX dapat menyebabkan perbedaan harga sementara dibandingkan dengan DEX lainnya.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
    </div>
  );
}

    