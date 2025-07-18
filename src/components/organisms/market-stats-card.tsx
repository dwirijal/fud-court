
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { MarketStats } from "@/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from 'react';
import anime from "animejs";
import { formatCurrency } from "@/lib/formatters";

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

function StatItem({ label, value, underlyingValue, colorClass, delay = 0, valueIsPercentage = false }: { label: string, value: number, underlyingValue?: number, colorClass: string, delay?: number, valueIsPercentage?: boolean }) {
    return (
        <motion.div
            className="card-primary p-4 flex flex-col justify-between"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: delay * 0.1 }}
            variants={cardVariants}
        >
            <div className="flex items-center gap-2">
                <span className={cn("h-2.5 w-2.5 rounded-full", colorClass)} />
                <p className="text-xs font-medium text-text-secondary">{label}</p>
            </div>
            <div>
                 <AnimatedStatNumber
                    to={value}
                    formatter={valueIsPercentage ? formatPercentage : (val) => formatCurrency(val, 'usd', true)}
                    className="text-2xl font-semibold font-mono"
                    delay={delay * 100}
                />
                {underlyingValue !== undefined && <AnimatedStatNumber
                    to={underlyingValue}
                    formatter={(val) => formatCurrency(val, 'usd', true)}
                    className="text-xs font-medium text-text-secondary"
                    delay={delay * 100}
                />}
            </div>
        </motion.div>
    );
}

interface MarketStatsCardProps {
    marketStats: MarketStats | null;
}

export function MarketStatsCard({ marketStats }: MarketStatsCardProps) {
    if (!marketStats) {
        return <Skeleton className="h-full w-full rounded-3" />;
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
        <Card className="card-primary h-full flex flex-col">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Dominasi & TVL</CardTitle>
                <CardDescription className="text-base text-text-secondary">
                    Perbandingan kapitalisasi pasar (MC) dan nilai terkunci (TVL).
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-3">
                {marketDominanceStats.map((stat, index) => (
                    <StatItem key={stat.label} {...stat} delay={index} />
                ))}
                {tvlStats.map((stat, index) => (
                    <StatItem key={stat.label} {...stat} delay={index + marketDominanceStats.length} />
                ))}
            </CardContent>
        </Card>
    );
}
