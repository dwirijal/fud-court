<<<<<<< HEAD

=======
import { getPosts } from "@/lib/ghost";
>>>>>>> d32eafdf79fc1270a0712b11f562506629d2d989
import { fetchMarketData, getTopCoins } from "@/lib/coingecko";
import { MarketCarousel } from "@/components/molecules/market-carousel";
import { HeroSection } from "@/components/organisms/hero-section";
import { MarketSummaryCard } from "@/components/organisms/market-summary-card";
import { MarketStatsCard } from "@/components/organisms/market-stats-card";
import Link from "next/link";

export default async function Home() {
  // Fetch all data concurrently for better performance
<<<<<<< HEAD
  const [cryptoData, marketData] = await Promise.all([
    getTopCoins(1, 10),
=======
  const [topCoins, marketData] = await Promise.all([
    getTopCoins(1, 50),
>>>>>>> d32eafdf79fc1270a0712b11f562506629d2d989
    fetchMarketData(),
  ]);

  return (
    <>
      <HeroSection />

      <section className="py-12 md:py-16 border-y bg-background/50">
        <div className="container space-y-7">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Gambaran Pasar
            </h2>
            <p className="text-lg text-muted-foreground">
              Tampilan komprehensif dari indikator pasar utama dan aset berkinerja terbaik.
            </p>
          </div>
          
<<<<<<< HEAD
          <MarketSummaryCard marketData={marketData} />
          <MarketStatsCard marketStats={marketData} />
          <MarketCarousel data={cryptoData || []} />
=======
          <div className="space-y-8">
            <MarketSummaryCard marketData={marketData} />
            <MarketStatsCard marketStats={marketData} />
          </div>

          <div className="mt-16">
            <MarketCarousel data={topCoins || []} />
            <div className="flex justify-center mt-4">
              <Link href="/markets" className="text-primary hover:underline">
                Lihat Semua
              </Link>
            </div>
          </div>
>>>>>>> d32eafdf79fc1270a0712b11f562506629d2d989
        </div>
      </section>
    </>
  );
}
