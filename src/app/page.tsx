import { AppShell } from "@/components/organisms/app-shell";
import { CryptoCard } from "@/components/molecules/crypto-card";
import { NewsCard } from "@/components/molecules/news-card";
import { Button } from "@/components/ui/button";
import { getPosts } from "@/lib/ghost";
import type { CryptoData } from "@/types";

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
      <section className="py-24 md:py-32 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold font-headline mb-4 text-primary">
            Fud Court
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Where crypto claims are put on trial. We cut through the noise to deliver data-driven insights and unbiased news, helping you make smarter investment decisions.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg">View Markets</Button>
            <Button size="lg" variant="outline">Read News</Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 space-y-16 pb-24">
        <div>
          <h2 className="text-4xl font-bold tracking-tight font-headline mb-8 text-center">
            Market Overview
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {MOCK_CRYPTO_DATA.map((crypto) => (
              <CryptoCard key={crypto.id} data={crypto} />
            ))}
          </div>
        </div>

        <div>
           <h3 className="text-4xl font-bold tracking-tight font-headline mb-8 text-center">
            Latest News
          </h3>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
