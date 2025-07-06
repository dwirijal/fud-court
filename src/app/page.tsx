import { AppShell } from "@/components/organisms/app-shell";
import { CryptoCard } from "@/components/molecules/crypto-card";
import { NewsCard } from "@/components/molecules/news-card";
import { Button } from "@/components/ui/button";
import { getPosts } from "@/lib/ghost";
import type { CryptoData } from "@/types";
import Link from "next/link";
import Image from "next/image";

const MOCK_CRYPTO_DATA: CryptoData[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    price: 67123.45,
    change24h: 2.5,
    marketCap: 1320000000000,
    volume24h: 45000000000,
    sparkline: [3, 5, 4, 6, 7, 5, 8, 9, 8, 10],
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    price: 3456.78,
    change24h: -1.2,
    marketCap: 415200000000,
    volume24h: 22000000000,
    sparkline: [9, 8, 9, 7, 6, 8, 7, 5, 6, 4],
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    price: 145.67,
    change24h: 5.8,
    marketCap: 67100000000,
    volume24h: 3500000000,
    sparkline: [3, 4, 5, 4, 6, 7, 8, 9, 10, 12],
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    price: 0.45,
    change24h: 0.5,
    marketCap: 16200000000,
    volume24h: 500000000,
    sparkline: [5, 6, 5, 6, 5, 7, 6, 7, 6, 7],
  },
];

export default async function Home() {
  const posts = await getPosts();

  return (
    <AppShell>
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
          <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tight mb-6">
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

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold tracking-tight font-headline mb-4">
              Market Overview
            </h2>
            <p className="text-muted-foreground mb-12">
              Get a quick glance at the latest movements in the crypto market.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {MOCK_CRYPTO_DATA.map((crypto) => (
              <CryptoCard key={crypto.id} data={crypto} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card/20 border-t border-b border-border">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold tracking-tight font-headline mb-4">
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
    </AppShell>
  );
}
