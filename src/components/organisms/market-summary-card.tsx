
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchMarketData } from '@/lib/coingecko';
import type { MarketAnalysisOutput } from '@/types';
import { analyzeMarketSentiment } from '@/ai/flows/market-analysis-flow';
import { saveMarketSnapshot, hasTodaySnapshot } from '@/lib/actions/snapshots';
import { ScoreGauge } from '../molecules/score-gauge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, CheckCircle, Info, ArrowUpRight } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const indicatorExplanations: Record<string, string> = {
    marketCapScore: "Mengukur valuasi total pasar saat ini terhadap puncak historisnya.",
    volumeScore: "Mengukur aktivitas dan minat pasar berdasarkan volume transaksi harian vs rata-rata.",
    fearGreedScore: "Menggambarkan sentimen emosional pasar, dari rasa takut hingga keserakahan.",
    athScore: "Mengukur seberapa jauh harga aset-aset utama dari All-Time High (ATH) mereka.",
    marketBreadthScore: "Mengukur apakah pergerakan pasar didukung oleh banyak aset (luas) atau hanya segelintir."
};

const getActiveColorClass = (interpretation: string) => {
    const lowerCaseInterpretation = interpretation.toLowerCase();
    if (lowerCaseInterpretation.includes("bearish") || lowerCaseInterpretation.includes("capitulation")) {
        return 'text-destructive';
    }
    if (lowerCaseInterpretation.includes("bullish")) {
        return 'text-chart-2';
    }
    return 'text-muted-foreground';
  };

export function MarketSummaryCard() {
  const [isLoading, setIsLoading] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<MarketAnalysisOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMarketAnalysis = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const marketData = await fetchMarketData();
        
        if (!marketData) {
          throw new Error("Failed to fetch market data from CoinGecko.");
        }
        
        const todaySnapshotExists = await hasTodaySnapshot();
        
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
      { name: "Market Cap Score", key: 'marketCapScore', value: analysisResult.components.marketCapScore },
      { name: "Volume Score", key: 'volumeScore', value: analysisResult.components.volumeScore },
      { name: "Fear & Greed Score", key: 'fearGreedScore', value: analysisResult.components.fearGreedScore },
      { name: "ATH Score", key: 'athScore', value: analysisResult.components.athScore },
      { name: "Market Breadth Score", key: 'marketBreadthScore', value: analysisResult.components.marketBreadthScore },
  ];
  
  const activeColorClass = getActiveColorClass(analysisResult.marketCondition);

  return (
    <Card className="w-full h-full flex flex-col">
        <CardHeader>
             <CardTitle>Macro Sentiment Score</CardTitle>
             <div className="flex items-center gap-4">
                <CardDescription>A macro sentiment score based on 5 key market indicators.</CardDescription>
                <Link href="/learn/market-indicators" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 whitespace-nowrap">
                    Learn more <ArrowUpRight className="h-3 w-3" />
                </Link>
             </div>
        </CardHeader>
        <CardContent className="flex-grow grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-2 flex flex-col items-center justify-center space-y-4">
                 <ScoreGauge score={analysisResult.macroScore} />
                 <div className="flex flex-col items-center gap-1 text-center">
                    <span className={`text-5xl font-bold tracking-tighter ${activeColorClass}`}>
                        {analysisResult.macroScore}
                    </span>
                    <span className={`text-lg font-medium text-center ${activeColorClass}`}>
                        {analysisResult.marketCondition}
                    </span>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Badge variant="secondary" className="mt-2 cursor-help">
                                    <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-chart-2" />
                                    Confidence: {analysisResult.confidenceScore}%
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Confidence in this analysis based on data quality.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
            <div className="md:col-span-3 flex flex-col">
                 <div className="flex-grow">
                    <h3 className="text-lg font-semibold font-headline mb-1">Indicator Breakdown</h3>
                    <p className="text-sm text-muted-foreground mb-4">The individual scores that contribute to the final macro score.</p>
                    <TooltipProvider>
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>Indicator</TableHead>
                                <TableHead className="text-right">Score</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {indicators.map((indicator) => (
                                <TableRow key={indicator.name}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
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
                                <TableCell className="text-right font-mono">{indicator.value}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TooltipProvider>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
