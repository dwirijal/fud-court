
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

      <section className="py-12 md:py-16 border-y bg-background/50">
        <div className="container space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Gambaran Pasar
            </h2>
            <p className="text-lg text-muted-foreground">
              Tampilan komprehensif dari indikator pasar utama dan aset berkinerja terbaik.
            </p>
          </div>
          
          <MarketSummaryCard marketData={marketData} />
          <MarketStatsCard marketStats={marketData} />
          <MarketCarousel data={cryptoData || []} />
        </div>
      </section>
    </>
  );
}
