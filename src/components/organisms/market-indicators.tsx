
'use client';

import { useEffect, useState } from "react";
import { Bitcoin, HelpCircle, Sigma, Repeat } from "lucide-react";
import { MarketIndicatorCard } from "@/components/molecules/market-indicator-card";
import { FearGreedGauge } from "@/components/molecules/fear-greed-gauge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { CryptoData } from "@/types";
import { CryptoSparklineCard } from "../molecules/crypto-sparkline-card";

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

async function getTopCoinsWithSparkline(): Promise<CryptoData[]> {
     try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum&order=market_cap_desc&per_page=2&page=1&sparkline=true&price_change_percentage=7d', { next: { revalidate: 300 } });
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch top coins with sparkline from CoinGecko:", error);
        return [];
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
            const [fearGreedData, globalData, topCoins] = await Promise.all([
                getFearGreedIndex(),
                getGlobalMarketData(),
                getTopCoinsWithSparkline()
            ]);

            const btcData = topCoins?.find(c => c.id === 'bitcoin');
            const ethData = topCoins?.find(c => c.id === 'ethereum');
            const totalMarketCap = globalData?.total_market_cap?.usd ?? 0;

            setData({
                fearGreed: fearGreedData,
                btc: btcData,
                eth: ethData,
                totalMarketCap,
                totalVolume: globalData?.total_volume?.usd ?? 0,
                total2: totalMarketCap > 0 && btcData ? totalMarketCap - btcData.market_cap : 0,
                total3: totalMarketCap > 0 && btcData && ethData ? totalMarketCap - btcData.market_cap - ethData.market_cap : 0,
            });
            setIsLoading(false);
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-64 md:col-span-1" />
                <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-28" />
                    ))}
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3">
                <FearGreedGauge 
                    value={parseInt(data.fearGreed?.value || '0', 10)}
                    classification={data.fearGreed?.value_classification || 'Neutral'}
                />
            </div>
            <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {data.btc && <CryptoSparklineCard data={data.btc} />}
                {data.eth && <CryptoSparklineCard data={data.eth} />}
                <MarketIndicatorCard title="24h Volume" value={formatCurrency(data.totalVolume)} icon={Repeat} />
                <MarketIndicatorCard title="Total Marketcap" value={formatCurrency(data.totalMarketCap)} icon={Sigma} />
            </div>
        </div>
    );
}
