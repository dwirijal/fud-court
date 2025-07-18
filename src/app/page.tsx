
import { fetchMarketData, getTopCoins } from "@/lib/coingecko";
import { MarketCarousel } from "@/components/molecules/market-carousel";
import { HeroSection } from "@/components/organisms/hero-section";
import { MarketSummaryCard } from "@/components/organisms/market-summary-card";
import { MarketStatsCard } from "@/components/organisms/market-stats-card";
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
      <HeroSection />
      
      <main className="container-full section-spacing">
        <div className="bento-container">
          <div className="lg:col-span-6 flex flex-col lg:flex-row gap-5">
            <div className="lg:col-span-4 w-full">
              <MarketSummaryCard marketData={marketData} />
            </div>
            <div className="lg:col-span-2 w-full">
               <MarketStatsCard marketStats={marketData} />
            </div>
          </div>

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
      </main>
    </>
  );
}
