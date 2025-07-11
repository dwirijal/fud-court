
'use client';

import { useEffect, useState } from "react";
import { Bitcoin, HelpCircle, Sigma, Repeat } from "lucide-react";
import { MarketIndicatorCard } from "@/components/molecules/market-indicator-card";
import { FearGreedGauge } from "@/components/molecules/fear-greed-gauge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { CryptoData } from "@/types";
import { DominanceBar } from "../molecules/dominance-bar";

interface FearGreedData {
    value: string;
    value_classification: string;
}

interface GlobalData {
    data: {
        total_market_cap: { [currency: string]: number };
        total_volume: { [currency: string]: number };
        market_cap_percentage: { [currency: string]: number };
    }
}

async function getFearGreedIndex(): Promise<FearGreedData | null> {
    try {
        const response = await fetch('https://api.alternative.me/fng/?limit=1', { next: { revalidate: 3600 } });
        if (!response.ok) return null;
        const data = await response.json();
        return data.data[0];
    } catch (error) {
        console.error("Failed to fetch Fear & Greed Index:", error);
        return null;
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
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const [fearGreedData, globalData] = await Promise.all([
                getFearGreedIndex(),
                getGlobalMarketData(),
            ]);

            setData({
                fearGreed: fearGreedData,
                global: globalData,
            });
            setIsLoading(false);
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Skeleton className="h-64 lg:col-span-1" />
                <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-28" />
                    ))}
                </div>
            </div>
        );
    }
    
    const btcDom = data.global?.market_cap_percentage?.btc ?? 0;
    const ethDom = data.global?.market_cap_percentage?.eth ?? 0;
    const totalMarketCap = data.global?.total_market_cap?.usd ?? 0;
    const totalVolume = data.global?.total_volume?.usd ?? 0;
    
    // Calculate Total 2 and Total 3
    const btcMarketCap = (totalMarketCap * btcDom) / 100;
    const ethMarketCap = (totalMarketCap * ethDom) / 100;
    const total2 = totalMarketCap - btcMarketCap;
    const total3 = total2 - ethMarketCap;

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3">
                <FearGreedGauge 
                    value={parseInt(data.fearGreed?.value || '0', 10)}
                    classification={data.fearGreed?.value_classification || 'Neutral'}
                />
            </div>
            <div className="lg:w-2/3 grid grid-cols-2 sm:grid-cols-3 gap-6">
                <DominanceBar title="BTC Dominance" percentage={btcDom} icon={Bitcoin} />
                <DominanceBar title="ETH Dominance" percentage={ethDom} icon={HelpCircle} />
                <MarketIndicatorCard title="24h Volume" value={formatCurrency(totalVolume)} icon={Repeat} />
                <MarketIndicatorCard title="Total Marketcap" value={formatCurrency(totalMarketCap)} icon={Sigma} />
                <MarketIndicatorCard title="Total 2 (excl. BTC)" value={formatCurrency(total2)} icon={Sigma} />
                <MarketIndicatorCard title="Total 3 (excl. BTC/ETH)" value={formatCurrency(total3)} icon={Sigma} />
            </div>
        </div>
    );
}
