
import { getTopCoins } from "@/lib/coingecko";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getColumns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { CurrencySwitcher } from "@/components/molecules/currency-switcher";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";

async function MarketDataTable({ currency }: { currency: string }) {
  try {
    const data = await getTopCoins(100, currency);
    const columns = getColumns(currency);
    // Add a fallback for data to prevent crash if API fails
    return <DataTable columns={columns} data={data || []} />;
  } catch (err) {
    console.error("Failed to fetch market data for MarketDataTable:", err);
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center text-destructive">
            <AlertTriangle className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold">Gagal Memuat Data Pasar</h3>
            <p className="text-sm text-destructive/80 mt-2">
                Terjadi kesalahan saat mengambil data. Silakan coba segarkan halaman atau periksa koneksi internet Anda.
            </p>
      </div>
    );
  }
}

function TableSkeleton() {
    return (
        <div className="p-4 space-y-2">
            {Array.from({ length: 15 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
            ))}
        </div>
    );
}

export default async function MarketsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const currency = typeof searchParams?.currency === 'string' ? searchParams.currency.toLowerCase() : 'usd';

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <header className="mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
              Pasar Kripto
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Jelajahi harga mata uang kripto, kapitalisasi pasar, dan volume perdagangan secara real-time.
            </p>
          </div>
          <CurrencySwitcher defaultValue={currency} />
        </div>
      </header>

      <div className="w-full overflow-x-auto">
        <Card className="bg-card/60 backdrop-blur-md">
            <Suspense key={currency} fallback={<TableSkeleton />}>
              <MarketDataTable currency={currency} />
            </Suspense>
        </Card>
      </div>
    </div>
  );
}

    

    