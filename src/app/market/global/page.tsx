'use client';

import { useEffect, useState } from 'react';
import { CoinGeckoAPI } from '@/lib/api-clients/crypto/coinGecko';
import { FearGreedClient, FearGreedData } from '@/lib/api-clients/alternative/fearGreed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/utils';
import { Progress } from '@/components/ui/progress';

interface GlobalMarketData {
  active_cryptocurrencies: number;
  markets: number;
  total_market_cap: { [key: string]: number };
  total_volume: { [key: string]: number };
  market_cap_percentage: { [key: string]: number };
  market_cap_change_percentage_24h_usd: number;
  updated_at: number;
}

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
                <motion.div 
                    className="text-5xl font-bold mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 150, delay: 0.2 }}
                >
                    {fearGreedData.value}
                </motion.div>
                <Progress 
                    value={numericValue} 
                    className="mt-4 h-3 bg-white/20" 
                />
                 <p className="text-xs opacity-90 mt-2">Next update in: {fearGreedData.time_until_update ? `${Math.floor(parseInt(fearGreedData.time_until_update, 10) / 3600)}h ${Math.floor((parseInt(fearGreedData.time_until_update, 10) % 3600) / 60)}m` : 'N/A'}</p>
            </CardContent>
        </Card>
      )
}

export default function GlobalMarketOverviewPage() {
  const [globalData, setGlobalData] = useState<GlobalMarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        const coinGecko = new CoinGeckoAPI();
        const data = await coinGecko.getGlobal();
        setGlobalData(data.data);
      } catch (err) {
        setError('Failed to fetch global market data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalData();
  }, []);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (loading || !globalData) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Global Market Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="p-4 rounded-lg shadow">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-8 w-1/2" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Global Market Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-muted-foreground">Active Cryptos</h2>
            <p className="text-2xl font-bold">{globalData.active_cryptocurrencies.toLocaleString()}</p>
        </Card>
        <Card className="p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-muted-foreground">Total Market Cap</h2>
          <p className="text-2xl font-bold">${globalData.total_market_cap.usd.toLocaleString()}</p>
        </Card>
        <Card className="p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-muted-foreground">24h Volume</h2>
          <p className="text-2xl font-bold">${globalData.total_volume.usd.toLocaleString()}</p>
        </Card>
        <Card className="p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-muted-foreground">Market Cap Change (24h)</h2>
          <p className={`text-2xl font-bold ${globalData.market_cap_change_percentage_24h_usd >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {globalData.market_cap_change_percentage_24h_usd.toFixed(2)}%
          </p>
        </Card>
        <Card className="p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-muted-foreground">BTC Dominance</h2>
          <p className="text-2xl font-bold">{globalData.market_cap_percentage.btc.toFixed(2)}%</p>
        </Card>
        <Card className="p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-muted-foreground">ETH Dominance</h2>
          <p className="text-2xl font-bold">{globalData.market_cap_percentage.eth.toFixed(2)}%</p>
        </Card>
         <div className="lg:col-span-2">
           <FearGreedWidget />
         </div>
      </div>
    </div>
  );
}
