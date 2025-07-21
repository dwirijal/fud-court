'use client';

import { useEffect, useState } from 'react';
import { CoinGeckoAPI } from '@/lib/api-clients/crypto/coinGecko';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton component

interface GlobalMarketData {
  active_cryptocurrencies: number;
  markets: number;
  total_market_cap: { [key: string]: number };
  total_volume: { [key: string]: number };
  market_cap_percentage: { [key: string]: number };
  market_cap_change_percentage_24h_usd: number;
  updated_at: number;
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Active Cryptocurrencies</h2>
          <p className="text-xl">{globalData.active_cryptocurrencies.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Market Cap (USD)</h2>
          <p className="text-xl">${globalData.total_market_cap.usd.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">24h Trading Volume (USD)</h2>
          <p className="text-xl">${globalData.total_volume.usd.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Market Cap Change (24h)</h2>
          <p className={`text-xl ${globalData.market_cap_change_percentage_24h_usd >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {globalData.market_cap_change_percentage_24h_usd.toFixed(2)}%
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Bitcoin Dominance</h2>
          <p className="text-xl">{globalData.market_cap_percentage.btc.toFixed(2)}%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Ethereum Dominance</h2>
          <p className="text-xl">{globalData.market_cap_percentage.eth.toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
}