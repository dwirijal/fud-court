import { NewsCard } from "@/components/molecules/news-card";
import { Button } from "@/components/ui/button";
import { getPosts } from "@/lib/ghost";
import { getTopCoins } from "@/lib/coingecko";
import Link from "next/link";
import Image from "next/image";
import { MarketCarousel } from "@/components/molecules/market-carousel";

export default async function Home() {
  const posts = await getPosts();
  const cryptoData = await getTopCoins(10);

  return (
    <>
      <section className="relative flex items-center justify-center h-screen overflow-hidden text-center">
        <div className="absolute inset-0 z-0 opacity-[0.03]">
          <Image
            src="https://placehold.co/1600x900.png"
            alt="Abstract background grid"
            fill
            className="object-cover"
            data-ai-hint="abstract grid"
            priority
          />
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-semibold font-headline tracking-tight mb-6">
            Clarity in Chaos.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Fud Court cuts through the market noise with data-driven analysis and unbiased news, empowering you to make smarter crypto investment decisions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/markets">Explore Markets</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
               <Link href="/news">Read Latest News</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-semibold tracking-tight font-headline mb-4">
              Market Overview
            </h2>
            <p className="text-muted-foreground mb-12">
              Get a quick glance at the latest movements in the crypto market.
            </p>
          </div>
          <MarketCarousel data={cryptoData} />
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card/20 border-t border-b border-border">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-semibold tracking-tight font-headline mb-4">
              Latest News
            </h2>
            <p className="text-muted-foreground mb-12">
              Stay informed with the latest updates and analysis from the crypto world.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
