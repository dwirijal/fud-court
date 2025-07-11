
'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchMarketData } from '@/lib/coingecko';
import { analyzeMarketSentiment } from '@/ai/flows/market-analysis-flow';
import type { MarketAnalysisOutput } from '@/types';
import { ScoreGauge } from '../molecules/score-gauge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, CheckCircle } from 'lucide-react';

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <Skeleton className="h-[450px] w-full" />
        <Skeleton className="h-[450px] w-full" />
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
      { name: "Market Cap Score", value: analysisResult.components.marketCapScore },
      { name: "Volume Score", value: analysisResult.components.volumeScore },
      { name: "Fear and Greed Score", value: analysisResult.components.fearGreedScore },
      { name: "ATH Score", value: analysisResult.components.athScore },
      { name: "Market Breadth Score", value: analysisResult.components.marketBreadthScore },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
      <ScoreGauge 
        score={analysisResult.macroScore} 
        interpretation={analysisResult.marketCondition}
        summary="Kondisi pasar berdasarkan 5 indikator makro."
      />
      
      <Card className="bg-card/60 backdrop-blur-md">
        <CardHeader>
          <CardTitle>Indicator Breakdown</CardTitle>
          <CardDescription>The individual scores that contribute to the final macro score.</CardDescription>
        </CardHeader>
        <CardContent>
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
                    {indicator.name}
                  </TableCell>
                  <TableCell className="text-right font-mono">{indicator.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
