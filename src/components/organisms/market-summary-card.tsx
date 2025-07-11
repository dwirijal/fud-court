
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchMarketData } from '@/lib/coingecko';
import { analyzeMarketSentiment } from '@/ai/flows/market-analysis-flow';
import type { MarketAnalysisOutput } from '@/types';
import { ScoreGauge } from '../molecules/score-gauge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const indicatorExplanations: Record<keyof MarketAnalysisOutput['components'], string> = {
    marketCapScore: "Measures the current total market value against its historical peak. A high score suggests the market is closer to a new high.",
    volumeScore: "Measures the current 24-hour trading volume against the 30-day average. A high score indicates high market activity.",
    fearGreedScore: "Reflects the current market psychology, from extreme fear to extreme greed.",
    athScore: "Measures how far the top coins are from their all-time highs. A high score means prices are closer to their peaks.",
    marketBreadthScore: "Measures the percentage of top coins that have had a positive price change in the last 24 hours. A high score indicates a broad market rally."
};

function IndicatorStatusIcon() {
    return <CheckCircle className="h-4 w-4 text-chart-2" />;
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
        const result = await analyzeMarketSentiment(marketData);
        setAnalysisResult(result);
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        <Skeleton className="h-[450px] w-full lg:col-span-1" />
        <Skeleton className="h-[450px] w-full lg:col-span-2" />
      </div>
    );
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
      { name: "Fear and Greed Score", key: 'fearGreedScore', value: analysisResult.components.fearGreedScore },
      { name: "ATH Score", key: 'athScore', value: analysisResult.components.athScore },
      { name: "Market Breadth Score", key: 'marketBreadthScore', value: analysisResult.components.marketBreadthScore },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
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
                        <TableHead className="text-right">Score</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {indicators.map((indicator) => (
                        <TableRow key={indicator.name}>
                        <TableCell className="font-medium flex items-center gap-2">
                            <IndicatorStatusIcon />
                            <span>{indicator.name}</span>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button>
                                        <Info className="h-3.5 w-3.5 text-muted-foreground/70" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <p>{indicatorExplanations[indicator.key as keyof MarketAnalysisOutput['components']]}</p>
                                </TooltipContent>
                            </Tooltip>
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
