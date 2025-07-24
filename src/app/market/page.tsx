
'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeroSection } from '@/components/shared/HeroSection';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchFredData, type MetricData } from './global/actions';
import { TrendingUp, TrendingDown, Minus, DollarSign, Percent, Droplet, Fuel } from 'lucide-react';
import { FearGreedClient, FearGreedData } from '@/lib/api-clients/alternative/fearGreed';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils/utils';

const kpiIndicators = [
    { id: 'SP500', title: 'S&P 500', units: 'Index' },
    { id: 'GS10', title: '10-Yr Treasury Yield', units: 'Percent' },
    { id: 'DCOILWTICO', title: 'Crude Oil (WTI)', units: 'Dollars per Barrel' },
    { id: 'GOLDAMGBD228NLBM', title: 'Gold Price', units: 'Dollars per Troy Ounce' },
];

const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
};

const getIconForMetric = (id: string) => {
    switch (id) {
        case 'SP500': return <TrendingUp className="h-4 w-4 text-muted-foreground" />;
        case 'GS10': return <Percent className="h-4 w-4 text-muted-foreground" />;
        case 'DCOILWTICO': return <Fuel className="h-4 w-4 text-muted-foreground" />;
        case 'GOLDAMGBD228NLBM': return <Droplet className="h-4 w-4 text-muted-foreground" />;
        default: return <DollarSign className="h-4 w-4 text-muted-foreground" />;
    }
}

const MetricCard = ({ title, data, id, loading }: { title: string; data?: MetricData; id: string, loading: boolean; }) => {
    if (loading || !data) {
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
                {getIconForMetric(id)}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{data.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                    {getTrendIcon(data.trend)}
                    <span className="ml-1">from {new Date(data.date).toLocaleDateString()}</span>
                </div>
            </CardContent>
        </Card>
    );
};


const FearGreedWidget = () => {
    const [fearGreedData, setFearGreedData] = useState<FearGreedData | null>(null);

    useEffect(() => {
        const fetchFearGreedData = async () => {
          try {
            const client = new FearGreedClient();
            const response = await client.getFearAndGreedIndex({ limit: 1 });
            if (response.data && response.data.length > 0) {
              setFearGreedData(response.data[0]);
            }
          } catch (err) {
            console.error('Failed to fetch Fear & Greed Index data.', err);
          }
        };
        fetchFearGreedData();
      }, []);

      const getClassificationColor = (classification: string | undefined) => {
        switch (classification) {
          case 'Extreme Fear': return 'bg-red-700 text-white';
          case 'Fear': return 'bg-orange-500 text-white';
          case 'Neutral': return 'bg-yellow-500 text-black';
          case 'Greed': return 'bg-green-500 text-white';
          case 'Extreme Greed': return 'bg-green-700 text-white';
          default: return 'bg-gray-500 text-white';
        }
      };
    
      if (!fearGreedData) {
        return (
          <Card>
            <CardHeader>
              <CardTitle>Fear & Greed Index</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        );
      }
    
      const numericValue = parseInt(fearGreedData.value, 10);
      const colors = getClassificationColor(fearGreedData.value_classification);

      return (
        <Card className={cn("relative overflow-hidden text-center", colors)}>
            <CardHeader>
                <CardTitle>{fearGreedData.value_classification}</CardTitle>
            </CardHeader>
            <CardContent>
                <div 
                    className="text-5xl font-bold mb-2"
                >
                    {fearGreedData.value}
                </div>
                <Progress 
                    value={numericValue} 
                    className="mt-4 h-3 bg-white/20" 
                />
                 <p className="text-xs opacity-90 mt-2">Next update in: {fearGreedData.time_until_update ? `${Math.floor(parseInt(fearGreedData.time_until_update, 10) / 3600)}h ${Math.floor((parseInt(fearGreedData.time_until_update, 10) % 3600) / 60)}m` : 'N/A'}</p>
            </CardContent>
        </Card>
      )
}

export default function MarketPage() {
  const [kpiData, setKpiData] = useState<Record<string, MetricData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        try {
            setLoading(true);
            const data = await fetchFredData(kpiIndicators);
            setKpiData(data);
        } catch (error) {
            console.error("Failed to fetch market KPIs:", error);
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, []);

  const marketSections = [
    {
      href: '/market/global',
      title: 'Global Economic Dashboard',
      description: 'View in-depth global macroeconomic data and indicators.',
    },
    {
      href: '/coins',
      title: 'Cryptocurrency Explorer',
      description: 'Explore detailed data for all cryptocurrencies.',
    },
    {
      href: '/degen/trending',
      title: 'Degen Zone',
      description: 'Discover trending pairs and new listings in the DEX world.',
    },
  ];

  return (
    <>
      <HeroSection
        title="Market Dashboard"
        description="A snapshot of key financial and crypto market indicators."
      />
      <div className="p-4 md:p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-1">
                <FearGreedWidget />
            </div>
            {kpiIndicators.map(indicator => (
                <MetricCard 
                    key={indicator.id}
                    id={indicator.id}
                    title={indicator.title}
                    data={kpiData[indicator.id]}
                    loading={loading}
                />
            ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marketSections.map((section) => (
            <Link href={section.href} key={section.href}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
