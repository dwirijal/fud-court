import { getTopCoins, getExchangeRate } from "@/lib/coingecko";
import { AlertTriangle } from "lucide-react";
import { CryptoData } from "@/types";
import { MarketDataTableClient } from "./market-data-table-client";
import { Skeleton } from "@/components/ui/skeleton";

export async function MarketDataTable({ currency }: { currency: string }) {
  let data: CryptoData[] | null = [];
  let error: string | null = null;
  
  try {
    // Always fetch in USD, then convert
    const usdData = await getTopCoins(1, 20); 
    if (usdData === null) {
      error = "Gagal memuat data market. API tidak merespons.";
    }

    // Fetch exchange rate if currency is not USD
    let exchangeRate = 1;
    if (currency.toLowerCase() !== 'usd') {
      const rate = await getExchangeRate(currency);
      if (rate) {
        exchangeRate = rate;
      } else {
        console.warn(`Failed to fetch exchange rate for ${currency}. Displaying in USD.`);
      }
    }

    // Apply exchange rate to all relevant fields
    if (usdData) {
      data = usdData.map(coin => ({
        ...coin,
        current_price: coin.current_price * exchangeRate,
        market_cap: coin.market_cap * exchangeRate,
        total_volume: coin.total_volume * exchangeRate,
        high_24h: coin.high_24h * exchangeRate,
        low_24h: coin.low_24h * exchangeRate,
        ath: coin.ath * exchangeRate,
        ath_market_cap: coin.ath_market_cap ? coin.ath_market_cap * exchangeRate : null,
      }));
    }

  } catch (err) {
    console.error("Failed to fetch market data for MarketDataTable:", err);
    error = err instanceof Error ? err.message : "Terjadi kesalahan tak terduga.";
  }

  if (error) {
     return (
        <div className="flex flex-col items-center justify-center p-12 text-center text-destructive">
            <AlertTriangle className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold">Gagal Memuat Data Pasar</h3>
            <p className="text-sm text-destructive/80 mt-2 max-w-md">
                {error}
            </p>
      </div>
    );
  }

  // Sort data by market_cap_rank before passing to client component
  const sortedData = (data || []).sort((a, b) => a.market_cap_rank - b.market_cap_rank);

  return <MarketDataTableClient data={sortedData} currency={currency} />;
}

export function TableSkeleton() {
    return (
        <div className="p-4 space-y-2">
            {Array.from({ length: 15 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
            ))}
        </div>
    );
}