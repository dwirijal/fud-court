
import { getTopCoins } from "@/lib/coingecko";
import { Card } from "@/components/ui/card";
import { getColumns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import type { CryptoData } from "@/types";
import { CurrencySwitcher } from "@/components/molecules/currency-switcher";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface MarketsPageProps {
  searchParams?: {
    currency?: string;
  };
}

async function MarketDataTable({ currency }: { currency: string }) {
  const data = await getTopCoins(100, currency);
  const columns = getColumns(currency);
  return <DataTable columns={columns} data={data} />;
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


export default async function MarketsPage({ searchParams }: MarketsPageProps) {
  const currency = searchParams?.currency?.toLowerCase() || 'usd';

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
