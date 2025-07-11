
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchMarketData } from '@/lib/coingecko';
import type { MarketAnalysisOutput } from '@/types';
import { analyzeMarketSentiment } from '@/ai/flows/market-analysis-flow';
import { saveMarketSnapshot, hasTodaySnapshot } from '@/lib/actions/snapshots';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Info, ArrowUpRight, BookOpen } from 'lucide-react';
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

const indicatorExplanations: Record<string, string> = {
    marketCapScore: "Measures current market valuation against its historical peak.",
    volumeScore: "Measures market activity based on daily vs. average volume.",
    fearGreedScore: "Represents the emotional sentiment of the market.",
    athScore: "Measures how far major assets are from their All-Time Highs.",
    marketBreadthScore: "Measures if movement is supported by many assets or just a few."
};

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

    useEffect(() => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        anime({
            targets: { value: 0 },
            value: to,
            round: 1,
            duration: 1200,
            delay: delay,
            easing: 'easeOutCubic',
            update: (anim) => {
                setValue((anim.targets[0] as any).value);
            }
        });
    }, [to, delay]);

    return <p className={className}>{value}</p>;
}

const AnimatedProgress = ({ value, className, indicatorClassName }: { value: number, className?: string, indicatorClassName?: string }) => {
    const [progressValue, setProgressValue] = useState(0);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        anime({
            targets: { value: 0 },
            value: value,
            duration: 1200,
            delay: 400,
            easing: 'easeOutCubic',
            update: (anim) => {
                setProgressValue((anim.targets[0] as any).value);
            }
        });
    }, [value]);
    
    return <Progress value={progressValue} className={className} indicatorClassName={indicatorClassName} />
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
        
        const todaySnapshotExists = await hasTodaySnapshot();
        
        const result = await analyzeMarketSentiment(marketData);
        setAnalysisResult(result);

        if (result && !todaySnapshotExists) {
            await saveMarketSnapshot(result);
        }

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
          <CardTitle className="text-2xl font-headline text-destructive">Analysis Failed</CardTitle>
          <CardDescription className="text-destructive/80 mt-2 text-center max-w-md">
            {error || "An unknown error occurred while analyzing market sentiment."}
          </CardDescription>
      </Card>
    );
  }
  
  const indicators = [
      { name: "Market Cap Score", value: analysisResult.components.marketCapScore, description: indicatorExplanations.marketCapScore },
      { name: "Volume Score", value: analysisResult.components.volumeScore, description: indicatorExplanations.volumeScore },
      { name: "Fear & Greed Score", value: analysisResult.components.fearGreedScore, description: indicatorExplanations.fearGreedScore },
      { name: "ATH Score", value: analysisResult.components.athScore, description: indicatorExplanations.athScore },
      { name: "Market Breadth Score", value: analysisResult.components.marketBreadthScore, description: indicatorExplanations.marketBreadthScore },
  ];
  
  const activeColorClass = getActiveColorClass(analysisResult.marketCondition);

  return (
    <TooltipProvider>
        <Card>
            <CardContent className="space-y-4 p-6">
                <Card className="bg-primary/5 border-primary/20 overflow-hidden">
                   <div className="flex justify-between items-center p-6">
                        <div className="space-y-2">
                           <CardTitle>Macro Sentiment Score</CardTitle>
                            <CardDescription>
                                Overall market health based on key indicators.
                            </CardDescription>
                             <Badge variant="secondary" className="cursor-help flex-shrink-0">
                                <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-chart-2" />
                                Confidence: {analysisResult.confidenceScore}%
                            </Badge>
                        </div>
                        <div className="text-right flex-shrink-0 pl-4">
                            <AnimatedNumber to={analysisResult.macroScore} className={cn("text-6xl font-bold tracking-tighter", activeColorClass)} />
                            <p className={cn("font-semibold text-xl", activeColorClass)}>{analysisResult.marketCondition}</p>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {indicators.map((indicator, index) => (
                        <Card key={indicator.name} className="flex flex-col">
                           <CardContent className="p-4 flex flex-1 items-center justify-between gap-4">
                                <div className="space-y-1 flex-grow">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="flex items-center gap-1.5 cursor-help">
                                                <p className="text-sm font-semibold">{indicator.name}</p>
                                                <Info className="h-3 w-3 text-muted-foreground" />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="max-w-xs">{indicator.description}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <p className="text-xs text-muted-foreground line-clamp-2">{indicator.description}</p>
                                </div>
                                <div className="text-right flex-shrink-0 pl-2">
                                    <AnimatedNumber to={indicator.value} className="text-3xl font-mono font-bold" delay={200 + index * 100} />
                                    <AnimatedProgress value={indicator.value} className="h-1.5 w-[60px] mt-1" indicatorClassName={cn(getProgressColorClass(indicator.value))} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    <Link href="/learn/market-indicators" className="group block">
                       <Card className="h-full flex flex-col items-center justify-center text-center p-4 bg-muted/50 hover:bg-muted transition-colors">
                           <BookOpen className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                           <p className="text-sm font-semibold mt-2 text-muted-foreground group-hover:text-primary transition-colors">Learn More</p>
                           <p className="text-xs text-muted-foreground">About these indicators</p>
                       </Card>
                    </Link>
                </div>
            </CardContent>
        </Card>
    </TooltipProvider>
  );
}
