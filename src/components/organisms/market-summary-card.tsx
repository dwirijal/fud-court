
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
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
import { AnimatedNumber } from '../molecules/animated-number';
import type { CombinedMarketData } from '@/types';
import { FlippableIndicatorCard } from '../molecules/flippable-indicator-card';

const weights = {
  marketCap: 0.25,
  volume: 0.20,
  fearAndGreed: 0.20,
  ath: 0.25,
  marketBreadth: 0.10
};

const formatCurrency = (value: number, compact: boolean = true) => {
    const options: Intl.NumberFormatOptions = {
        style: 'currency',
        currency: 'USD',
    };
    if (compact) {
        options.notation = 'compact';
        options.maximumFractionDigits = 2;
    } else {
        options.minimumFractionDigits = 2;
        options.maximumFractionDigits = value < 1 ? 6 : 2;
    }
    return new Intl.NumberFormat('en-US', options).format(value);
  };

function analyzeMarketData(input: CombinedMarketData) {
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

    const rawData = {
        marketCap: { "Kapitalisasi Pasar Saat Ini": formatCurrency(input.totalMarketCap, false), "Kapitalisasi Puncak": formatCurrency(input.maxHistoricalMarketCap, false) },
        volume: { "Volume Saat Ini": formatCurrency(input.totalVolume24h, false), "Rata-rata Volume 30h": formatCurrency(input.avg30DayVolume, false) },
        fearAndGreed: { "Nilai Indeks": input.fearAndGreedIndex },
        ath: { "Rata-rata % Jarak dari ATH": `${avgDistanceFromAth.toFixed(2)}%` },
        marketBreadth: { "Token Naik": risingTokens, "Total Koin Teratas": n_breadth },
    };

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
      rawData,
      confidenceScore,
    };
}


const getActiveColorClass = (interpretation: string) => {
    const lowerCaseInterpretation = interpretation.toLowerCase();
    if (lowerCaseInterpretation.includes("bearish") || lowerCaseInterpretation.includes("capitulation")) {
        return 'text-market-down';
    }
    if (lowerCaseInterpretation.includes("bullish")) {
        return 'text-market-up';
    }
    return 'text-text-secondary';
};

const indicatorDetails = [
    { name: "Kapitalisasi Pasar", valueKey: "marketCapScore", rawDataKey: "marketCap", formula: "(Kapitalisasi Pasar Saat Ini / Kapitalisasi Puncak) * 100", icon: Scale },
    { name: "Volume", valueKey: "volumeScore", rawDataKey: "volume", formula: "min((Volume Saat Ini / Rata-rata 30h) * 100, 200) / 2", icon: Zap },
    { name: "Fear & Greed", valueKey: "fearGreedScore", rawDataKey: "fearAndGreed", formula: "Nilai Indeks Fear & Greed", icon: AlertTriangle },
    { name: "Jarak ATH", valueKey: "athScore", rawDataKey: "ath", formula: "100 - (Rata-rata % Jarak dari ATH)", icon: TrendingUp },
    { name: "Sebaran Pasar", valueKey: "marketBreadthScore", rawDataKey: "marketBreadth", formula: "(Token Naik / Total Koin) * 100", icon: Package },
] as const;

interface MarketSummaryCardProps {
    marketData: CombinedMarketData | null;
}

export function MarketSummaryCard({ marketData }: MarketSummaryCardProps) {
  const [analysisResult, setAnalysisResult] = useState<ReturnType<typeof analyzeMarketData> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (marketData) {
      const result = analyzeMarketData(marketData);
      setAnalysisResult(result);
    }
    setIsLoading(false);
  }, [marketData]);

  if (!marketData || isLoading) {
    return (
      <div className="space-y-6">
          <Skeleton className="h-[220px] w-full mb-4 rounded-3" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full aspect-square rounded-3" />
              ))}
          </div>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <Card className="card-primary flex flex-col items-center justify-center p-6 bg-destructive/10 border-destructive h-full">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <CardTitle className="text-2xl font-semibold text-destructive">Analisis Gagal</CardTitle>
          <CardDescription className="text-destructive/80 mt-2 text-center max-w-md">
            Tidak dapat menghitung sentimen pasar karena data tidak lengkap.
          </CardDescription>
      </Card>
    );
  }
  
  const activeColorClass = getActiveColorClass(analysisResult.marketCondition);

  return (
    <Card className="card-primary h-full flex flex-col">
        <CardHeader>
            <CardTitle className="text-2xl font-semibold">Gambaran Umum Pasar</CardTitle>
            <CardDescription className="text-base text-text-secondary max-w-2xl">
                Mengukur kondisi pasar crypto secara keseluruhan menggunakan 5 indikator gabungan utama.
            </CardDescription>
        </CardHeader>
         <CardContent className="flex flex-col flex-grow">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
                <div className="lg:col-span-1 flex flex-col justify-between items-center text-center p-6 bg-bg-secondary rounded-3">
                    <div className="space-y-2">
                      <AnimatedNumber to={analysisResult.macroScore} className={cn("text-7xl md:text-8xl font-bold tracking-tighter", activeColorClass)} />
                      <p className={cn("text-2xl font-semibold", activeColorClass)}>{analysisResult.marketCondition}</p>
                    </div>
                    <div className="space-y-2 mt-4">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Badge variant="secondary" className="cursor-help flex-shrink-0 mx-auto md:mx-0">
                                        <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-market-up" />
                                        Akurasi Model: {analysisResult.confidenceScore}%
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="max-w-xs text-center">Skor kepercayaan berdasarkan kelengkapan dan validitas data input.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <Button asChild variant="link" className="text-text-secondary p-0 h-auto flex text-xs font-medium">
                            <Link href="/learn/market-indicators">
                                Pelajari cara kerja skor ini <ArrowRight className="h-4 w-4 ml-1" />
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-3">
                    {indicatorDetails.map((detail) => (
                         <FlippableIndicatorCard
                            key={detail.name}
                            icon={detail.icon}
                            name={detail.name}
                            score={analysisResult.components[detail.valueKey]}
                            formula={detail.formula}
                            rawData={analysisResult.rawData[detail.rawDataKey]}
                        />
                    ))}
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
