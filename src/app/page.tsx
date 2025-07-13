
import { getPosts } from "@/lib/ghost";
import { fetchMarketData, getTopCoins } from "@/lib/coingecko";
import { MarketCarousel } from "@/components/molecules/market-carousel";
import { HeroSection } from "@/components/organisms/hero-section";
import { MarketSummaryCard } from "@/components/organisms/market-summary-card";
import { MarketStatsCard } from "@/components/organisms/market-stats-card";
import { NewsTicker } from "@/components/molecules/news-ticker";

export default async function Home() {
  // Fetch all data concurrently for better performance
  const [newsPosts, cryptoData, marketData] = await Promise.all([
    getPosts({ tag: 'news', limit: 20 }), // Fetch 20 latest news for the ticker
    getTopCoins(10),
    fetchMarketData(),
  ]);

  return (
    <>
      <HeroSection />

      <section className="py-16 md:py-24 bg-card/20 border-t border-b border-border">
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

          <div className="mt-16">
            <MarketCarousel data={cryptoData || []} />
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12 border-b">
        <NewsTicker posts={newsPosts} />
      </section>
    </>
  );
}
