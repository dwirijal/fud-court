
import { getPosts } from "@/lib/ghost";
import { fetchMarketData, getTopCoins } from "@/lib/coingecko";
import { MarketCarousel } from "@/components/molecules/market-carousel";
import { HeroSection } from "@/components/organisms/hero-section";
import { MarketSummaryCard } from "@/components/organisms/market-summary-card";
import { MarketStatsCard } from "@/components/organisms/market-stats-card";
import { NewsCard } from "@/components/molecules/news-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default async function Home() {
  // Fetch all data concurrently for better performance
  const [cryptoData, marketData, newsPosts] = await Promise.all([
    getTopCoins(1, 10),
    fetchMarketData(),
    getPosts({ limit: 4, tag: 'news' })
  ]);

  return (
    <>
      <HeroSection />

      <section className="py-12 md:py-16 border-y bg-background/50">
        <div className="container space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold tracking-tight font-headline mb-4">
              Gambaran Pasar
            </h2>
            <p className="text-lg text-muted-foreground">
              Tampilan komprehensif dari indikator pasar utama dan aset berkinerja terbaik.
            </p>
          </div>
          
          <div className="space-y-6">
            <MarketSummaryCard marketData={marketData} />
            <MarketStatsCard marketStats={marketData} />
          </div>

          <div>
            <MarketCarousel data={cryptoData || []} />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                <div className="max-w-xl">
                    <h2 className="text-4xl font-bold tracking-tight font-headline mb-4">
                      Berita & Analisis Terbaru
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      Ikuti terus perkembangan terkini, wawasan pasar, dan analisis mendalam dari tim kami.
                    </p>
                </div>
                <Button asChild variant="outline" className="flex-shrink-0">
                    <Link href="/news">
                        Lihat Semua Berita <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newsPosts.map((post) => (
                <NewsCard key={post.id} post={post} />
              ))}
            </div>
        </div>
      </section>
    </>
  );
}
