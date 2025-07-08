
'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { getTrendingTokens } from "@/lib/moralis";
import type { MoralisTrendingToken } from "@/types";
import { TrendingTokenCard } from "@/components/molecules/trending-token-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function DegenPage() {
  const [tokens, setTokens] = useState<MoralisTrendingToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trendingTokens = await getTrendingTokens('solana');
        setTokens(trendingTokens);
        if (error) setError(null); // Clear previous errors on a successful fetch
      } catch (err) {
        console.error("Failed to fetch Moralis data:", err);
        setError(err instanceof Error ? err.message : "An unexpected error occurred while fetching data.");
      } finally {
        // Only set loading to false on the initial fetch
        if (isLoading) {
            setIsLoading(false);
        }
      }
    };

    fetchData(); // Fetch initial data
    // 10 requests per hour = 1 request every 6 minutes (360,000 ms)
    const intervalId = setInterval(fetchData, 360000); 

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []); // Empty dependency array ensures this runs once and sets up the interval.

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <header className="mb-12">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Degen</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
                Trending Tokens on Solana
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Trending tokens from the Solana ecosystem, powered by Moralis. Data is updated every 6 minutes.
            </p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto">
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)
          ) : error ? (
            <div className="text-center text-destructive p-4 border border-destructive/50 rounded-lg bg-destructive/10">
                <p className="font-semibold">{error}</p>
            </div>
          ) : (
            tokens.length > 0 ? tokens.map((token) => (
              <TrendingTokenCard key={`${token.rank}-${token.address}`} token={token} />
            )) : <p className="text-center text-muted-foreground">No trending tokens found at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}
