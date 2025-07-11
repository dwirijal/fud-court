
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { analyzeMarketSentiment, type MarketAnalysisInput, type MarketAnalysisOutput } from '@/ai/flows/market-analysis-flow';
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import { fetchMarketData } from '@/lib/coingecko';

const chartConfig = {
  value: {
    label: "Value",
  },
  bearish: {
    label: "Bearish",
    color: "hsl(var(--destructive))",
  },
  neutral: {
    label: "Neutral",
    color: "hsl(var(--muted-foreground))",
  },
  bullish: {
    label: "Bullish",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;


function ScoreGauge({ score, interpretation, summary }: { score: number, interpretation: string, summary: string }) {
  const chartData = [
    { name: "value", value: score, fill: "transparent" },
    { name: "background", value: 100 - score, fill: "hsl(var(--muted))" },
  ];

  const getActiveColor = () => {
    if (interpretation === "Bearish") return chartConfig.bearish.color;
    if (interpretation === "Bullish") return chartConfig.bullish.color;
    return chartConfig.neutral.color;
  };

  const activeColor = getActiveColor();

  return (
      <Card className="flex flex-col items-center justify-center p-6 bg-card/60 backdrop-blur-md h-full">
          <CardHeader className="items-center pb-2 text-center">
              <CardTitle>Macro Sentiment Score</CardTitle>
              <CardDescription className="max-w-xs">{summary}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 items-center justify-center p-0">
              <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square w-full max-w-[250px]"
              >
                  <PieChart>
                      <defs>
                          <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor={chartConfig.bearish.color} />
                              <stop offset="50%" stopColor={chartConfig.neutral.color} />
                              <stop offset="100%" stopColor={chartConfig.bullish.color} />
                          </linearGradient>
                      </defs>
                      <Pie
                          data={chartData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={80}
                          outerRadius={100}
                          startAngle={180}
                          endAngle={0}
                          cx="50%"
                          cy="50%"
                          cornerRadius={5}
                      >
                          <Cell key="value-cell" fill="url(#scoreGradient)" />
                          <Cell key="background-cell" fill="hsl(var(--border) / 0.5)" />
                      </Pie>
                  </PieChart>
              </ChartContainer>
          </CardContent>
          <div className="flex flex-col items-center gap-1 text-center -mt-16">
              <span
                  className="text-5xl font-bold tracking-tighter"
                  style={{ color: activeColor }}
              >
                  {score}
              </span>
              <span
                  className="text-lg font-medium"
                  style={{ color: activeColor }}
              >
                  {interpretation}
              </span>
          </div>
      </Card>
  );
}

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
