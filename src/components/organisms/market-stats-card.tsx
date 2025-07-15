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

const AnimatedStatNumber = ({ to, formatter, className, delay = 0 }: { to: number, formatter: (val: number) => string, className?: string, delay?: number }) => {
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
            duration: 1200,
            delay: delay,
            easing: 'easeOutCubic',
            update: () => {
                setValue(target.value);
            }
        });
    }, [to, delay, target]);

    return <p className={className}>{formatter(value)}</p>;
};

function StatCard({ label, value, marketCap, colorClass, index }: { label: string, value: number, marketCap: number, colorClass: string, index: number }) {
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
                    />
                    <AnimatedStatNumber
                        to={marketCap}
                        formatter={formatCurrency}
                        className="text-xs text-muted-foreground font-mono"
                        delay={index * 100}
                    />
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
        stablecoinMarketCap,
    } = marketStats;

    const stats = [
        { label: "Bitcoin Dominance", value: btcDominance, marketCap: btcMarketCap, colorClass: "bg-chart-1" },
        { label: "Ethereum Dominance", value: ethDominance, marketCap: ethMarketCap, colorClass: "bg-chart-2" },
        { label: "Solana Dominance", value: solDominance, marketCap: solMarketCap, colorClass: "bg-chart-3" },
        { label: "Stablecoin Dominance", value: stablecoinDominance, marketCap: stablecoinMarketCap, colorClass: "bg-chart-4" },
    ];

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Market Dominance</CardTitle>
                <CardDescription>
                    Dominasi Pasar (Cap: {formatCurrency(totalMarketCap)}) Bitcoin mendominasi {formatPercentage(btcDominance)} dari total market cap, diikuti oleh Ethereum ({formatPercentage(ethDominance)}) dan lainnya.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <StatCard key={stat.label} {...stat} index={index} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}