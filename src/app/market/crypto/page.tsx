'use client';

import { HeroSection } from '@/components/shared/HeroSection';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/utils';
import { Progress } from '@/components/ui/progress';
import { FearGreedClient, FearGreedData } from '@/lib/api-clients/alternative/fearGreed';


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

export default function CryptoPage() {
  return (
    <>
        <HeroSection
        title="Pasar Kripto"
        description="Analisis mendalam, harga real-time, dan data untuk dunia cryptocurrency."
        />
        <div className="p-6 max-w-sm mx-auto">
            <FearGreedWidget />
        </div>
    </>
  );
}
