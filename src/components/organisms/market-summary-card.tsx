
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import type { MarketAnalysisOutput } from '@/types';
import { analyzeMarketSentiment } from '@/ai/flows/market-analysis-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, ArrowRight, Scale, Zap, TrendingUp, Package } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import anime from 'animejs';
import type { CombinedMarketData } from '@/types';

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

const AnimatedNumber = ({ to, className, delay = 0 }: { to: number, className?: string, delay?: number }) => {
    const [value, setValue] = useState(0);
    const hasAnimated = useRef(false);
    const target = useRef({ value: 0 }).current;

    useEffect(() => {
        if (hasAnimated.current) {
            setValue(to);
            return;
        }
        hasAnimated.current = true;
        
        anime({
            targets: target,
            value: to,
            round: 1,
            duration: 1200,
            delay: delay,
            easing: 'easeOutCubic',
            update: () => {
                setValue(target.value);
            }
        });
    }, [to, delay, target]);

    return <p className={className}>{value}</p>;
}

interface MarketSummaryCardProps {
    marketData: CombinedMarketData | null;
}

export function MarketSummaryCard({ marketData }: MarketSummaryCardProps) {
  const [analysisResult, setAnalysisResult] = useState<MarketAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const indicatorDetails = [
    { id: "market-cap-explanation", name: "Kapitalisasi Pasar", summary: "Seberapa Dekat Pasar dengan Puncaknya?" },
    { id: "volume-explanation", name: "Volume", summary: "Seberapa Aktif Pasar Hari Ini?" },
    { id: "fear-greed-explanation", name: "Fear & Greed", summary: "Mengukur Rasa Takut atau Serakah Investor" },
    { id: "ath-explanation", name: "Jarak ATH", summary: "Seberapa Jauh dari Puncak?" },
    { id: "market-breadth-explanation", name: "Sebaran Pasar", summary: "Apakah Pasar Bergerak Secara Luas?" },
  ];

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
                <Skeleton className="h-[120px] w-full mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full" />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
  }

  if (error || !analysisResult) {
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
  
  const indicators = [
      { name: "Kapitalisasi Pasar", value: analysisResult.components.marketCapScore, id: "market-cap-explanation", icon: Scale },
      { name: "Volume", value: analysisResult.components.volumeScore, id: "volume-explanation", icon: Zap },
      { name: "Fear & Greed", value: analysisResult.components.fearGreedScore, id: "fear-greed-explanation", icon: AlertTriangle },
      { name: "Jarak ATH", value: analysisResult.components.athScore, id: "ath-explanation", icon: TrendingUp },
      { name: "Sebaran Pasar", value: analysisResult.components.marketBreadthScore, id: "market-breadth-explanation", icon: Package },
  ];
  
  const activeColorClass = getActiveColorClass(analysisResult.marketCondition);

  return (
    <Card>
        <CardContent className="space-y-4 p-6">
            <Card className="bg-primary/5 border-primary/20 overflow-hidden">
               <div className="flex flex-col md:flex-row justify-between items-center p-6">
                    <div className="space-y-2 text-center md:text-left mb-4 md:mb-0">
                       <CardTitle className="text-3xl md:text-4xl font-headline">Gambaran Umum Pasar Saat Ini</CardTitle>
                        <CardDescription className="text-lg md:text-xl max-w-md">
                            Mengukur kondisi pasar crypto secara keseluruhan menggunakan indikator gabungan utama.
                        </CardDescription>
                         <Badge variant="secondary" className="cursor-help flex-shrink-0 mx-auto md:mx-0">
                            <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-chart-2" />
                            Akurasi Model: {analysisResult.confidenceScore}%
                        </Badge>
                        <Button variant="link" asChild className="text-muted-foreground p-0 h-auto">
                            <Link href="/markets">
                                Pelajari cara kerja skor ini <ArrowRight className="h-4 w-4 ml-1" />
                            </Link>
                        </Button>
                    </div>
                    <div className="text-center md:text-right flex-shrink-0 pl-4">
                        <AnimatedNumber to={analysisResult.macroScore} className={cn("text-7xl md:text-8xl font-bold tracking-tighter", activeColorClass)} />
                        <p className={cn("font-semibold text-2xl md:text-3xl", activeColorClass)}>{analysisResult.marketCondition}</p>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <TooltipProvider>
                    {indicators.map((indicator, index) => {
                        const detail = indicatorDetails.find(d => d.id === indicator.id);
                        return (
                            <Tooltip key={indicator.id}>
                                <TooltipTrigger asChild>
                                    <Link href={`/markets#${indicator.id}`} className="group block h-full">
                                        <Card className="flex flex-col h-full">
                                            <CardContent className="p-3 flex flex-1 items-center justify-between gap-2">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    {indicator.icon && 
                                                        <div className="bg-muted p-2 rounded-full">
                                                            <indicator.icon className="h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                    }
                                                    <p className="text-sm font-medium text-muted-foreground truncate">{indicator.name}</p>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <AnimatedNumber to={indicator.value} className="text-2xl font-mono font-bold" delay={200 + index * 100} />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </TooltipTrigger>
                                {detail && (
                                    <TooltipContent>
                                        <p>{detail.summary}</p>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        );
                    })}
                </TooltipProvider>
            </div>
        </CardContent>
    </Card>
  );
}
