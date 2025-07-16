
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getDefiLlamaStablecoins } from "@/lib/defillama";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Scale, DollarSign, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DefiLlamaStablecoin } from "@/types";
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from '@/components/ui/skeleton';

const formatCurrency = (value: number | null | undefined, currency: string = 'usd', compact: boolean = false) => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';

  // Prevent "maximumFractionDigits value is out of range" error for very small numbers.
  if (Math.abs(value) < 1e-6 && !compact) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.toUpperCase(),
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(0);
  }

  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: currency.toUpperCase(),
  };

  if (compact) {
    options.notation = 'compact';
    options.maximumFractionDigits = 2;
  } else {
    options.minimumFractionDigits = value > 0.1 ? 2 : 4;
    options.maximumFractionDigits = value > 0.1 ? 2 : 6;
  }

  return new Intl.NumberFormat('en-US', options).format(value);
};


const ITEMS_PER_LOAD = 9;

function StablecoinCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}

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
        setError('Gagal mengambil data stablecoin.');
      }
    } catch (err) {
      console.error("Error fetching stablecoins:", err);
      setError('Terjadi kesalahan saat mengambil data.');
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
    <div className="container mx-auto px-4 py-12 md:py-16">
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
            <h1 className="text-4xl md:text-5xl font-semibold font-headline tracking-tight">
                Stablecoin Metrics
            </h1>
        </div>
        <p className="text-lg text-muted-foreground mt-2">
            Jelajahi metrik penting terkait stablecoin, termasuk kapitalisasi pasar dan sirkulasi di berbagai jaringan.
        </p>
      </header>

      <div>
        {error && <p className="text-center text-destructive">Error: {error}</p>}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             Array.from({ length: ITEMS_PER_LOAD }).map((_, i) => <StablecoinCardSkeleton key={i} />)
          ) : stablecoinsToDisplay.length > 0 ? (
            <TooltipProvider>
              {stablecoinsToDisplay.map((sc) => (
                <Card key={sc.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-headline">
                      {sc.name} <span className="text-muted-foreground font-normal text-lg">({sc.symbol})</span>
                    </CardTitle>
                    <CardDescription>
                      Harga Saat Ini: <span className="font-semibold text-foreground">{formatCurrency(sc.price)}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Sirkulasi</p>
                      <p className="text-2xl font-bold">
                        {sc.circulating && typeof sc.circulating.peggedUSD === 'number'
                          ? formatCurrency(sc.circulating.peggedUSD, 'usd', true)
                          : 'N/A'
                        }
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Tipe Peg</span>
                        <Badge variant="secondary">{sc.pegType}</Badge>
                      </div>
                       <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Mekanisme</span>
                        <Badge variant="secondary" className="max-w-[150px] truncate">{sc.pegMechanism}</Badge>
                      </div>
                    </div>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 mt-2 border-t">
                        <Server className="h-4 w-4" />
                        <span className="font-medium">Jaringan:</span>
                        <div className="flex flex-wrap items-center gap-1">
                            {sc.chains.slice(0, 3).map(chain => (
                                <Badge key={chain} variant="outline" className="font-normal">{chain}</Badge>
                            ))}
                            {sc.chains.length > 3 && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Badge variant="outline" className="cursor-help">+{sc.chains.length - 3} lainnya</Badge>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs text-center">
                                        <p>{sc.chains.slice(3).join(', ')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TooltipProvider>
          ) : (
             !error && <p className="col-span-full text-center text-muted-foreground">Tidak ada data stablecoin yang ditemukan.</p>
          )}
        </div>
        
        {!loading && !error && displayedCount < stablecoins.length && (
          <div className="flex justify-center mt-8">
            <Button onClick={handleLoadMore} variant="outline">
              Muat Lebih Banyak ({stablecoins.length - displayedCount} tersisa)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
