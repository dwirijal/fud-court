
import { MarketIndicatorCard } from "@/components/molecules/market-indicator-card";
import { Bitcoin, Flame, HelpCircle } from "lucide-react";

interface FearGreedData {
    value: string;
    value_classification: string;
}

interface GlobalData {
    data: {
        total_market_cap: { [currency: string]: number };
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

async function getTopCoinsMarketCap() {
     try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=2&page=1&sparkline=false', { next: { revalidate: 300 } });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch top coins market cap from CoinGecko:", error);
        return null;
    }
}

export async function MarketIndicators() {
    const [fearGreedData, globalData, topCoins] = await Promise.all([
        getFearGreedIndex(),
        getGlobalMarketData(),
        getTopCoinsMarketCap()
    ]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    }
    
    const totalMarketCap = globalData?.total_market_cap?.usd ?? 0;
    const btcDominance = globalData?.market_cap_percentage?.btc ?? 0;
    const usdtDominance = globalData?.market_cap_percentage?.usdt ?? 0;

    const btcMarketCap = topCoins?.find((c: any) => c.id === 'bitcoin')?.market_cap ?? 0;
    const ethMarketCap = topCoins?.find((c: any) => c.id === 'ethereum')?.market_cap ?? 0;

    const total2 = totalMarketCap > 0 && btcMarketCap > 0 ? totalMarketCap - btcMarketCap : 0;
    const total3 = total2 > 0 && ethMarketCap > 0 ? total2 - ethMarketCap : 0;

    const indicators = [
        { title: "Fear & Greed Index", value: fearGreedData ? `${fearGreedData.value} (${fearGreedData.value_classification})` : "N/A", icon: Flame },
        { title: "BTC Dominance", value: `${btcDominance.toFixed(2)}%`, icon: Bitcoin },
        { title: "USDT Dominance", value: `${usdtDominance.toFixed(2)}%`, icon: HelpCircle },
        { title: "Total Marketcap", value: formatCurrency(totalMarketCap), icon: HelpCircle },
        { title: "Total 2 (excl. BTC)", value: formatCurrency(total2), icon: HelpCircle },
        { title: "Total 3 (excl. BTC & ETH)", value: formatCurrency(total3), icon: HelpCircle },
    ];

    return (
        <section className="py-16 md:py-24 bg-card/10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                    {indicators.map((indicator, index) => (
                         <MarketIndicatorCard key={index} title={indicator.title} value={indicator.value} icon={indicator.icon} />
                    ))}
                </div>
            </div>
        </section>
    );
}
