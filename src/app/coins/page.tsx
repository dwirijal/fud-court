
import { Suspense } from "react";
import { getTopCoins, getExchangeRate } from "@/lib/coingecko";
import { TableSkeleton } from "./market-data-table-client";
import { CurrencySwitcher } from "@/components/molecules/currency-switcher";
import { MarketDataTableClient } from "./market-data-table-client";
import { CryptoData } from "@/types";
import { AlertTriangle } from "lucide-react";

export function TableSkeleton() {
    return (
        <div className="space-y-2 p-5">
            {Array.from({ length: 15 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
            ))}
        </div>
    );
}

export default async function CoinsPage({ searchParams }: { searchParams?: { currency?: string } }) {
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
    console.error("Gagal mengambil data market untuk halaman Coins:", err);
    error = err instanceof Error ? err.message : "Terjadi kesalahan tak terduga.";
  }

  return (
    <div className="container-full section-spacing">
      <header className="mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <h1 className="headline-2 mb-2">
              Pasar Kripto
            </h1>
            <p className="body-large text-text-secondary max-w-3xl">
              Jelajahi harga mata uang kripto, kapitalisasi pasar, dan volume perdagangan secara real-time.
            </p>
          </div>
          <Suspense fallback={<div className="h-10 w-[120px] bg-muted rounded-md" />}>
            <CurrencySwitcher defaultValue={currency} />
          </Suspense>
        </div>
      </header>

      <div className="w-full overflow-x-auto card-primary p-0">
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
      </div>
    </div>
  );
}
