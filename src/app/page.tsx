
import { fetchMarketData, getTopCoins } from "@/lib/coingecko";
import { MarketCarousel } from "@/components/molecules/market-carousel";
import { HeroSection } from "@/components/organisms/hero-section";
import { MarketSummaryCard } from "@/components/organisms/market-summary-card";
import { MarketStatsCard } from "@/components/organisms/market-stats-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  // Fetch all data concurrently for better performance
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
      
      <main>
        <section className="bg-bg-secondary/50 border-t border-b border-bg-tertiary section-spacing">
          <div className="container-full">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="headline-2 mb-4">
                Gambaran Pasar
              </h2>
              <p className="body-large text-text-secondary">
                Tampilan komprehensif dari indikator pasar utama dan aset berkinerja terbaik.
              </p>
            </div>
            
            <div className="space-y-8">
              <MarketSummaryCard marketData={marketData} />
              <MarketStatsCard marketStats={marketData} />
            </div>

            <div className="mt-16">
              <MarketCarousel data={topCoins || []} />
              <div className="flex justify-center mt-8">
                <Button asChild variant="secondary">
                    <Link href="/markets">
                        Lihat Semua Pasar
                    </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
