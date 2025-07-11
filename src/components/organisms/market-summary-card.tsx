
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchMarketData } from '@/lib/coingecko';
import type { MarketAnalysisOutput } from '@/types';
import { analyzeMarketSentiment } from '@/ai/flows/market-analysis-flow';
import { saveMarketSnapshot, hasTodaySnapshot } from '@/lib/actions/snapshots';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Info, ArrowUpRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const indicatorExplanations: Record<string, string> = {
    marketCapScore: "Measures current market valuation against its historical peak.",
    volumeScore: "Measures market activity based on daily vs. average volume.",
    fearGreedScore: "Represents the emotional sentiment of the market.",
    athScore: "Measures how far major assets are from their All-Time Highs.",
    marketBreadthScore: "Measures if movement is supported by many assets or just a few."
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
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                ))}
            </CardContent>
        </Card>
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
      { name: "Market Cap Score", value: analysisResult.components.marketCapScore, description: indicatorExplanations.marketCapScore },
      { name: "Volume Score", value: analysisResult.components.volumeScore, description: indicatorExplanations.volumeScore },
      { name: "Fear & Greed Score", value: analysisResult.components.fearGreedScore, description: indicatorExplanations.fearGreedScore },
      { name: "ATH Score", value: analysisResult.components.athScore, description: indicatorExplanations.athScore },
      { name: "Market Breadth Score", value: analysisResult.components.marketBreadthScore, description: indicatorExplanations.marketBreadthScore },
  ];
  
  const activeColorClass = getActiveColorClass(analysisResult.marketCondition);

  return (
    <TooltipProvider>
        <Card>
            <CardContent className="space-y-4 p-6">
                <Card className="bg-primary/5 border-primary/20 overflow-hidden text-center">
                    <CardHeader>
                        <CardTitle>Macro Sentiment Score</CardTitle>
                        <CardDescription>
                            Overall market health based on key indicators.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className={cn("text-6xl font-bold tracking-tighter", activeColorClass)}>{analysisResult.macroScore}</p>
                        <p className={cn("font-semibold text-xl", activeColorClass)}>{analysisResult.marketCondition}</p>
                    </CardContent>
                    <CardFooter className="justify-center">
                         <Badge variant="secondary" className="cursor-help flex-shrink-0">
                            <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-chart-2" />
                            Confidence: {analysisResult.confidenceScore}%
                        </Badge>
                    </CardFooter>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {indicators.map((indicator) => (
                         <Card key={indicator.name} className="p-4 flex flex-col justify-between">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-grow space-y-1">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="flex items-center gap-1.5 cursor-help">
                                                <p className="text-sm font-semibold">{indicator.name}</p>
                                                <Info className="h-3 w-3 text-muted-foreground" />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="max-w-xs">{indicator.description}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <CardDescription className="text-xs">{indicator.description}</CardDescription>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-2xl font-mono font-bold">{indicator.value}</p>
                                </div>
                            </div>
                            <Progress value={indicator.value} className="mt-2" indicatorClassName={cn(getProgressColorClass(indicator.value))} />
                        </Card>
                    ))}
                </div>
                 <div className="text-center mt-4">
                     <Link href="/learn/market-indicators" className="text-sm text-primary/80 hover:text-primary flex items-center justify-center gap-1">
                        Learn more about indicators <ArrowUpRight className="h-3 w-3" />
                    </Link>
                </div>
            </CardContent>
        </Card>
    </TooltipProvider>
  );
}
