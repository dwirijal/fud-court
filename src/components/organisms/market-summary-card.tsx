
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import type { MarketAnalysisOutput } from '@/types';
import { analyzeMarketSentiment } from '@/ai/flows/market-analysis-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, BookOpen, Scale, Zap, TrendingUp, Package } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import anime from 'animejs';
import type { CombinedMarketData } from '@/types';

const getProgressColorClass = (score: number) => {
    if (score < 40) return 'bg-destructive';
    if (score > 60) return 'bg-chart-2';
    return 'bg-muted-foreground';
}

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

const AnimatedProgress = ({ value, className, indicatorClassName }: { value: number, className?: string, indicatorClassName?: string }) => {
    const [progressValue, setProgressValue] = useState(0);
    const hasAnimated = useRef(false);
    const target = useRef({ value: 0 }).current;

    useEffect(() => {
        if (hasAnimated.current) {
            setProgressValue(value);
            return;
        }
        hasAnimated.current = true;
        
        anime({
            targets: target,
            value: value,
            duration: 1200,
            delay: 400,
            easing: 'easeOutCubic',
            update: () => {
                setProgressValue(target.value);
            }
        });
    }, [value, target]);
    
    return <Progress value={progressValue} className={className} indicatorClassName={cn(indicatorClassName)} />
}

interface MarketSummaryCardProps {
    marketData: CombinedMarketData | null;
}

export function MarketSummaryCard({ marketData }: MarketSummaryCardProps) {
  const [analysisResult, setAnalysisResult] = useState<MarketAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define indicator details for tooltips and linking
  const indicatorDetails = [
    { id: "market-cap-explanation", name: "Skor Kapitalisasi Pasar", summary: "Seberapa Dekat Pasar dengan Puncaknya?" },
    { id: "volume-explanation", name: "Skor Volume", summary: "Seberapa Aktif Pasar Hari Ini?" },
    { id: "fear-greed-explanation", name: "Skor Fear & Greed", summary: "Mengukur Rasa Takut atau Serakah Investor" },
    { id: "ath-explanation", name: "Skor ATH", summary: "Seberapa Jauh dari Puncak?" },
    { id: "market-breadth-explanation", name: "Skor Sebaran Pasar", summary: "Apakah Pasar Bergerak Secara Luas?" },
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
                <Skeleton className="h-[120px] w-full mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <CardContent className="space-y-6 p-6">
            <Card className="bg-primary/5 border-primary/20 overflow-hidden">
               <div className="flex flex-col md:flex-row justify-between items-center p-6">
                    <div className="space-y-2 text-center md:text-left mb-6 md:mb-0">
                       <CardTitle className="text-3xl font-headline">Gambaran Umum Pasar</CardTitle>
                        <CardDescription className="text-lg max-w-md">
                            Kondisi pasar crypto menggunakan indikator gabungan utama.
                        </CardDescription>
                         <Badge variant="secondary" className="cursor-help flex-shrink-0 mx-auto md:mx-0">
                            <CheckCircle className="h-4 w-4 mr-1.5" />
                            Akurasi Model: {analysisResult.confidenceScore}%
                        </Badge>
                    </div>
                    <div className="text-center md:text-right flex-shrink-0 pl-4">
                        <AnimatedNumber to={analysisResult.macroScore} className={cn("text-7xl font-bold tracking-tighter", activeColorClass)} />
                        <p className={cn("font-semibold text-2xl", activeColorClass)}>{analysisResult.marketCondition}</p>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <TooltipProvider>
                    {indicators.map((indicator, index) => {
                        const detail = indicatorDetails.find(d => d.id === indicator.id);
                        return (
                            <Tooltip key={indicator.id}>
                                <TooltipTrigger asChild>
                                    <Link href={`/learn/market-indicators#${indicator.id}`} className="group block">
                                        <Card className="flex flex-col h-full hover:bg-muted/50 transition-colors">
                                            <CardContent className="p-4 flex flex-1 items-center justify-between gap-4">
                                                <div className="space-y-1 flex-grow">
                                                    <p className="text-sm font-semibold flex items-center gap-2">
                                                        {indicator.icon && <indicator.icon className="h-4 w-4 text-muted-foreground" />}
                                                        {indicator.name}
                                                    </p>
                                                </div>
                                                <div className="text-right flex-shrink-0 pl-2">
                                                    <AnimatedNumber to={indicator.value} className="text-2xl font-mono font-bold" delay={200 + index * 100} />
                                                    <AnimatedProgress value={indicator.value} className="h-1 w-12 mt-1" indicatorClassName={cn(getProgressColorClass(indicator.value))} />
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
                <Link href="/learn/market-indicators" className="group block">
                   <Card className="h-full flex flex-col items-center justify-center text-center p-4 bg-muted/50 hover:bg-muted transition-colors">
                       <BookOpen className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                       <p className="text-sm font-semibold mt-2 text-muted-foreground group-hover:text-primary transition-colors">Pelajari Skor Ini</p>
                       <p className="text-xs text-muted-foreground">Lihat rincian metode & interpretasi ➜</p>
                   </Card>
                </Link>
            </div>
        </CardContent>
    </Card>
  );
}
