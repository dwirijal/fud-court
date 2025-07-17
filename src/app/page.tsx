<<<<<<< HEAD

=======
<<<<<<< HEAD

=======
>>>>>>> b058873b045abf5277ae8797dcaa268e60af95fe
import { getPosts } from "@/lib/ghost";
>>>>>>> d32eafdf79fc1270a0712b11f562506629d2d989
import { fetchMarketData, getTopCoins } from "@/lib/coingecko";
import { MarketCarousel } from "@/components/molecules/market-carousel";
import { HeroSection } from "@/components/organisms/hero-section";
import { MarketSummaryCard } from "@/components/organisms/market-summary-card";
import { MarketStatsCard } from "@/components/organisms/market-stats-card";
import Link from "next/link";
import { CryptoData } from "@/types";

export default async function Home() {
  // Fetch all data concurrently for better performance
<<<<<<< HEAD
  const [rawTopCoins, marketData] = await Promise.all([
=======
<<<<<<< HEAD
  const [cryptoData, marketData] = await Promise.all([
    getTopCoins(1, 10),
=======
  const [topCoins, marketData] = await Promise.all([
>>>>>>> b058873b045abf5277ae8797dcaa268e60af95fe
    getTopCoins(1, 50),
>>>>>>> d32eafdf79fc1270a0712b11f562506629d2d989
    fetchMarketData(),
  ]);

  const topCoins = rawTopCoins 
    ? [...rawTopCoins].sort((a, b) => b.market_cap - a.market_cap) 
    : [];

  return (
    <>
      <HeroSection />
      
      <main>
        <section className="bg-card/20 border-t border-b border-border py-6 md:py-8">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
              <h2 className="text-4xl font-extrabold tracking-tight font-headline mb-4">
                Gambaran Pasar
              </h2>
              <p className="text-muted-foreground">
                Tampilan komprehensif dari indikator pasar utama dan aset berkinerja terbaik.
              </p>
            </div>
            
            <div className="space-y-8">
              <MarketSummaryCard marketData={marketData} />
              <MarketStatsCard marketStats={marketData} />
            </div>

<<<<<<< HEAD
            <div className="mt-16">
              <MarketCarousel data={topCoins || []} />
              <div className="flex justify-center mt-4">
                <Link href="/markets" className="text-primary hover:underline">
                  Lihat Semua
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
=======
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
>>>>>>> b058873b045abf5277ae8797dcaa268e60af95fe
    </>
  );
}
