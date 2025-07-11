
'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchMarketData } from '@/lib/coingecko';
import type { MarketAnalysisInput } from '@/types';
import { FearGreedGauge } from '../molecules/fear-greed-gauge';
import { MarketDominancePieChart } from '../molecules/market-dominance-pie-chart';

export function MarketSummaryCard() {
  const [isLoading, setIsLoading] = useState(true);
  const [marketData, setMarketData] = useState<MarketAnalysisInput | null>(null);

  useEffect(() => {
    const getMarketData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchMarketData();
        setMarketData(data);
      } catch (e) {
        console.error("Market data fetch failed:", e);
        // We set marketData to null but don't set an error state
        // to allow the component to render with a "no data" message if needed.
        setMarketData(null);
      } finally {
        setIsLoading(false);
      }
    };

    getMarketData();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!marketData) {
    // This renders if the fetch failed, providing a graceful fallback
    // instead of a jarring error message.
    return (
      <div className="text-center text-muted-foreground py-12">
        <p>Could not load market data at this time. Please try again later.</p>
      </div>
    );
  }
  
  const totalMarketCapFormatted = `$${(marketData.totalMarketCap / 1_000_000_000_000).toFixed(2)}T`;
  const ethDominance = (marketData.altcoinMarketCap - (marketData.totalMarketCap - marketData.btcMarketCap - marketData.altcoinMarketCap)) / marketData.totalMarketCap * 100;
  
  const dominanceData = [
    { name: 'btc' as const, dominance: marketData.btcDominance, value: totalMarketCapFormatted },
    { name: 'eth' as const, dominance: ethDominance, value: '' },
    { name: 'others' as const, dominance: 100 - marketData.btcDominance - ethDominance, value: '' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
      <FearGreedGauge 
        value={marketData.fearAndGreedIndex} 
        classification={
          marketData.fearAndGreedIndex > 65 ? 'Greed' : 
          marketData.fearAndGreedIndex < 35 ? 'Fear' : 'Neutral'
        } 
      />
      <MarketDominancePieChart 
        data={dominanceData}
        totalMarketCap={totalMarketCapFormatted}
      />
    </div>
  );
}
