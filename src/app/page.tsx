
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart2, Zap, ShieldCheck } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from 'react';
import { CoinGeckoAPI, Coin } from '@/lib/api-clients/crypto/coinGecko';

export default function HomePage() {
  const [topCoins, setTopCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopCoins = async () => {
      try {
        const coinGecko = new CoinGeckoAPI();
        const data = await coinGecko.getCoinsMarkets({
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 50,
          page: 1,
          sparkline: false,
        });
        setTopCoins(data);
      } catch (err) {
        console.error('Failed to fetch top coins:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopCoins();
  }, []);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-50 dark:to-gray-400">
                    Clarity in the Chaos of Crypto
                  </h1>
                  <p className="max-w-[600px] text-gray-600 dark:text-gray-400 md:text-xl">
                    Your all-in-one command center for market analysis, news, and deep-dives into the crypto world. Make informed decisions with powerful, easy-to-use tools.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/market">
                    <Button size="lg" className="w-full min-[400px]:w-auto">
                      Explore Markets
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative h-64 md:h-auto">
                 <Carousel className="w-full max-w-xs mx-auto md:max-w-sm lg:max-w-md">
                  <CarouselContent>
                    {topCoins.slice(0, 10).map((coin) => (
                      <CarouselItem key={coin.id}>
                        <div className="p-1">
                          <Card>
                            <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
                              <img src={coin.image} alt={coin.name} className="w-16 h-16 mb-2" />
                              <span className="text-xl font-semibold">{coin.name} ({coin.symbol.toUpperCase()})</span>
                              <p className="text-lg">${coin.current_price.toLocaleString()}</p>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Everything You Need, Nothing You Don't
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  We've built a suite of tools designed to give you a competitive edge in the fast-paced world of cryptocurrency.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold">Comprehensive Market Data</h3>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Real-time prices, historical charts, and global metrics at your fingertips.
                </p>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold">Degen & DeFi Analytics</h3>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Uncover hidden gems with our tools for exploring DEX pairs, yield farms, and new token listings.
                </p>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold">Sentiment Analysis</h3>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Go beyond the numbers with our Fear & Greed Index integration to gauge market sentiment.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
