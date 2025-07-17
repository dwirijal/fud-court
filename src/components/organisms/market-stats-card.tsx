'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { MarketStats } from "@/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from 'react';
import anime from "animejs";

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

const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const AnimatedStatNumber = ({ to, formatter, className, delay = 0, isPercentage = false }: { to: number, formatter: (val: number) => string, className?: string, delay?: number, isPercentage?: boolean }) => {
    const [value, setValue] = useState(0);
    const hasAnimated = useRef(false);
    const targetRef = useRef({ value: 0 });

    useEffect(() => {
        if (hasAnimated.current) {
            setValue(to);
            return;
        }
        
        const animation = anime({
            targets: targetRef.current,
            value: to,
            duration: 1200,
            delay: delay,
            easing: 'easeOutCubic',
            update: () => {
                setValue(targetRef.current.value);
            }
        });

        hasAnimated.current = true;

        return () => {
          animation.pause();
        }
    }, [to, delay]);

    return <p className={className}>{formatter(value)}</p>;
};

function StatCard({ label, value, underlyingValue, colorClass, index, valueIsTvl = false }: { label: string, value: number, underlyingValue: number, colorClass: string, index: number, valueIsTvl?: boolean }) {
    return (
        <motion.div
            className="h-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: index * 0.1 }}
            variants={cardVariants}
        >
            <div className="rounded-lg border bg-card text-card-foreground p-4 flex flex-col justify-between h-full shadow-inner">
                <div className="flex items-center gap-2">
                    <span className={cn("h-2.5 w-2.5 rounded-full", colorClass)} />
                    <p className="text-sm font-medium text-muted-foreground">{label}</p>
                </div>
                <div>
                     <AnimatedStatNumber
                        to={value}
                        formatter={formatPercentage}
                        className="text-2xl font-bold"
                        delay={index * 100}
                        isPercentage
                    />
                    <AnimatedStatNumber
                        to={underlyingValue}
                        formatter={formatCurrency}
                        className="text-xs text-muted-foreground font-mono"
                        delay={index * 100}
                    />
                    {valueIsTvl && <p className="text-xs text-muted-foreground/80 font-mono -mt-1">TVL</p>}
                </div>
            </div>
        </motion.div>
    );
}

interface MarketStatsCardProps {
    marketStats: MarketStats | null;
}

export function MarketStatsCard({ marketStats }: MarketStatsCardProps) {
    if (!marketStats) {
        return <Skeleton className="h-[220px] lg:h-[120px] w-full" />;
    }
    
    const { 
        totalMarketCap,
        btcDominance,
        ethDominance,
        solDominance,
        stablecoinDominance,
        btcMarketCap,
        ethMarketCap,
        solMarketCap,
        ethTvl,
        solTvl,
        stablecoinMarketCap,
    } = marketStats;

    const stats = [
        { label: "Bitcoin Dominance", value: btcDominance, underlyingValue: btcMarketCap, colorClass: "bg-orange-400" },
        { label: "ETH Dominance", value: ethDominance, underlyingValue: ethMarketCap, colorClass: "bg-gray-400" },
        { label: "ETH Ecosystem", value: (ethTvl / totalMarketCap) * 100, underlyingValue: ethTvl, colorClass: "bg-indigo-400", valueIsTvl: true },
        { label: "SOL Dominance", value: solDominance, underlyingValue: solMarketCap, colorClass: "bg-purple-400" },
        { label: "SOL Ecosystem", value: (solTvl / totalMarketCap) * 100, underlyingValue: solTvl, colorClass: "bg-fuchsia-400", valueIsTvl: true },
        { label: "Stablecoin Dominance", value: stablecoinDominance, underlyingValue: stablecoinMarketCap, colorClass: "bg-green-400" },
    ];

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Market Dominance</CardTitle>
                <CardDescription>
                    Perbandingan kapitalisasi pasar dan nilai terkunci (TVL) berbagai ekosistem terhadap total pasar kripto (Cap: {formatCurrency(totalMarketCap)}).
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {stats.map((stat, index) => (
                        <StatCard key={stat.label} {...stat} index={index} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
