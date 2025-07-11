
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { MarketStats } from "@/types";

interface MarketStatsCardProps {
    marketStats: MarketStats | null;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        compactDisplay: 'short',
    }).format(value);
};

function StatRow({ label, value, progress, colorClass }: { label: string, value: string, progress: number, colorClass: string }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-baseline">
                <span className="font-medium">{label}</span>
                <span className="font-mono text-sm text-muted-foreground">{value}</span>
            </div>
            <Progress value={progress} indicatorClassName={colorClass} />
        </div>
    );
}

export function MarketStatsCard({ marketStats }: MarketStatsCardProps) {
    if (!marketStats) {
        return <Skeleton className="h-[400px] w-full" />;
    }
    
    const { 
        totalMarketCap,
        btcDominance,
        ethDominance,
        solDominance,
        stablecoinDominance,
    } = marketStats;

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Market Dominance</CardTitle>
                <CardDescription>Total Market Cap: <span className="font-bold font-mono">{formatCurrency(totalMarketCap)}</span></CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <StatRow 
                    label="Bitcoin (BTC)"
                    value={`${btcDominance.toFixed(2)}%`}
                    progress={btcDominance}
                    colorClass="bg-chart-1"
                />
                <StatRow 
                    label="Ethereum (ETH)"
                    value={`${ethDominance.toFixed(2)}%`}
                    progress={ethDominance}
                    colorClass="bg-chart-2"
                />
                 <StatRow 
                    label="Solana (SOL)"
                    value={`${solDominance.toFixed(2)}%`}
                    progress={solDominance}
                    colorClass="bg-chart-3"
                />
                 <StatRow 
                    label="Stablecoins"
                    value={`${stablecoinDominance.toFixed(2)}%`}
                    progress={stablecoinDominance}
                    colorClass="bg-chart-4"
                />
            </CardContent>
        </Card>
    );
}
