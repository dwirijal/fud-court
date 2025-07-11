
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchMarketData } from '@/lib/coingecko';
import type { MarketAnalysisOutput } from '@/types';
import { analyzeMarketSentiment } from '@/ai/flows/market-analysis-flow';
import { saveMarketSnapshot, hasTodaySnapshot } from '@/lib/actions/snapshots';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Info, ArrowUpRight } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

const indicatorExplanations: Record<string, string> = {
    marketCapScore: "Measures the current total market valuation against its historical peak.",
    volumeScore: "Measures market activity and interest based on daily volume vs. average.",
    fearGreedScore: "Represents the emotional sentiment of the market, from fear to greed.",
    athScore: "Measures how far major assets are from their All-Time Highs (ATH).",
    marketBreadthScore: "Measures if market movement is supported by many assets or just a few."
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

const getProgressColorClass = (score: number) => {
    if (score < 40) return 'bg-destructive';
    if (score > 60) return 'bg-chart-2';
    return 'bg-muted-foreground';
}


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
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full" />
            ))}
        </div>
    );
  }

  if (error || !analysisResult) {
    return (
      <Card className="flex flex-col items-center justify-center p-6 bg-destructive/10 border-destructive">
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
    <div className="space-y-4">
        <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="flex-row items-center justify-between">
                 <div>
                    <CardTitle className="text-xl">Macro Sentiment Score</CardTitle>
                    <CardDescription>
                        Overall market health based on key indicators.
                    </CardDescription>
                </div>
                 <div className="text-right">
                    <p className={cn("text-4xl font-bold", activeColorClass)}>{analysisResult.macroScore}</p>
                    <p className={cn("font-semibold", activeColorClass)}>{analysisResult.marketCondition}</p>
                </div>
            </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TooltipProvider>
                {indicators.map((indicator) => (
                    <Card key={indicator.name}>
                        <CardHeader className="pb-2">
                             <CardDescription className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    {indicator.name}
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
                                </span>
                            </CardDescription>
                            <CardTitle className="text-3xl font-mono">{indicator.value}</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <Progress value={indicator.value} indicatorClassName={getProgressColorClass(indicator.value)} />
                        </CardContent>
                    </Card>
                ))}
            </TooltipProvider>

            <Card className="flex flex-col justify-center">
                <CardContent className="pt-6 text-center">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Badge variant="secondary" className="cursor-help mb-2">
                                    <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-chart-2" />
                                    Confidence: {analysisResult.confidenceScore}%
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Confidence in this analysis based on data quality.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <Link href="/learn/market-indicators" className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-1">
                        Learn more about indicators <ArrowUpRight className="h-3 w-3" />
                    </Link>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
