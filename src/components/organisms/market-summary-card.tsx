
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
<<<<<<< HEAD
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, ArrowRight, Scale, Zap, TrendingUp, Package } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

import anime from 'animejs';
=======
import type { MarketAnalysisOutput } from '@/types';
import { analyzeMarketSentiment } from '@/ai/flows/market-analysis-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, ArrowRight, Info, BookOpen } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
>>>>>>> b058873b045abf5277ae8797dcaa268e60af95fe
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

<<<<<<< HEAD
// Directly integrate the analysis logic here.
const weights = {
  marketCap: 0.25,
  volume: 0.20,
  fearAndGreed: 0.20,
  ath: 0.25,
  marketBreadth: 0.10
};

function analyzeMarketData(input: CombinedMarketData) {
    // 1. Confidence Score
    let confidence = 100;
    if (input.totalMarketCap <= 0) confidence -= 25;
    if (input.totalVolume24h <= 0) confidence -= 25;
    if (input.fearAndGreedIndex < 0 || input.fearAndGreedIndex > 100) confidence -= 15;
    const expectedCoins = 20;
    if (input.topCoins.length < expectedCoins) {
        const missingPercentage = (expectedCoins - input.topCoins.length) / expectedCoins;
        confidence -= missingPercentage * 35;
    }
    const confidenceScore = Math.max(0, Math.round(confidence));

    // 2. Component Scores
    const s1_marketCap = (input.totalMarketCap / input.maxHistoricalMarketCap) * 100;
    const raw_volume_score = (input.totalVolume24h / input.avg30DayVolume) * 100;
    const capped_volume_score = Math.min(raw_volume_score, 200);
    const s2_volume = capped_volume_score / 2;
    const s3_fearAndGreed = input.fearAndGreedIndex;

    const n_ath = input.topCoins.length;
    const distanceFromAthSum = input.topCoins.reduce((sum, coin) => {
        const distance = ((coin.ath - coin.current_price) / coin.ath) * 100;
        return sum + (distance > 0 ? distance : 0);
    }, 0);
    const avgDistanceFromAth = n_ath > 0 ? (distanceFromAthSum / n_ath) : 0;
    const s4_ath = 100 - avgDistanceFromAth;

    const risingTokens = input.topCoins.filter(c => (c.price_change_percentage_24h || 0) > 0).length;
    const n_breadth = input.topCoins.length;
    const s5_marketBreadth = n_breadth > 0 ? (risingTokens / n_breadth) * 100 : 0;

    const normalize = (value: number) => Math.max(0, Math.min(100, value));
    const finalScores = {
        marketCap: normalize(s1_marketCap),
        volume: normalize(s2_volume),
        fearAndGreed: normalize(s3_fearAndGreed),
        ath: normalize(s4_ath),
        marketBreadth: normalize(s5_marketBreadth),
    };
    
    // 3. Final Macro Score
    const macroScore = 
        finalScores.marketCap * weights.marketCap +
        finalScores.volume * weights.volume +
        finalScores.fearAndGreed * weights.fearAndGreed +
        finalScores.ath * weights.ath +
        finalScores.marketBreadth * weights.marketBreadth;
    
    let marketCondition: string;
    if (macroScore >= 80) marketCondition = 'Bullish ekstrem / Euforia';
    else if (macroScore >= 60) marketCondition = 'Bullish sehat';
    else if (macroScore >= 40) marketCondition = 'Netral / Sideways';
    else if (macroScore >= 20) marketCondition = 'Bearish / Distribusi';
    else marketCondition = 'Capitulation / Fear ekstrem';

    return {
      macroScore: Math.round(macroScore),
      marketCondition,
      components: {
        marketCapScore: Math.round(finalScores.marketCap),
        volumeScore: Math.round(finalScores.volume),
        fearGreedScore: Math.round(finalScores.fearAndGreed),
        athScore: Math.round(finalScores.ath),
        marketBreadthScore: Math.round(finalScores.marketBreadth),
      },
      confidenceScore,
    };
}
=======
>>>>>>> b058873b045abf5277ae8797dcaa268e60af95fe


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

interface IndicatorCardProps {
    name: string;
    score: number;
    formula: string;
    interpretation: string;
    rawData: Record<string, string | number>;
    weight: number;
    weightedScore: number;
}

<<<<<<< HEAD
const indicatorDetails = [
    { name: "Kapitalisasi Pasar", valueKey: "marketCapScore", summary: "Seberapa Dekat Pasar dengan Puncaknya?", icon: Scale },
    { name: "Volume", valueKey: "volumeScore", summary: "Seberapa Aktif Pasar Hari Ini?", icon: Zap },
    { name: "Fear & Greed", valueKey: "fearGreedScore", summary: "Mengukur Rasa Takut atau Serakah Investor", icon: AlertTriangle },
    { name: "Jarak ATH", valueKey: "athScore", summary: "Seberapa Jauh dari Puncak?", icon: TrendingUp },
    { name: "Sebaran Pasar", valueKey: "marketBreadthScore", summary: "Apakah Pasar Bergerak Secara Luas?", icon: Package },
] as const;

