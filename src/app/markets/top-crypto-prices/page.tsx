
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { DollarSign } from "lucide-react";
import { Suspense } from "react";
import { MarketDataTableClient, TableSkeleton } from "@/app/coins/market-data-table-client";
import { CurrencySwitcherClient } from "@/components/molecules/currency-switcher-client";
import { CryptoData } from "@/types";
import { getTopCoins, getExchangeRate } from "@/lib/coingecko";
import { AlertTriangle } from "lucide-react";

export const metadata = {
  title: 'Top Crypto Prices',
  description: 'Lihat harga dan volume perdagangan koin kripto teratas.',
};

export default async function TopCryptoPricesPage({ searchParams }: { searchParams?: { currency?: string } }) {
  const currency = searchParams?.currency?.toLowerCase() || 'usd';
  let initialData: CryptoData[] = [];
  let error: string | null = null;
  
  try {
    const usdData = await getTopCoins(1, 20); 

    if (!usdData) {
      throw new Error("Gagal memuat data market. API tidak merespons atau cache kosong.");
    }
    
    let exchangeRate = 1;
    if (currency !== 'usd') {
      const rate = await getExchangeRate(currency);
      if (rate) {
        exchangeRate = rate;
      } else {
        console.warn(`Gagal mengambil nilai tukar untuk ${currency}. Menampilkan data dalam USD.`);
      }
    }

    initialData = usdData.map(coin => ({
      ...coin,
      current_price: coin.current_price * exchangeRate,
      market_cap: coin.market_cap * exchangeRate,
      total_volume: coin.total_volume * exchangeRate,
      high_24h: coin.high_24h * exchangeRate,
      low_24h: coin.low_24h * exchangeRate,
      ath: coin.ath * exchangeRate,
      ath_market_cap: coin.ath_market_cap ? coin.ath_market_cap * exchangeRate : null,
    }));

  } catch (err) {
    console.error("Gagal mengambil data market untuk halaman Markets:", err);
    error = err instanceof Error ? err.message : "Terjadi kesalahan tak terduga.";
  }

  return (
    <div className="container-full section-spacing">
      <Breadcrumb className="mb-6">
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
            <BreadcrumbPage>Top Crypto Prices</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-grow">
                <div className="flex items-center gap-4 mb-2">
                    <div className="bg-accent-primary/10 text-accent-primary p-2 rounded-3">
                        <DollarSign className="h-8 w-8" />
                    </div>
                    <h1 className="headline-2">
                        Top Crypto Prices
                    </h1>
                </div>
                <p className="body-large text-text-secondary mt-2">
                    Lihat harga dan volume perdagangan koin kripto teratas secara real-time.
                </p>
            </div>
             <Suspense fallback={<div className="h-10 w-[140px] bg-muted rounded-md" />}>
                <CurrencySwitcherClient />
            </Suspense>
        </div>
      </header>

      <Card className="card-primary p-0 overflow-hidden">
        <CardContent className="p-0">
          <Suspense fallback={<TableSkeleton />}>
             {error ? (
               <div className="flex flex-col items-center justify-center p-12 text-center text-market-down">
                   <AlertTriangle className="h-12 w-12 mb-4" />
                   <h3 className="headline-5">Gagal Memuat Data Pasar</h3>
                   <p className="body-small text-market-down/80 mt-2 max-w-md">
                       {error}
                   </p>
               </div>
            ) : (
              <MarketDataTableClient initialData={initialData} currency={currency} />
            )}
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
