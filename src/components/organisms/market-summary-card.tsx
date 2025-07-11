
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { analyzeMarketSentiment, type MarketAnalysisOutput } from '@/ai/flows/market-analysis-flow';
import { fetchMarketData } from '@/lib/coingecko';
import { ScoreGauge } from '../molecules/score-gauge';

export function MarketSummaryCard() {
  const [isLoading, setIsLoading] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<MarketAnalysisOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performAnalysis = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const marketData = await fetchMarketData();
        if (!marketData) {
            throw new Error("Failed to fetch necessary market data.");
        }
        
        const result = await analyzeMarketSentiment(marketData);
        setAnalysisResult(result);
      } catch (e) {
        console.error("Market analysis failed:", e);
        const message = e instanceof Error ? e.message : "An unknown error occurred during analysis.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    performAnalysis();
  }, []);

  if (isLoading) {
    return (
        <Card className="flex flex-col items-center justify-center p-6 bg-card/60 backdrop-blur-md min-h-[400px]">
            <CardHeader className="items-center text-center">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-5 w-64" />
            </CardHeader>
            <CardContent className="flex flex-1 items-center justify-center p-0">
                <Skeleton className="h-64 w-64 rounded-full" />
            </CardContent>
        </Card>
    );
  }

  if (error) {
    return (
        <Card className="flex flex-col items-center justify-center p-6 bg-destructive/10 border-destructive min-h-[400px]">
            <CardHeader className="items-center text-center">
                <CardTitle className="text-destructive">Analysis Failed</CardTitle>
                <CardDescription className="text-destructive/80">{error}</CardDescription>
            </CardHeader>
        </Card>
    );
  }

  if (!analysisResult) {
    return (
        <Card className="flex flex-col items-center justify-center p-6 bg-card/60 backdrop-blur-md min-h-[400px]">
             <CardHeader className="items-center text-center">
                <CardTitle>No Data</CardTitle>
                <CardDescription>Could not generate market analysis at this time.</CardDescription>
            </CardHeader>
        </Card>
    );
  }

  return (
    <ScoreGauge 
        score={analysisResult.macroScore}
        interpretation={analysisResult.interpretation}
        summary={analysisResult.summary}
    />
  );
}
