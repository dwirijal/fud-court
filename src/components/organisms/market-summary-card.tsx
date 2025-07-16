
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
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

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
                        <Card className="flex flex-col aspect-square hover:bg-muted/50 transition-colors h-full">
                             <CardContent className="p-4 flex flex-col flex-grow justify-between items-start gap-2">
                                <div>
                                    <div className="bg-muted p-1.5 rounded-full w-fit mb-2">
                                        <detail.icon className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <p className="text-xs font-medium text-muted-foreground">{detail.name}</p>
                                </div>
                                <div className="w-full">
                                    <AnimatedNumber to={value} className="text-4xl font-bold tracking-tighter" />
                                    <Progress value={value} className="h-1.5 w-full mt-2" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{detail.summary}</p>
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
            <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent className="p-6">
                <Skeleton className="h-[120px] w-full mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((_, i) => (
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
  
  const activeColorClass = getActiveColorClass(analysisResult.marketCondition);

  return (
    <Card>
        <CardHeader>
            <CardTitle className="text-3xl md:text-4xl font-headline">Gambaran Umum Pasar Saat Ini</CardTitle>
            <CardDescription className="text-lg md:text-xl max-w-2xl">
                Mengukur kondisi pasar crypto secara keseluruhan menggunakan 5 indikator gabungan utama.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <Card className="bg-primary/5 border-primary/20 overflow-hidden">
               <div className="flex flex-col md:flex-row justify-between items-center p-6">
                    <div className="space-y-2 text-center md:text-left mb-6 md:mb-0">
                         <Badge variant="secondary" className="cursor-help flex-shrink-0 mx-auto md:mx-0">
                            <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-chart-2" />
                            Akurasi Model: {analysisResult.confidenceScore}%
                        </Badge>
                         <Button asChild variant="link" className="text-muted-foreground p-0 h-auto flex text-sm">
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

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {indicatorDetails.map((detail) => (
                    <IndicatorCard
                        key={detail.name}
                        detail={detail}
                        value={analysisResult.components[detail.valueKey]}
                    />
                ))}
            </div>
        </CardContent>
    </Card>
  );
}
