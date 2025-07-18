
import { Suspense } from "react";
import { getTopCoins, getExchangeRate } from "@/lib/coingecko";
import { TableSkeleton } from "@/app/coins/market-data-table-client";
import { MarketDataTableClient } from "@/app/coins/market-data-table-client";
import { CryptoData } from "@/types";
import { AlertTriangle, LineChart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MarketPageClient } from "./market-page-client";


export default async function MarketsPage({ 
    searchParams 
}: { 
    searchParams?: { currency?: string, search?: string } 
}) {
  const currency = searchParams?.currency?.toLowerCase() || 'usd';
  const searchQuery = searchParams?.search || '';
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
    <>
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="text-left flex-grow">
            <div className="flex items-center gap-4 mb-2">
                <div className="bg-primary/10 text-primary p-3 rounded-3">
                    <LineChart className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter">
                      Pasar Kripto
                    </h1>
                     <p className="text-base text-text-secondary mt-1">
                        Jelajahi harga mata uang kripto, kapitalisasi pasar, dan volume perdagangan secara real-time.
                    </p>
                </div>
            </div>
          </div>
           <Suspense fallback={<div className="h-10 w-full sm:w-[320px] bg-muted rounded-md" />}>
             <MarketPageClient initialCurrency={currency} initialSearch={searchQuery} />
          </Suspense>
        </div>
      </header>

      <Card className="card-primary p-0 overflow-hidden">
          <Suspense fallback={<TableSkeleton />}>
            {error ? (
               <div className="flex flex-col items-center justify-center p-12 text-center text-market-down">
                   <AlertTriangle className="h-12 w-12 mb-4" />
                   <h3 className="text-xl font-semibold">Gagal Memuat Data Pasar</h3>
                   <p className="text-sm text-market-down/80 mt-2 max-w-md">
                       {error}
                   </p>
               </div>
            ) : (
              <MarketDataTableClient 
                initialData={initialData} 
                currency={currency}
                filter={searchQuery} 
              />
            )}
          </Suspense>
      </Card>
    </>
  );
}
