
'use client';

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MarketDominancePieChart } from "../molecules/market-dominance-pie-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface GlobalData {
    data: {
        total_market_cap: { [currency: string]: number };
        market_cap_percentage: { [currency: string]: number };
    }
}

async function getGlobalMarketData(): Promise<GlobalData['data'] | null> {
     try {
        const response = await fetch('https://api.coingecko.com/api/v3/global', { next: { revalidate: 300 } });
        if (!response.ok) return null;
        const data: GlobalData = await response.json();
        return data.data;
    } catch (error) {
        console.error("Failed to fetch Global Market Data from CoinGecko:", error);
        return null;
    }
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

export function MarketIndicators() {
    const [isLoading, setIsLoading] = useState(true);
    const [chartData, setChartData] = useState<any[]>([]);
    const [totalMarketCap, setTotalMarketCap] = useState('$0.00T');

    useEffect(() => {
        const fetchData = async () => {
            const globalData = await getGlobalMarketData();
            if (globalData) {
                const btcDom = globalData.market_cap_percentage?.btc ?? 0;
                const ethDom = globalData.market_cap_percentage?.eth ?? 0;
                const othersDom = 100 - btcDom - ethDom;

                setChartData([
                    { name: 'Bitcoin', value: btcDom, fill: 'hsl(var(--chart-1))' },
                    { name: 'Ethereum', value: ethDom, fill: 'hsl(var(--chart-2))' },
                    { name: 'Others', value: othersDom, fill: 'hsl(var(--chart-3))' },
                ]);

                setTotalMarketCap(formatCurrency(globalData.total_market_cap?.usd ?? 0));
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
             <div className="flex flex-col items-center">
                <Skeleton className="h-8 w-48 mb-4" />
                <Skeleton className="h-64 w-64 rounded-full" />
             </div>
        );
    }
    
    return (
        <Card className="bg-transparent border-none shadow-none">
            <CardHeader className="items-center text-center p-0 mb-4">
                <CardDescription>Total Market Cap</CardDescription>
                <CardTitle className="text-4xl font-bold font-mono">{totalMarketCap}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <MarketDominancePieChart data={chartData} />
            </CardContent>
        </Card>
    );
}
