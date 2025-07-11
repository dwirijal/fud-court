
import { NewsCard } from "@/components/molecules/news-card";
import { getPosts } from "@/lib/ghost";
import { fetchMarketData, getTopCoins } from "@/lib/coingecko";
import { MarketCarousel } from "@/components/molecules/market-carousel";
import { HeroSection } from "@/components/organisms/hero-section";
import { MarketSummaryCard } from "@/components/organisms/market-summary-card";
import { MarketStatsCard } from "@/components/organisms/market-stats-card";

export default async function Home() {
  // Fetch all data concurrently for better performance
  const [posts, cryptoData, marketStats] = await Promise.all([
    getPosts(),
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
              Market Overview
            </h2>
            <p className="text-muted-foreground">
              A comprehensive look at key market indicators and top-performing assets.
            </p>
          </div>
          
          <div className="space-y-8">
            <MarketSummaryCard />
            <MarketStatsCard marketStats={marketStats} />
          </div>

          <div className="mt-16">
            <MarketCarousel data={cryptoData} />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-extrabold tracking-tight font-headline mb-4">
              Latest News
            </h2>
            <p className="text-muted-foreground mb-12">
              Stay informed with the latest updates and analysis from the crypto world.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {posts.slice(0, 12).map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
