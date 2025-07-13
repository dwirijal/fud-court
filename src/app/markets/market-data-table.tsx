import { getTopCoins } from "@/lib/coingecko";
import { AlertTriangle } from "lucide-react";
import { CryptoData } from "@/types";
import { MarketDataTableClient } from "./market-data-table-client";

export async function MarketDataTable({ currency }: { currency: string }) {
  let data: CryptoData[] | null = [];
  let error: string | null = null;
  
  try {
    data = await getTopCoins(100, currency);
    if (data === null) {
      error = "Gagal memuat data market. API tidak merespons.";
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

  return <MarketDataTableClient data={data || []} currency={currency} />;
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
