
import { getPosts } from "@/lib/ghost";
import { fetchMarketData, getTopCoins } from "@/lib/coingecko";
import { MarketCarousel } from "@/components/molecules/market-carousel";
import { HeroSection } from "@/components/organisms/hero-section";
import { MarketSummaryCard } from "@/components/organisms/market-summary-card";
import { MarketStatsCard } from "@/components/organisms/market-stats-card";

export default async function Home() {
  // Fetch all data concurrently for better performance
  const [cryptoData, marketData] = await Promise.all([
    getTopCoins(1, 10),
    fetchMarketData(),
  ]);

  return (
    <>
      <HeroSection />

      <section className="py-16 md:py-24 bg-background/50 border-t border-b">
        <div className="container mx-auto px-4 space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl mb-4">
              Gambaran Pasar
            </h2>
            <p className="text-muted-foreground text-lg">
              Tampilan komprehensif dari indikator pasar utama dan aset berkinerja terbaik.
            </p>
          </div>
          
          <div className="space-y-8">
            <MarketSummaryCard marketData={marketData} />
            <MarketStatsCard marketStats={marketData} />
          </div>

          <div>
            <MarketCarousel data={cryptoData || []} />
          </div>
        </div>
      </section>
    </>
  );
}
