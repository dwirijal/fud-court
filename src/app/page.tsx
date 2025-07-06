import { AppShell } from "@/components/organisms/app-shell";
import { CryptoCard } from "@/components/molecules/crypto-card";
import { NewsCard } from "@/components/molecules/news-card";
import { getPosts } from "@/lib/ghost";
import type { CryptoData } from "@/types";

const MOCK_CRYPTO_DATA: CryptoData[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    price: 67123.45,
    change24h: 2.5,
    marketCap: 1.32,
    sparkline: [3, 5, 4, 6, 7, 5, 8, 9, 8, 10],
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    price: 3456.78,
    change24h: -1.2,
    marketCap: 415.2,
    sparkline: [9, 8, 9, 7, 6, 8, 7, 5, 6, 4],
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    price: 145.67,
    change24h: 5.8,
    marketCap: 67.1,
    sparkline: [3, 4, 5, 4, 6, 7, 8, 9, 10, 12],
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    price: 0.45,
    change24h: 0.5,
    marketCap: 16.2,
    sparkline: [5, 6, 5, 6, 5, 7, 6, 7, 6, 7],
  },
];

export default async function Home() {
  const posts = await getPosts();

  return (
    <AppShell>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          Dashboard
        </h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {MOCK_CRYPTO_DATA.map((crypto) => (
            <CryptoCard key={crypto.id} data={crypto} />
          ))}
        </div>

        <div className="space-y-4">
           <h3 className="text-2xl font-bold tracking-tight font-headline">
            Latest News
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
