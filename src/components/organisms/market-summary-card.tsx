
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import type { MarketAnalysisOutput } from '@/types';
import { analyzeMarketSentiment } from '@/ai/flows/market-analysis-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, BookOpen, Scale, Zap, TrendingUp, Package, ArrowRight, Info, LucideIcon } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import type { CombinedMarketData } from '@/types';
import { Separator } from '../ui/separator';
import { AnimatedNumber } from '../molecules/animated-number';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


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
    icon: LucideIcon;
    name: string;
    score: number;
    formula: string;
    rawData: Record<string, string | number>;
}

function IndicatorCard({ icon: Icon, name, score, formula, rawData }: IndicatorCardProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="hover:bg-muted/50 transition-colors cursor-help aspect-[3/4]">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2 h-full">
              <Icon className="h-6 w-6 text-muted-foreground mb-2" />
              <p className="text-sm font-semibold">{name}</p>
              <p className="text-3xl font-mono font-bold">{score}</p>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent className="w-64 p-3">
            <div className="space-y-2 text-xs w-full">
              {Object.entries(rawData).map(([key, value]) => (
                <div key={key} className="flex justify-between items-baseline">
                  <span className="text-muted-foreground truncate" title={key}>{key}</span>
                  <span className="font-mono text-foreground font-semibold">{value}</span>
                </div>
              ))}
            </div>
            <Separator className="my-2 bg-border/50"/>
            <p className="text-xs text-center font-mono text-primary/80" title={formula}>
                {formula}
            </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

  const indicators = [
      { name: "Kapitalisasi Pasar", value: analysisResult.components.marketCapScore, icon: Scale,
        formula: "(Cap / Peak) * 100",
        rawData: { "Kap. Pasar Saat Ini": formatCurrency(marketData.totalMarketCap), "Kap. Pasar Puncak": formatCurrency(marketData.maxHistoricalMarketCap) },
      },
      { name: "Volume", value: analysisResult.components.volumeScore, icon: Zap,
        formula: "(Vol / Avg) * 50",
        rawData: { "Volume 24j": formatCurrency(marketData.totalVolume24h), "Rata-rata 30h": formatCurrency(marketData.avg30DayVolume) },
       },
      { name: "Fear & Greed", value: analysisResult.components.fearGreedScore, icon: Info,
        formula: "Indeks Fear & Greed",
        rawData: { "Nilai Indeks": marketData.fearAndGreedIndex },
       },
      { name: "Jarak ATH", value: analysisResult.components.athScore, icon: TrendingUp,
        formula: "100 - Avg. ATH Distance",
        rawData: { "Koin Teratas": `${marketData.topCoins.length} aset` },
       },
      { name: "Sebaran Pasar", value: analysisResult.components.marketBreadthScore, icon: Package,
        formula: "(Aset Naik / Total) * 100",
        rawData: { "Aset Naik": `${risingTokens} / ${marketData.topCoins.length}` },
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
                  <Link href="/learn/market-indicators" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                      Pelajari selengkapnya <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
            </div>
        </CardContent>

        <CardFooter className="flex-col items-start p-6 pt-0">
            <Separator className="mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
                {indicators.map((indicator, index) => (
                    <IndicatorCard
                        key={indicator.name}
                        icon={indicator.icon}
                        name={indicator.name}
                        score={indicator.value}
                        formula={indicator.formula}
                        rawData={indicator.rawData}
                    />
                ))}
            </div>
        </CardFooter>
    </Card>
  );
}
