
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchMarketData } from '@/lib/coingecko';
import type { MarketAnalysisOutput } from '@/types';
import { analyzeMarketSentiment } from '@/ai/flows/market-analysis-flow';
import { saveMarketSnapshot, hasTodaySnapshot } from '@/lib/actions/snapshots';
import { ScoreGauge } from '../molecules/score-gauge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, CheckCircle, Info, Minus } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TrendIcon } from '@/components/ui/TrendIcon';
import { TrendChange } from '@/components/ui/TrendChange';


const indicatorExplanations: Record<string, string> = {
    marketCapScore: "Mengukur valuasi total pasar saat ini terhadap puncak historisnya.",
    volumeScore: "Mengukur aktivitas dan minat pasar berdasarkan volume transaksi harian vs rata-rata.",
    fearGreedScore: "Menggambarkan sentimen emosional pasar, dari rasa takut hingga keserakahan.",
    athScore: "Mengukur seberapa jauh harga aset-aset utama dari All-Time High (ATH) mereka.",
    marketBreadthScore: "Mengukur apakah pergerakan pasar didukung oleh banyak aset (luas) atau hanya segelintir."
};

export function MarketSummaryCard() {
  const [isLoading, setIsLoading] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<MarketAnalysisOutput | null>(null);
  const [fearGreedDelta, setFearGreedDelta] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMarketAnalysis = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // This function now returns a combined object with all necessary data
        const marketData = await fetchMarketData();
        
        if (!marketData) {
          throw new Error("Failed to fetch market data from CoinGecko.");
        }
        
        const todaySnapshotExists = await hasTodaySnapshot();
        
        // The fear & greed data is now fetched within fetchMarketData
        // but we need to calculate the delta if we get historical data
        // For now, we assume this logic will be more complex and is handled elsewhere
        // setFearGreedDelta(fearGreedData.today.value - fearGreedData.weekAgo.value);

        const result = await analyzeMarketSentiment(marketData);
        setAnalysisResult(result);

        if (result && !todaySnapshotExists) {
            await saveMarketSnapshot(result);
        }

      } catch (e) {
        console.error("Market analysis failed:", e);
        const message = e instanceof Error ? e.message : "An unknown error occurred.";
        setError(message);
        setAnalysisResult(null);
      } finally {
        setIsLoading(false);
      }
    };

    getMarketAnalysis();
  }, []);

  if (isLoading) {
    return <Skeleton className="h-[450px] w-full" />;
  }

  if (error || !analysisResult) {
    return (
      <Card className="flex flex-col items-center justify-center p-6 bg-destructive/10 border-destructive min-h-[400px]">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <CardTitle className="text-2xl font-headline text-destructive">Analysis Failed</CardTitle>
          <CardDescription className="text-destructive/80 mt-2 text-center max-w-md">
            {error || "An unknown error occurred while analyzing market sentiment."}
          </CardDescription>
      </Card>
    );
  }

  const indicators = [
      { name: "Market Cap Score", key: 'marketCapScore', value: analysisResult.components.marketCapScore, trend: null },
      { name: "Volume Score", key: 'volumeScore', value: analysisResult.components.volumeScore, trend: null },
      { name: "Fear & Greed Score", key: 'fearGreedScore', value: analysisResult.components.fearGreedScore, trend: fearGreedDelta },
      { name: "ATH Score", key: 'athScore', value: analysisResult.components.athScore, trend: null },
      { name: "Market Breadth Score", key: 'marketBreadthScore', value: analysisResult.components.marketBreadthScore, trend: null },
  ];

  return (
    <div className="grid grid-cols-1 gap-8 items-stretch h-full">
      <div className="lg:col-span-1">
        <ScoreGauge 
            score={analysisResult.macroScore} 
            interpretation={analysisResult.marketCondition}
            summary="A macro sentiment score based on 5 key market indicators."
        />
      </div>
      
      <div className="lg:col-span-2">
        <Card className="bg-card/60 backdrop-blur-md h-full flex flex-col">
            <CardHeader>
            <CardTitle>Indicator Breakdown</CardTitle>
            <CardDescription>The individual scores that contribute to the final macro score.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
            <TooltipProvider>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Indicator</TableHead>
                        <TableHead className="text-right">Perubahan (7d)</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {indicators.map((indicator) => (
                        <TableRow key={indicator.name}>
                        <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-chart-2" />
                                <span>{indicator.name}</span>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button>
                                            <Info className="h-3.5 w-3.5 text-muted-foreground/70" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                        <p>{indicatorExplanations[indicator.key]}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </TableCell>
                         <TableCell>
                            <div className="flex items-center justify-end gap-2">
                                <TrendIcon change={indicator.trend} />
                                <TrendChange change={indicator.trend} />
                            </div>
                        </TableCell>
                        <TableCell className="text-right font-mono">{indicator.value}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TooltipProvider>
            </CardContent>
             <CardFooter>
                <Link href="/learn/market-indicators" className="text-sm text-primary hover:underline">
                    Learn more about these indicators
                </Link>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
