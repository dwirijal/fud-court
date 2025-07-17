
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { MarketStats } from "@/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from 'react';
import anime from "animejs";

const formatCurrency = (value: number) => {
    if (!value) return '$0.00';
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
            round: formatter === formatPercentage ? 100 : undefined,
            update: () => {
                setValue(targetRef.current.value);
            }
        });

        hasAnimated.current = true;

        return () => {
          animation.pause();
        }
    }, [to, delay, formatter]);

    return <p className={className}>{formatter(value)}</p>;
};

function StatCard({ label, value, underlyingValue, colorClass, index, valueIsPercentage = false }: { label: string, value: number, underlyingValue?: number, colorClass: string, index: number, valueIsPercentage?: boolean }) {
    return (
        <motion.div
            className="h-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: index * 0.1 }}
            variants={cardVariants}
        >
            <div className="card-primary h-full flex flex-col justify-between p-4">
                <div className="flex items-center gap-2">
                    <span className={cn("h-2.5 w-2.5 rounded-full", colorClass)} />
                    <p className="text-xs font-medium text-text-secondary">{label}</p>
                </div>
                <div>
                     <AnimatedStatNumber
                        to={value}
                        formatter={valueIsPercentage ? formatPercentage : formatCurrency}
                        className="text-2xl font-semibold font-mono"
                        delay={index * 100}
                    />
                    {underlyingValue !== undefined && <AnimatedStatNumber
                        to={underlyingValue}
                        formatter={formatCurrency}
                        className="text-xs font-medium text-text-secondary"
                        delay={index * 100}
                    />}
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
        return <Skeleton className="h-[220px] lg:h-[120px] w-full rounded-3" />;
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
        defiTotalTvl,
        ethTvl,
        solTvl,
        arbTvl,
        btcTvl
    } = marketStats;

    const marketDominanceStats = [
        { label: "Total Market Cap", value: totalMarketCap, colorClass: "bg-sky-400" },
        { label: "Bitcoin Dominance", value: btcDominance, underlyingValue: btcMarketCap, colorClass: "bg-orange-400", valueIsPercentage: true },
        { label: "ETH Dominance", value: ethDominance, underlyingValue: ethMarketCap, colorClass: "bg-gray-400", valueIsPercentage: true },
        { label: "SOL Dominance", value: solDominance, underlyingValue: solMarketCap, colorClass: "bg-purple-400", valueIsPercentage: true },
        { label: "Stablecoin Dominance", value: stablecoinDominance, underlyingValue: stablecoinMarketCap, colorClass: "bg-green-400", valueIsPercentage: true },
    ];
    
    const tvlStats = [
        { label: "Total DeFi TVL", value: defiTotalTvl, colorClass: "bg-indigo-400" },
        { label: "Bitcoin TVL", value: btcTvl, colorClass: "bg-orange-400" },
        { label: "Ethereum TVL", value: ethTvl, colorClass: "bg-gray-400" },
        { label: "Solana TVL", value: solTvl, colorClass: "bg-purple-400" },
        { label: "Arbitrum TVL", value: arbTvl, colorClass: "bg-blue-400" },
    ];

    return (
        <Card className="card-primary p-5">
            <CardHeader className="p-0 mb-4">
                <CardTitle className="text-2xl font-semibold">Dominasi & TVL</CardTitle>
                <CardDescription className="text-base text-text-secondary">
                    Perbandingan kapitalisasi pasar (MC) dan nilai terkunci (TVL) berbagai ekosistem terhadap total pasar kripto.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {marketDominanceStats.map((stat, index) => (
                        <StatCard key={stat.label} {...stat} index={index} />
                    ))}
                </div>
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {tvlStats.map((stat, index) => (
                        <StatCard key={stat.label} {...stat} index={index + marketDominanceStats.length} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
