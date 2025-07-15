'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getDefiLlamaStablecoins } from "@/lib/defillama";
import { format } from "date-fns";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Scale, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DefiLlamaStablecoin } from "@/types";

// Metadata is not directly supported in client components, but can be set in a layout.tsx or a parent server component.
// export const metadata = {
//   title: 'Stablecoin Metrics',
//   description: 'Metrik penting terkait stablecoin, termasuk kapitalisasi pasar dan sirkulasi.',
// };

const formatCurrency = (value: number | null | undefined, currency: string = 'usd', compact: boolean = false) => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  if (compact) {
    options.notation = 'compact';
    options.maximumFractionDigits = 2;
  }
  return new Intl.NumberFormat('en-US', options).format(value);
};

const ITEMS_PER_LOAD = 10;

export default function StablecoinMetricsPage() {
  const [stablecoins, setStablecoins] = useState<DefiLlamaStablecoin[]>([]);
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_LOAD);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStablecoins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDefiLlamaStablecoins();
      if (data) {
        setStablecoins(data);
      } else {
        setError('Failed to fetch stablecoin data.');
      }
    } catch (err) {
      console.error("Error fetching stablecoins:", err);
      setError('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStablecoins();
  }, [loadStablecoins]);

  const handleLoadMore = () => {
    setDisplayedCount(prevCount => prevCount + ITEMS_PER_LOAD);
  };

  const stablecoinsToDisplay = stablecoins.slice(0, displayedCount);

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" asChild>
              <Link href="/">Beranda</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/markets" asChild>
              <Link href="/markets">Pasar</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Stablecoin Metrics</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mb-12">
        <div className="flex items-center gap-4 mb-2">
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
                <Scale className="h-8 w-8" />
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight">
                Stablecoin Metrics
            </h1>
        </div>
        <p className="text-xl text-muted-foreground mt-2">
            Jelajahi metrik penting terkait stablecoin, termasuk kapitalisasi pasar dan sirkulasi di berbagai jaringan.
        </p>
      </header>

      <Card>
        <CardContent className="pt-6">
          {loading && <p className="text-center">Memuat data stablecoin...</p>}
          {error && <p className="text-center text-red-500">Error: {error}</p>}
          {!loading && !error && stablecoinsToDisplay.length === 0 && (
            <p className="text-center text-muted-foreground">Tidak ada data stablecoin yang ditemukan.</p>
          )}
          {!loading && !error && stablecoinsToDisplay.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stablecoinsToDisplay.map((sc) => (
                <Card key={sc.id} className="flex flex-col">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">{sc.name} ({sc.symbol})</CardTitle>
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="text-2xl font-bold mb-2">
                      {sc.circulating && typeof sc.circulating.peggedUSD === 'number'
                        ? formatCurrency(sc.circulating.peggedUSD, 'usd', true)
                        : 'N/A'
                      }
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Harga: {formatCurrency(sc.price, 'usd', false)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tipe Peg: {sc.pegType}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Mekanisme Peg: {sc.pegMechanism}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Jaringan: {sc.chains.join(', ')}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {!loading && !error && displayedCount < stablecoins.length && (
            <div className="flex justify-center mt-8">
              <Button onClick={handleLoadMore} variant="outline">
                Muat Lebih Banyak ({stablecoins.length - displayedCount} tersisa)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
