
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { MarketStats } from "@/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MarketStatsCardProps {
    marketStats: MarketStats | null;
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

function StatCard({ label, value, marketCap, colorClass, index }: { label: string, value: string, marketCap: string, colorClass: string, index: number }) {
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
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-xs text-muted-foreground font-mono">{marketCap}</p>
                </div>
            </div>
        </motion.div>
    );
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
        { label: "Bitcoin Dominance", value: `${btcDominance.toFixed(2)}%`, marketCap: formatCurrency(btcMarketCap), colorClass: "bg-chart-1" },
        { label: "Ethereum Dominance", value: `${ethDominance.toFixed(2)}%`, marketCap: formatCurrency(ethMarketCap), colorClass: "bg-chart-2" },
        { label: "Solana Dominance", value: `${solDominance.toFixed(2)}%`, marketCap: formatCurrency(solMarketCap), colorClass: "bg-chart-3" },
        { label: "Stablecoin Dominance", value: `${stablecoinDominance.toFixed(2)}%`, marketCap: formatCurrency(stablecoinMarketCap), colorClass: "bg-chart-4" },
    ];

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Market Dominance</CardTitle>
                <CardDescription>Total Market Cap: <span className="font-bold font-mono">{formatCurrency(totalMarketCap)}</span></CardDescription>
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
