
'use client';

import { AppShell } from "@/components/organisms/app-shell";
import { getTopCoins } from "@/lib/coingecko";
import { Card } from "@/components/ui/card";
import { getColumns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import type { CryptoData } from "@/types";
import { useState, useEffect } from "react";
import { CurrencySwitcher } from "@/components/molecules/currency-switcher";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/molecules/breadcrumbs";

export default function MarketsPage() {
  const [data, setData] = useState<CryptoData[]>([]);
  const [currency, setCurrency] = useState('usd');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const cryptoData = await getTopCoins(100, currency);
      setData(cryptoData);
      setIsLoading(false);
    };
    fetchData();
  }, [currency]);

  const columns = getColumns(currency);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Markets" },
  ];

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-12 md:py-24">
        <header className="mb-12">
          <Breadcrumbs items={breadcrumbItems} className="mb-4" />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
                Crypto Markets
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl">
                Explore real-time cryptocurrency prices, market caps, and trading
                volumes.
              </p>
            </div>
            <CurrencySwitcher value={currency} onValueChange={setCurrency} />
          </div>
        </header>

        <div className="w-full overflow-x-auto">
          <Card className="bg-card/60 backdrop-blur-md">
            {isLoading ? (
                <div className="p-4 space-y-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            ) : (
                <DataTable columns={columns} data={data} />
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