function IndicatorCard({ detail, value }: { detail: typeof indicatorDetails[number], value: number }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href={`/markets#${detail.valueKey}`} className="group block h-full">
                        <Card className="flex flex-col h-full hover:bg-muted/50 transition-colors aspect-square justify-between p-4">
                           <div className="flex items-center justify-between">
                                <div className="bg-muted p-1.5 rounded-full w-fit">
                                    <detail.icon className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                            <div className="w-full text-left space-y-2">
                                <p className="text-xs font-medium text-muted-foreground">{detail.name}</p>
                                <AnimatedNumber to={value} className="text-5xl font-bold tracking-tighter" />
                                <Progress value={value} className="h-1.5 w-full mt-1" />
                            </div>
                        </Card>
                    </Link>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{detail.summary}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
=======
function IndicatorCard({ name, score, formula, interpretation, rawData, weight, weightedScore }: IndicatorCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardContent className="p-4 flex flex-col flex-grow justify-between relative">
        <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-muted-foreground">{name}</p>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-2">
                        <Info className="h-4 w-4" />
                        <span className="sr-only">Detail untuk {name}</span>
                    </Button>
                </SheetTrigger>
                <SheetContent>
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
        </div>
          <div className="my-auto py-2 text-center">
             <p className="text-5xl font-mono font-bold">{score}</p>
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
>>>>>>> b058873b045abf5277ae8797dcaa268e60af95fe
}


interface MarketSummaryCardProps {
    marketData: CombinedMarketData | null;
}

export function MarketSummaryCard({ marketData }: MarketSummaryCardProps) {
  const [analysisResult, setAnalysisResult] = useState<ReturnType<typeof analyzeMarketData> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
<<<<<<< HEAD
=======
  const [error, setError] = useState<string | null>(null);
>>>>>>> b058873b045abf5277ae8797dcaa268e60af95fe

  useEffect(() => {
    if (marketData) {
      const result = analyzeMarketData(marketData);
      setAnalysisResult(result);
    }
    setIsLoading(false);
  }, [marketData]);

  if (!marketData || isLoading) {
    return (
<<<<<<< HEAD
      <div className="space-y-6">
          <Skeleton className="h-[220px] w-full mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full aspect-square" />
              ))}
          </div>
      </div>
    );
  }

  if (!analysisResult) {
=======
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
>>>>>>> b058873b045abf5277ae8797dcaa268e60af95fe
    return (
      <Card className="flex flex-col items-center justify-center p-6 bg-destructive/10 border-destructive">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <CardTitle className="text-2xl font-headline text-destructive">Analisis Gagal</CardTitle>
          <CardDescription className="text-destructive/80 mt-2 text-center max-w-md">
            Tidak dapat menghitung sentimen pasar karena data tidak lengkap.
          </CardDescription>
      </Card>
    );
  }
  
<<<<<<< HEAD
  const activeColorClass = getActiveColorClass(analysisResult.marketCondition);

  return (
    <div className="space-y-6">
        <Card className="bg-primary/5 border-primary/20 overflow-hidden">
            <CardHeader>
                <CardTitle className="headline-3">Gambaran Umum Pasar Saat Ini</CardTitle>
                <CardDescription className="text-sm max-w-2xl">
                    Mengukur kondisi pasar crypto secara keseluruhan menggunakan 5 indikator gabungan utama.
                </CardDescription>
            </CardHeader>
             <CardContent>
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="space-y-2 text-center md:text-left">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Badge variant="secondary" className="cursor-help flex-shrink-0 mx-auto md:mx-0">
                                        <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-chart-2" />
                                        Akurasi Model: {analysisResult.confidenceScore}%
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="max-w-xs text-center">Skor kepercayaan berdasarkan kelengkapan dan validitas data input.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <Button asChild variant="link" className="text-muted-foreground p-0 h-auto flex text-sm">
                            <Link href="/markets">
                                Pelajari cara kerja skor ini <ArrowRight className="h-4 w-4 ml-1" />
                            </Link>
                        </Button>
                    </div>
                    <div className="text-center md:text-right flex-shrink-0">
                        <AnimatedNumber to={analysisResult.macroScore} className={cn("text-7xl md:text-8xl font-bold tracking-tighter", activeColorClass)} />
                        <p className={cn("font-semibold text-2xl md:text-3xl", activeColorClass)}>{analysisResult.marketCondition}</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {indicatorDetails.map((detail) => (
                <IndicatorCard
                    key={detail.name}
                    detail={detail}
                    value={analysisResult.components[detail.valueKey]}
                />
            ))}
        </div>
    </div>
=======
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
      { name: "Skor ATH", score: analysisResult.components.athScore,
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
        <CardHeader className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="space-y-3 text-center md:text-left flex-grow">
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
                <div className="text-center md:text-right flex-shrink-0 md:pl-4 flex flex-col items-center md:items-end w-full md:w-auto">
                  <AnimatedNumber to={analysisResult.macroScore} className={cn("text-7xl font-bold font-mono tracking-tighter", activeColorClass)} />
                  <p className={cn("font-semibold text-2xl mb-2", activeColorClass)}>{analysisResult.marketCondition}</p>
                   <Button variant="link" asChild className="text-muted-foreground hover:text-primary h-auto p-0">
                      <Link href="/learn/market-indicators" className="flex items-center gap-1">
                          Pelajari Skor Ini <ArrowRight className="h-4 w-4" />
                      </Link>
                  </Button>
                </div>
            </div>
        </CardHeader>

        <CardFooter className="flex-col items-start p-6 pt-0">
            <Separator className="mb-6" />
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
>>>>>>> b058873b045abf5277ae8797dcaa268e60af95fe
  );
}

