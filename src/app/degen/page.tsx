
'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { getBoostedTokens, getLatestTokenProfiles } from "@/lib/dexscreener";
import type { BoostedToken, TokenProfile } from "@/types";
import { BoostTokenCard } from "@/components/molecules/boost-token-card";
import { TokenProfileCard } from "@/components/molecules/token-profile-card";
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
  const [boosts, setBoosts] = useState<BoostedToken[]>([]);
  const [profiles, setProfiles] = useState<TokenProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [boostedTokens, tokenProfiles] = await Promise.all([
          getBoostedTokens(),
          getLatestTokenProfiles(),
        ]);
        setBoosts(boostedTokens);
        setProfiles(tokenProfiles);
      } catch (error) {
        console.error("Failed to fetch degen data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(); // Fetch initial data
    const intervalId = setInterval(fetchData, 1000); // Fetch every second

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  // Filter out items that are missing essential data to prevent runtime errors.
  const validBoosts = boosts.filter(b => b && b.pair && b.token && b.pair.address && b.token.address);
  const validProfiles = profiles.filter(p => p && p.tokenAddress && p.url);

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
                Degen Terminal
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Real-time boosted tokens and new profiles from the degen world. Data from DexScreener.
            </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section>
          <h2 className="text-3xl font-headline mb-6 text-center">Latest Boosts</h2>
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
            ) : (
              validBoosts.length > 0 ? validBoosts.map((boost) => (
                <BoostTokenCard key={`${boost.pair.address}-${boost.token.address}`} boost={boost} />
              )) : <p className="text-center text-muted-foreground">No boosted tokens found.</p>
            )}
          </div>
        </section>
        
        <section>
          <h2 className="text-3xl font-headline mb-6 text-center">New Token Profiles</h2>
          <div className="space-y-4">
            {isLoading ? (
               Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
            ) : (
                validProfiles.length > 0 ? validProfiles.map((profile) => (
                    <TokenProfileCard key={profile.tokenAddress} profile={profile} />
                )) : <p className="text-center text-muted-foreground">No new profiles found.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
