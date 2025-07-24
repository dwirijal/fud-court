
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, Minus, AlertCircle, DollarSign, Activity, BarChart3, PieChart, Globe, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart as RechartsPieChart, Cell } from 'recharts';


// Types
interface EconomicData {
  value: number;
  date: string;
  change?: number;
  changePercent?: number;
}

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

interface DeFiProtocol {
  name: string;
  tvl: number;
  change_1d: number;
  chains: string[];
}

interface MarketSentiment {
  value: number;
  value_classification: string;
}

// Mock data generators (replace with real API calls)
const generateMockEconomicData = (baseValue: number, volatility: number = 0.1): EconomicData[] => {
  const data = [];
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const change = (Math.random() - 0.5) * volatility * baseValue;
    data.push({
      value: baseValue + change,
      date: date.toISOString().split('T')[0],
      change: change,
      changePercent: (change / baseValue) * 100
    });
  }
  return data;
};

const mockCryptoData: CryptoData[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', current_price: 43250, price_change_percentage_24h: 2.5, market_cap: 845000000000, total_volume: 15000000000 },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', current_price: 2650, price_change_percentage_24h: -1.2, market_cap: 318000000000, total_volume: 8500000000 },
  { id: 'binancecoin', name: 'BNB', symbol: 'BNB', current_price: 315, price_change_percentage_24h: 0.8, market_cap: 47000000000, total_volume: 1200000000 },
  { id: 'solana', name: 'Solana', symbol: 'SOL', current_price: 98, price_change_percentage_24h: 4.2, market_cap: 45000000000, total_volume: 2100000000 }
];

const mockDefiData: DeFiProtocol[] = [
  { name: 'Lido', tvl: 32500000000, change_1d: 1.5, chains: ['Ethereum', 'Solana'] },
  { name: 'AAVE', tvl: 12800000000, change_1d: -0.8, chains: ['Ethereum', 'Polygon'] },
  { name: 'Uniswap', tvl: 5200000000, change_1d: 2.1, chains: ['Ethereum', 'Polygon', 'Arbitrum'] },
  { name: 'Compound', tvl: 3100000000, change_1d: 0.3, chains: ['Ethereum'] }
];

// Utility functions
const formatValue = (value: number, type: 'currency' | 'percent' | 'number' = 'number'): string => {
  if (isNaN(value)) return 'N/A';
  
  switch (type) {
    case 'currency':
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(value);
    case 'percent':
      return `${value.toFixed(2)}%`;
    default:
      return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }
};

const getTrendIcon = (change: number) => {
  if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
  if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-gray-500" />;
};

const getTrendColor = (change: number) => {
  if (change > 0) return 'text-green-500';
  if (change < 0) return 'text-red-500';
  return 'text-gray-500';
};

