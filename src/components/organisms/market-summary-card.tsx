
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import type { MarketAnalysisOutput } from '@/types';
import { analyzeMarketSentiment } from '@/ai/flows/market-analysis-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, ArrowRight, Info, BookOpen } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import type { CombinedMarketData } from '@/types';
import { Separator } from '../ui/separator';
import { AnimatedNumber } from '../molecules/animated-number';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";


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

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    compactDisplay: 'short',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

interface IndicatorDetailSheetProps {
    name: string;
    interpretation: string;
    formula: string;
    rawData: Record<string, string | number>;
}

function IndicatorDetailSheet({ name, interpretation, formula, rawData }: IndicatorDetailSheetProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7">
                    <Info className="h-4 w-4" />
                    <span className="sr-only">Lihat Detail {name}</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full md:w-1/2 lg:w-1/3 overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{name}</SheetTitle>
                    <SheetDescription>
                        {interpretation}
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                    <div>
                        <h4 className="font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wider">Data Mentah</h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm bg-muted p-3 rounded-md">
                            {Object.entries(rawData).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-baseline border-b border-border/50 pb-1">
                                    <span>{key}</span>
                                    <span className="font-mono font-medium">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wider">Rumus</h4>
                        <p className="font-mono text-xs bg-muted p-3 rounded-md">{formula}</p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

interface IndicatorCardProps {
    name: string;
    score: number;
    formula: string;
    interpretation: string;
    rawData: Record<string, string | number>;
    weight: number;
    weightedScore: number;
}

function IndicatorCard({ name, score, formula, interpretation, rawData, weight, weightedScore }: IndicatorCardProps) {
  return (
    <Card className="flex flex-col h-full relative">
        <IndicatorDetailSheet name={name} interpretation={interpretation} formula={formula} rawData={rawData} />
        <CardContent className="p-4 flex flex-col flex-grow justify-between">
            <p className="text-sm font-semibold text-muted-foreground">{name}</p>
            <div className="my-auto text-4xl font-mono font-bold py-2">
                {score}
            </div>
            <div>
                <Separator className="mb-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <div className="text-center">
                        <p>Bobot</p>
                        <p className="font-mono font-semibold text-foreground">{(weight * 100).toFixed(0)}%</p>
                    </div>
                    <div className="text-center">
                        <p>Kontribusi</p>
                        <p className="font-mono font-semibold text-foreground">{weightedScore.toFixed(2)}</p>
                    </div>
                </div>
            </div>
      </CardContent>
    </Card>
  );
}


interface MarketSummaryCardProps {
    marketData: CombinedMarketData | null;
}

export function MarketSummaryCard({ marketData }: MarketSummaryCardProps) {
  const [analysisResult, setAnalysisResult] = useState<MarketAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMarketAnalysis = async () => {
      if (!marketData) {
        setError("Gagal mengambil data pasar.");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      try {
        const result = await analyzeMarketSentiment(marketData);
        setAnalysisResult(result);
      } catch (e) {
        console.error("Analisis pasar gagal:", e);
        const message = e instanceof Error ? e.message : "Terjadi kesalahan yang tidak diketahui.";
        setError(message);
        setAnalysisResult(null);
      } finally {
        setIsLoading(false);
      }
    };

    getMarketAnalysis();
  }, [marketData]);

  if (isLoading) {
    return (
        <Card>
            <CardContent className="p-6">
                <Skeleton className="h-[120px] w-full mb-6" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
  }

  if (error || !analysisResult || !marketData) {
    return (
      <Card className="flex flex-col items-center justify-center p-6 bg-destructive/10 border-destructive">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <CardTitle className="text-2xl font-headline text-destructive">Analisis Gagal</CardTitle>
          <CardDescription className="text-destructive/80 mt-2 text-center max-w-md">
            {error || "Terjadi kesalahan yang tidak diketahui saat menganalisis sentimen pasar."}
          </CardDescription>
      </Card>
    );
  }
  
  const risingTokens = marketData.topCoins.filter(c => (c.price_change_percentage_24h || 0) > 0).length;

  const weights = {
      marketCap: 0.25,
      volume: 0.20,
      fearAndGreed: 0.20,
      ath: 0.25,
      marketBreadth: 0.10
  };

  const indicators = [
      { name: "Kapitalisasi Pasar", score: analysisResult.components.marketCapScore,
        formula: "(Kapitalisasi Pasar Saat Ini / Kapitalisasi Pasar Puncak) * 100",
        interpretation: "Mengukur total kapitalisasi pasar saat ini terhadap nilai tertingginya sepanjang masa.",
        rawData: { "Kap. Pasar Saat Ini": formatCurrency(marketData.totalMarketCap), "Kap. Pasar Puncak": formatCurrency(marketData.maxHistoricalMarketCap) },
        weight: weights.marketCap,
        weightedScore: analysisResult.components.marketCapScore * weights.marketCap,
      },
      { name: "Volume", score: analysisResult.components.volumeScore,
        formula: "min( (Volume Saat Ini / Rata-rata Volume 30 Hari) * 100, 200 ) / 2",
        interpretation: "Mengukur volume perdagangan 24 jam saat ini terhadap rata-rata 30 hari.",
        rawData: { "Volume 24j": formatCurrency(marketData.totalVolume24h), "Rata-rata 30h": formatCurrency(marketData.avg30DayVolume) },
        weight: weights.volume,
        weightedScore: analysisResult.components.volumeScore * weights.volume,
       },
      { name: "Fear & Greed", score: analysisResult.components.fearGreedScore,
        formula: "Nilai Indeks Fear & Greed",
        interpretation: "Langsung menggunakan Indeks Fear & Greed untuk mengukur sentimen emosional yang berlaku di pasar.",
        rawData: { "Nilai Indeks": marketData.fearAndGreedIndex },
        weight: weights.fearAndGreed,
        weightedScore: analysisResult.components.fearGreedScore * weights.fearAndGreed,
       },
      { name: "Jarak ATH", score: analysisResult.components.athScore,
        formula: "100 - (Rata-rata % Jarak dari ATH Koin Teratas)",
        interpretation: "Mengukur seberapa jauh, rata-rata, mata uang kripto teratas dari harga tertinggi sepanjang masa (ATH).",
        rawData: { "Koin Teratas": `${marketData.topCoins.length} aset` },
        weight: weights.ath,
        weightedScore: analysisResult.components.athScore * weights.ath,
       },
      { name: "Sebaran Pasar", score: analysisResult.components.marketBreadthScore,
        formula: "(Token yang Naik / Total Koin Teratas) * 100",
        interpretation: "Mengukur persentase koin teratas yang mengalami pergerakan harga positif dalam 24 jam terakhir.",
        rawData: { "Aset Naik": `${risingTokens} / ${marketData.topCoins.length}` },
        weight: weights.marketBreadth,
        weightedScore: analysisResult.components.marketBreadthScore * weights.marketBreadth,
       },
  ];
  
  const activeColorClass = getActiveColorClass(analysisResult.marketCondition);

  return (
    <Card className="bg-primary/5 border-primary/20 overflow-hidden">
        <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-3 text-center md:text-left">
                  <CardTitle className="text-2xl font-headline">
                    Gambaran Umum Pasar
                  </CardTitle>
                  <CardDescription className="text-base text-muted-foreground max-w-md">
                    Mengukur kondisi pasar crypto secara keseluruhan menggunakan indikator gabungan utama.
                  </CardDescription>
                   <Badge variant="secondary" className="cursor-help flex-shrink-0 mx-auto md:mx-0">
                    <CheckCircle className="h-4 w-4 mr-1.5" />
                    Akurasi Model: {analysisResult.confidenceScore}%
                  </Badge>
                </div>
                <div className="text-center md:text-right flex-shrink-0 md:pl-4 flex flex-col items-center md:items-end">
                  <AnimatedNumber to={analysisResult.macroScore} className={cn("text-6xl font-bold font-mono tracking-tighter", activeColorClass)} />
                  <p className={cn("font-semibold text-2xl mb-2", activeColorClass)}>{analysisResult.marketCondition}</p>
                   <Button variant="link" asChild className="text-muted-foreground hover:text-primary h-auto p-0">
                      <Link href="/learn/market-indicators" className="flex items-center gap-1">
                          Pelajari Skor Ini <ArrowRight className="h-4 w-4" />
                      </Link>
                   </Button>
                </div>
            </div>
        </CardContent>

        <CardFooter className="flex-col items-start p-6 pt-0">
            <Separator className="mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
                {indicators.map((indicator) => (
                    <IndicatorCard
                        key={indicator.name}
                        name={indicator.name}
                        score={indicator.score}
                        formula={indicator.formula}
                        interpretation={indicator.interpretation}
                        rawData={indicator.rawData}
                        weight={indicator.weight}
                        weightedScore={indicator.weightedScore}
                    />
                ))}
            </div>
        </CardFooter>
    </Card>
  );
}
