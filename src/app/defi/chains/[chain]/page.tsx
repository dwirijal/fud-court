'use client';

import { useEffect, useState, use } from 'react';
import { DefiLlamaClient, ChainTVL } from '@/lib/api-clients/crypto/defiLlama';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Activity, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

interface ChainDetailPageProps {
  params: { chain: string };
}

interface ChainData {
  name: string;
  tvl: number;
  change_1d?: number;
  change_7d?: number;
  change_1m?: number;
  mcap?: number;
  symbol?: string;
}

interface FormattedTVLData {
  date: string;
  timestamp: number;
  tvl: number;
  formattedDate: string;
}

export default function ChainDetailPage({ params }: ChainDetailPageProps) {
  const { chain } = use(params); // Unwrap the params Promise
  const [chainTVL, setChainTVL] = useState<ChainTVL[] | null>(null);
  const [chainInfo, setChainInfo] = useState<ChainData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Format chain name for display
  const chainName = chain.charAt(0).toUpperCase() + chain.slice(1).replace(/-/g, ' ');

  // Process and filter TVL data based on time range
  const processedTVLData = useMemo<FormattedTVLData[]>(() => {
    if (!chainTVL) return [];

    const now = Date.now();
    const timeRanges = {
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
      '1y': 365 * 24 * 60 * 60 * 1000,
    };

    const cutoffTime = now - timeRanges[timeRange];

    return chainTVL
      .filter(entry => entry.date * 1000 >= cutoffTime)
      .map(entry => ({
        date: new Date(entry.date * 1000).toISOString().split('T')[0],
        timestamp: entry.date,
        tvl: entry.tvl,
        formattedDate: new Date(entry.date * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: timeRange === '1y' ? 'numeric' : undefined
        })
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [chainTVL, timeRange]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!processedTVLData.length) return null;

    const currentTVL = processedTVLData[processedTVLData.length - 1]?.tvl || 0;
    const previousTVL = processedTVLData[0]?.tvl || 0;
    const change = currentTVL - previousTVL;
    const changePercent = previousTVL !== 0 ? (change / previousTVL) * 100 : 0;

    const maxTVL = Math.max(...processedTVLData.map(d => d.tvl));
    const minTVL = Math.min(...processedTVLData.map(d => d.tvl));

    return {
      current: currentTVL,
      change,
      changePercent,
      max: maxTVL,
      min: minTVL,
      dataPoints: processedTVLData.length
    };
  }, [processedTVLData]);

  useEffect(() => {
    const fetchChainData = async () => {
      if (!chain) return; // Don't fetch if chain is not available yet
      
      try {
        setLoading(true);
        setError(null);
        
        const defiLlama = new DefiLlamaClient();
        
        // Fetch both TVL history and current chain info in parallel
        const [tvlData, chainsData] = await Promise.all([
          defiLlama.getChainTVL(chain).catch(() => null),
          defiLlama.getChains().catch(() => [])
        ]);

        if (tvlData && tvlData.length > 0) {
          setChainTVL(tvlData);
        }

        // Find current chain info
        const currentChain = chainsData.find((c: any) => 
          c.name.toLowerCase() === chain.toLowerCase() ||
          c.gecko_id === chain ||
          c.chainId === chain
        );

        if (currentChain) {
          setChainInfo(currentChain);
        }

      } catch (err) {
        console.error('Error fetching chain data:', err);
        setError('Failed to fetch chain data. Please check the chain name and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchChainData();
  }, [chain]);

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  const formatTooltipValue = (value: number) => {
    return formatCurrency(value);
  };

  if (loading || !chain) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!chainTVL || chainTVL.length === 0) {
    return (
      <div className="p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No TVL data available for {chainName}. This chain might not be supported or the name might be incorrect.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{chainName}</h1>
          <p className="text-gray-600 mt-1">Total Value Locked Analysis</p>
        </div>
        {chainInfo?.symbol && (
          <div className="text-right">
            <div className="text-sm text-gray-500">Token Symbol</div>
            <div className="text-lg font-semibold">{chainInfo.symbol}</div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current TVL</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats ? formatCurrency(stats.current) : 'N/A'}</div>
            {stats && stats.changePercent !== 0 && (
              <div className={`flex items-center text-sm ${stats.changePercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.changePercent > 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(stats.changePercent).toFixed(2)}% ({timeRange})
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak TVL</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats ? formatCurrency(stats.max) : 'N/A'}</div>
            <p className="text-xs text-muted-foreground">Highest in selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Protocols</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chainInfo?.protocols || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">Active protocols</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Points</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.dataPoints || 0}</div>
            <p className="text-xs text-muted-foreground">Historical records</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>TVL Trend</CardTitle>
            <div className="flex space-x-2">
              {(['7d', '30d', '90d', '1y'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-sm rounded ${
                    timeRange === range
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer>
              <AreaChart data={processedTVLData}>
                <defs>
                  <linearGradient id="colorTVL" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="formattedDate"
                  fontSize={12}
                  tick={{ fontSize: 11 }}
                />
                <YAxis 
                  tickFormatter={formatCurrency}
                  fontSize={12}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip 
                  formatter={(value: number) => [formatTooltipValue(value), 'TVL']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="tvl"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTVL)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Historical Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent TVL History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">TVL (USD)</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedTVLData
                  .slice(-10)
                  .reverse()
                  .map((entry, index) => {
                    const prevEntry = processedTVLData[processedTVLData.length - 1 - index - 1];
                    const change = prevEntry ? entry.tvl - prevEntry.tvl : 0;
                    const changePercent = prevEntry && prevEntry.tvl !== 0 ? (change / prevEntry.tvl) * 100 : 0;
                    
                    return (
                      <TableRow key={entry.timestamp}>
                        <TableCell className="font-medium">
                          {new Date(entry.timestamp * 1000).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(entry.tvl)}
                        </TableCell>
                        <TableCell className={`text-right font-mono ${
                          change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {prevEntry ? (
                            <>
                              {change > 0 ? '+' : ''}{formatCurrency(change)}
                              <div className="text-xs opacity-70">
                                ({changePercent > 0 ? '+' : ''}{changePercent.toFixed(2)}%)
                              </div>
                            </>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
