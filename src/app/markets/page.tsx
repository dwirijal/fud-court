import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";
import { MarketDataTable, TableSkeleton } from "./market-data-table";
import { CurrencySwitcherClient } from "@/components/molecules/currency-switcher-client";

export default async function MarketsPage({ searchParams }: { searchParams?: { currency?: string } }) {
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
          <Suspense fallback={<div>Loading...</div>}>
            <CurrencySwitcherClient />
          </Suspense>
        </div>
      </header>

      <div className="w-full overflow-x-auto">
        <Card className="bg-card/60 backdrop-blur-md">
            <Suspense fallback={<TableSkeleton />}>
              <MarketDataTable currency={currency} />
            </Suspense>
        </Card>
      </div>
    </div>
  );
}
