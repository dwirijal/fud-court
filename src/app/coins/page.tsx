import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";
import { MarketDataTable, TableSkeleton } from "./market-data-table";
import { CurrencySwitcher } from "@/components/molecules/currency-switcher";
import { getTopCoins, getExchangeRate } from "@/lib/coingecko";

export default async function CoinsPage({ searchParams }: { searchParams?: { currency?: string } }) {
  const currency = searchParams?.currency?.toLowerCase() || 'usd';
  const exchangeRate = await getExchangeRate(currency);
  const topCoins = await getTopCoins();

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
            <CurrencySwitcher defaultValue="usd" />
          </Suspense>
        </div>
      </header>

      {topCoins ? (
        <div className="w-full overflow-x-auto">
          <Card className="bg-card/60 backdrop-blur-md">
            <Suspense fallback={<TableSkeleton />}>
              <MarketDataTable currency={currency} />
            </Suspense>
          </Card>
        </div>
      ) : (
        <div className="text-center mt-12">
          <p className="text-muted-foreground">Error loading market data.</p>
        </div>
      )}
    </div>
  );
}