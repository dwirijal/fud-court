'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { CoinGeckoAPI, Coin } from '@/lib/api-clients/crypto/coinGecko';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeroSection } from '@/components/shared/HeroSection';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton component

const PER_PAGE = 20; // Number of coins to fetch per page

export default function CoinsPage() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const loader = useRef<HTMLDivElement>(null); // Ref for the loading indicator element

  const fetchCoins = useCallback(async (pageNumber: number) => {
    setLoadingMore(true);
    try {
      const coinGecko = new CoinGeckoAPI();
      const data = await coinGecko.getCoinsMarkets({
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: PER_PAGE,
        page: pageNumber,
        sparkline: false,
        price_change_percentage: '24h',
      });

      if (pageNumber === 1) {
        setCoins(data);
      } else {
        setCoins((prevCoins) => [...prevCoins, ...data]);
      }

      setHasMore(data.length === PER_PAGE);
    } catch (err) {
      setError('Failed to fetch top coins data.');
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch for page 1
    fetchCoins(1);
  }, [fetchCoins]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loadingMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      {
        root: null, // viewport
        rootMargin: '20px',
        threshold: 1.0,
      }
    );

    const currentLoader = loader.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, loadingMore]); // Re-run observer effect when hasMore or loadingMore changes

  // Effect to fetch more data when page number changes
  useEffect(() => {
    if (page > 1) {
      fetchCoins(page);
    }
  }, [page, fetchCoins]);

  const coinSections = [
    {
      href: '/coins/trending',
      title: 'Trending Coins',
      description: 'Discover the top trending cryptocurrencies.',
    },
    {
      href: '/coins/search',
      title: 'Coin Search',
      description: 'Find any cryptocurrency by name, symbol, or ID.',
    },
    {
      href: '/coins/watchlist',
      title: 'My Watchlist',
      description: 'Track your favorite cryptocurrencies in one place.',
    },
    {
      href: '/coins/compare',
      title: 'Compare Coins',
      description: 'Compare multiple cryptocurrencies side-by-side.',
    },
  ];

  return (
    <>
      <HeroSection
        title="Cryptocurrencies"
        description="Explore various cryptocurrency data and tools."
      />
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {coinSections.map((section) => (
            <Link href={section.href} key={section.href}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{section.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-4">Top 100 Cryptocurrencies by Market Cap</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Price (USD)</TableHead>
                <TableHead className="text-right">Market Cap (USD)</TableHead>
                <TableHead className="text-right">24h Change (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Skeleton loader for initial loading
                [...Array(PER_PAGE)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : (
                // Actual coin data
                coins.map((coin) => (
                  <TableRow key={coin.id} className="cursor-pointer hover:bg-muted">
                    <TableCell>
                      <Link href={`/coins/${coin.id}`} className="block w-full h-full py-2 px-4">
                        {coin.market_cap_rank}
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link href={`/coins/${coin.id}`} className="flex items-center gap-2 py-2 px-4">
                        {coin.image && <Image src={coin.image} alt={coin.name} width={20} height={20} className="rounded-full" />}
                        {coin.name}
                      </Link>
                    </TableCell>
                    <TableCell className="uppercase">
                      <Link href={`/coins/${coin.id}`} className="block w-full h-full py-2 px-4">
                        {coin.symbol}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/coins/${coin.id}`} className="block w-full h-full py-2 px-4">
                        ${coin.current_price?.toFixed(2)}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/coins/${coin.id}`} className="block w-full h-full py-2 px-4">
                        ${coin.market_cap?.toLocaleString()}
                      </Link>
                    </TableCell>
                    <TableCell className={cn(
                      "text-right",
                      coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
                    )}>
                      <Link href={`/coins/${coin.id}`} className="block w-full h-full py-2 px-4">
                        {coin.price_change_percentage_24h?.toFixed(2)}%
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {hasMore && (
          <div ref={loader} className="flex justify-center py-4">
            {loadingMore ? (
              // Skeleton loader for loading more
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ) : (
              ''
            )}
          </div>
        )}
        {!hasMore && coins.length > 0 && (
          <div className="flex justify-center py-4 text-muted-foreground">
            You have reached the end of the list.
          </div>
        )}
      </div>
    </>
  );
}
