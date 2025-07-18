
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
import { Scale, Server } from "lucide-react";
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
    <Card className="card-primary">
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
    <div className="container-full section-spacing">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" asChild>
              <Link href="/">Beranda</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/markets">Pasar</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Stablecoin Metrics</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mb-7">
        <div className="flex items-center gap-4 mb-2">
            <div className="bg-accent-primary/10 text-accent-primary p-2 rounded-3">
                <Scale className="h-8 w-8" />
            </div>
            <h1 className="headline-2">
                Stablecoin Metrics
            </h1>
        </div>
        <p className="body-large text-text-secondary mt-2">
            Jelajahi metrik penting terkait stablecoin, termasuk kapitalisasi pasar dan sirkulasi di berbagai jaringan.
        </p>
      </header>

      <div>
        {error && <p className="text-center text-market-down body-regular">{error}</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
             Array.from({ length: ITEMS_PER_LOAD }).map((_, i) => <StablecoinCardSkeleton key={i} />)
          ) : stablecoinsToDisplay.length > 0 ? (
            <TooltipProvider>
              {stablecoinsToDisplay.map((sc) => (
                <Card key={sc.id} className="card-primary flex flex-col">
                  <CardHeader>
                    <CardTitle className="headline-6 flex items-center gap-2">
                      {sc.name} <span className="text-text-secondary font-normal text-lg">({sc.symbol})</span>
                    </CardTitle>
                    <CardDescription className="body-small">
                      Harga Saat Ini: <span className="font-semibold text-text-primary">{formatCurrency(sc.price)}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                    <div>
                      <p className="caption-regular text-text-secondary">Sirkulasi</p>
                      <p className="number-large">
                        {sc.circulating_pegged_usd
                          ? formatCurrency(sc.circulating_pegged_usd, 'usd', true)
                          : 'N/A'
                        }
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center body-small">
                        <span className="text-text-secondary">Tipe Peg</span>
                        <Badge variant="secondary">{sc.peg_type}</Badge>
                      </div>
                       <div className="flex justify-between items-center body-small">
                        <span className="text-text-secondary">Mekanisme</span>
                        <Badge variant="secondary" className="max-w-[150px] truncate">{sc.peg_mechanism}</Badge>
                      </div>
                    </div>
                     <div className="flex items-center gap-2 body-small text-text-secondary pt-4 mt-2 border-t border-bg-tertiary">
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
             !error && <p className="col-span-full text-center text-text-secondary body-regular">Tidak ada data stablecoin yang ditemukan.</p>
          )}
        </div>
        
        {!loading && !error && displayedCount < stablecoins.length && (
          <div className="flex justify-center mt-6">
            <Button onClick={handleLoadMore} variant="outline">
              Muat Lebih Banyak ({stablecoins.length - displayedCount} tersisa)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
