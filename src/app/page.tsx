
import { fetchMarketData, getTopCoins } from "@/lib/coingecko";
import { MarketCarousel } from "@/components/molecules/market-carousel";
import { ModernHero } from "@/components/organisms/modern-hero";
import { MarketSummaryCard } from "@/components/organisms/market-summary-card";
import { MarketStatsCard } from "@/components/organisms/market-stats-card";
import { FearGreedGauge } from "@/components/molecules/fear-greed-gauge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function Home() {
  const [rawTopCoins, marketData] = await Promise.all([
    getTopCoins(1, 50),
    fetchMarketData(),
  ]);

  const topCoins = rawTopCoins 
    ? [...rawTopCoins].sort((a, b) => b.market_cap - a.market_cap) 
    : [];

  return (
    <>
      <ModernHero />
      
      <div className="container-full section-spacing">
        <div className="bento-container">
          {/* Market Summary - Large */}
          <div className="lg:col-span-4 w-full">
            <MarketSummaryCard marketData={marketData} />
          </div>
          
          {/* Market Stats - Medium */}
          <div className="lg:col-span-2 w-full">
             <MarketStatsCard marketStats={marketData} />
          </div>

          {/* Fear & Greed Gauge - Small */}
          <div className="lg:col-span-2 w-full">
            <FearGreedGauge value={72} classification="Greed" />
          </div>

          {/* Placeholder Cards */}
          <div className="lg:col-span-2 w-full">
            <Card className="card-primary h-full p-6">
              <h3 className="text-lg font-semibold mb-2">Portfolio Tracker</h3>
              <p className="text-text-secondary">Coming Soon</p>
            </Card>
          </div>

          <div className="lg:col-span-2 w-full">
            <Card className="card-primary h-full p-6">
              <h3 className="text-lg font-semibold mb-2">Gas Tracker</h3>
              <p className="text-text-secondary">Coming Soon</p>
            </Card>
          </div>

          {/* Popular Assets - Full Width */}
          <Card className="lg:col-span-6 card-primary p-5">
            <h2 className="text-xl font-semibold mb-4">Aset Populer</h2>
            <MarketCarousel data={topCoins || []} />
            <div className="flex justify-center mt-6">
              <Button size="lg" asChild>
                  <Link href="/markets">
                      Lihat Semua Pasar
                  </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