// Components
const MetricCard = ({ title, value, change, icon: Icon, loading = false, type = 'number' }: {
  title: string;
  value: number;
  change?: number;
  icon: React.ComponentType<any>;
  loading?: boolean;
  type?: 'currency' | 'percent' | 'number';
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium"><Skeleton className="h-4 w-24" /></CardTitle>
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-4 w-16 mt-1" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value, type)}</div>
        {change !== undefined && (
          <div className={`flex items-center text-xs ${getTrendColor(change)}`}>
            {getTrendIcon(change)}
            <span className="ml-1">{formatValue(Math.abs(change), 'percent')}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ChartCard = ({ title, data, dataKey, color = '#8884d8', type = 'line' }: {
  title: string;
  data: any[];
  dataKey: string;
  color?: string;
  type?: 'line' | 'area';
}) => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {type === 'area' ? (
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.6} />
              </AreaChart>
            ) : (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const CryptoTable = ({ data, loading }: { data: CryptoData[]; loading: boolean }) => {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-700">Asset</th>
            <th className="text-right py-3 px-4 font-medium text-gray-700">Price</th>
            <th className="text-right py-3 px-4 font-medium text-gray-700">24h Change</th>
            <th className="text-right py-3 px-4 font-medium text-gray-700">Market Cap</th>
            <th className="text-right py-3 px-4 font-medium text-gray-700">Volume</th>
          </tr>
        </thead>
        <tbody>
          {data.map(crypto => (
            <tr key={crypto.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 font-medium">
                <div className="flex items-center space-x-2">
                  <span className="font-bold">{crypto.symbol.toUpperCase()}</span>
                  <span className="text-gray-500">{crypto.name}</span>
                </div>
              </td>
              <td className="text-right py-3 px-4 font-mono">{formatValue(crypto.current_price, 'currency')}</td>
              <td className={`text-right py-3 px-4 font-mono ${getTrendColor(crypto.price_change_percentage_24h)}`}>
                {formatValue(crypto.price_change_percentage_24h, 'percent')}
              </td>
              <td className="text-right py-3 px-4 font-mono">{formatValue(crypto.market_cap, 'currency')}</td>
              <td className="text-right py-3 px-4 font-mono">{formatValue(crypto.total_volume, 'currency')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DefiTable = ({ data, loading }: { data: DeFiProtocol[]; loading: boolean }) => {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-700">Protocol</th>
            <th className="text-right py-3 px-4 font-medium text-gray-700">TVL</th>
            <th className="text-right py-3 px-4 font-medium text-gray-700">24h Change</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Chains</th>
          </tr>
        </thead>
        <tbody>
          {data.map(protocol => (
            <tr key={protocol.name} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 font-medium">{protocol.name}</td>
              <td className="text-right py-3 px-4 font-mono">{formatValue(protocol.tvl, 'currency')}</td>
              <td className={`text-right py-3 px-4 font-mono ${getTrendColor(protocol.change_1d)}`}>
                {formatValue(protocol.change_1d, 'percent')}
              </td>
              <td className="py-3 px-4">
                <div className="flex flex-wrap gap-1">
                  {protocol.chains.slice(0, 2).map(chain => (
                    <span key={chain} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {chain}
                    </span>
                  ))}
                  {protocol.chains.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{protocol.chains.length - 2}
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Main Dashboard Component
export default function MacroDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Economic Data
  const [gdpData, setGdpData] = useState<EconomicData[]>([]);
  const [inflationData, setInflationData] = useState<EconomicData[]>([]);
  const [unemploymentData, setUnemploymentData] = useState<EconomicData[]>([]);
  const [fedRateData, setFedRateData] = useState<EconomicData[]>([]);
  
  // Crypto Data
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [defiData, setDefiData] = useState<DeFiProtocol[]>([]);
  const [sentiment, setSentiment] = useState<MarketSentiment>({ value: 50, value_classification: 'Neutral' });

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Simulate API calls with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set mock economic data
      setGdpData(generateMockEconomicData(2.1, 0.1));
      setInflationData(generateMockEconomicData(3.2, 0.2));
      setUnemploymentData(generateMockEconomicData(3.7, 0.1));
      setFedRateData(generateMockEconomicData(5.25, 0.1));
      
      // Set crypto data
      setCryptoData(mockCryptoData);
      setDefiData(mockDefiData);
      setSentiment({ value: 72, value_classification: 'Greed' });
      
    } catch (err) {
      setError('Failed to load data from APIs');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const latestGDP = gdpData[gdpData.length - 1];
  const latestInflation = inflationData[inflationData.length - 1];
  const latestUnemployment = unemploymentData[unemploymentData.length - 1];
  const latestFedRate = fedRateData[fedRateData.length - 1];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Macro Economic Dashboard</h1>
        <p className="text-gray-600">Real-time economic indicators, cryptocurrency markets, and DeFi protocols</p>
      </div>

      {/* Key Economic Indicators */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard
          title="GDP Growth (YoY)"
          value={latestGDP?.value || 0}
          change={latestGDP?.changePercent}
          icon={BarChart3}
          loading={loading}
          type="percent"
        />
        <MetricCard
          title="Inflation Rate"
          value={latestInflation?.value || 0}
          change={latestInflation?.changePercent}
          icon={TrendingUp}
          loading={loading}
          type="percent"
        />
        <MetricCard
          title="Unemployment Rate"
          value={latestUnemployment?.value || 0}
          change={latestUnemployment?.changePercent}
          icon={Activity}
          loading={loading}
          type="percent"
        />
        <MetricCard
          title="Fed Funds Rate"
          value={latestFedRate?.value || 0}
          change={latestFedRate?.changePercent}
          icon={DollarSign}
          loading={loading}
          type="percent"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <ChartCard
          title="GDP Growth Trend"
          data={gdpData}
          dataKey="value"
          color="#10b981"
        />
        <ChartCard
          title="Inflation vs Fed Rate"
          data={inflationData.map((item, index) => ({
            ...item,
            fedRate: fedRateData[index]?.value || 0
          }))}
          dataKey="value"
          color="#ef4444"
          type="area"
        />
      </div>

      {/* Market Sentiment */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Fear & Greed Index
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{sentiment.value}</div>
            <div className={`text-sm font-medium ${sentiment.value > 50 ? 'text-green-600' : 'text-red-600'}`}>
              {sentiment.value_classification}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div
                className={`h-2 rounded-full ${sentiment.value > 50 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${sentiment.value}%` }}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Crypto Market Cap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatValue(cryptoData.reduce((sum, crypto) => sum + crypto.market_cap, 0), 'currency')}
            </div>
            <div className="text-sm text-muted-foreground mt-1">24h Volume: {formatValue(cryptoData.reduce((sum, crypto) => sum + crypto.total_volume, 0), 'currency')}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total DeFi TVL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatValue(defiData.reduce((sum, protocol) => sum + protocol.tvl, 0), 'currency')}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Across {defiData.length} protocols</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Top Cryptocurrencies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CryptoTable data={cryptoData} loading={loading} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Top DeFi Protocols
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DefiTable data={defiData} loading={loading} />
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Data sources: FRED API, CoinGecko, DeFiLlama, Alternative.me</p>
        <p>Last updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}
