
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import type { MarketAnalysisOutput } from '@/types';
import { analyzeMarketSentiment } from '@/ai/flows/market-analysis-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, BookOpen, Scale, Zap, TrendingUp, Package, ArrowRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import anime from 'animejs';
import type { CombinedMarketData } from '@/types';
import { Separator } from '../ui/separator';

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
        if (hasAnimated.current && value === to) return;
        
        if (hasAnimated.current) {
            target.value = value;
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
    }, [to, delay, target, value]);

    return <p className={className}>{value}</p>;
}

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

const IndicatorCard = ({ index, icon: Icon, name, score, formula, rawData }: {
  index: number;
  icon: any;
  name: string;
  score: number;
  formula: string;
  rawData: Record<string, string | number>;
}) => {
  const cardRef = useRef(null);
  const scoreRef = useRef(null);
  const detailsRef = useRef(null);
  const animation = useRef<anime.AnimeInstance | null>(null);

  useEffect(() => {
    animation.current = anime.timeline({
      easing: 'easeOutExpo',
      duration: 400,
      autoplay: false,
    });

    animation.current
      .add({
        targets: scoreRef.current,
        translateY: -15,
        opacity: 0,
      })
      .add({
        targets: detailsRef.current,
        translateY: [15, 0],
        opacity: [0, 1],
      }, '-=300'); // Start details animation slightly before score finishes

  }, []);

  const handleMouseEnter = () => animation.current?.play();
  const handleMouseLeave = () => animation.current?.reverse();
  
  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative h-24 overflow-hidden rounded-lg border bg-secondary p-4 cursor-pointer group"
    >
      {/* Top part with name and icon */}
      <div className="flex items-center justify-between text-sm font-semibold text-muted-foreground mb-2">
        <span>{name}</span>
        <Icon className="h-4 w-4" />
      </div>
      
      {/* Animated content */}
      <div className="relative h-full">
        {/* Score - visible by default */}
        <div ref={scoreRef} className="absolute inset-0 flex items-center justify-center">
          <p className="text-2xl font-bold font-mono text-foreground">{score}</p>
        </div>
        
        {/* Details - hidden by default */}
        <div ref={detailsRef} className="absolute inset-0 flex flex-col justify-center items-center opacity-0">
          <div className="text-xs w-full">
            {Object.entries(rawData).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-muted-foreground">{key}</span>
                <span className="font-mono text-foreground">{value}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-primary/80 font-mono mt-1">{formula}</p>
        </div>
      </div>
    </div>
  );
};

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full" />
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
      { name: "Fear & Greed", value: analysisResult.components.fearGreedScore, icon: AlertTriangle,
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
                <div className="text-center md:text-right flex-shrink-0 md:pl-4">
                  <AnimatedNumber to={analysisResult.macroScore} className={cn("text-6xl font-bold font-mono tracking-tighter", activeColorClass)} />
                  <p className={cn("font-semibold text-2xl", activeColorClass)}>{analysisResult.marketCondition}</p>
                </div>
            </div>
        </CardContent>

        <CardFooter className="flex-col items-start p-6 pt-0">
            <Separator className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {indicators.map((indicator, index) => (
                    <IndicatorCard
                        key={indicator.name}
                        index={index}
                        icon={indicator.icon}
                        name={indicator.name}
                        score={indicator.value}
                        formula={indicator.formula}
                        rawData={indicator.rawData}
                    />
                ))}
                 <Link href="/learn/market-indicators" className="group block h-full">
                   <Card className="h-24 hover:bg-muted/50 transition-colors">
                        <CardContent className="p-4 flex flex-1 items-center justify-between gap-4 h-full">
                            <div className="space-y-1 flex-grow">
                                <p className="text-sm font-semibold flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                    Pelajari Skor Ini
                                </p>
                            </div>
                            <div className="text-right flex-shrink-0 pl-2 text-muted-foreground group-hover:text-primary transition-colors">
                                <ArrowRight className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </CardFooter>
    </Card>
  );
}
