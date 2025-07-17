
import { Card, CardContent } from "@/components/ui/card";
import { MarketDataTable } from "@/app/coins/market-data-table";
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
import { TableSkeleton } from "@/app/coins/market-data-table";
import { CurrencySwitcherClient } from "@/components/molecules/currency-switcher-client";

export const metadata = {
  title: 'Top Crypto Prices',
  description: 'Lihat harga dan volume perdagangan koin kripto teratas.',
};

export default async function TopCryptoPricesPage({ searchParams }: { searchParams?: { currency?: string } }) {
  const currency = searchParams?.currency?.toLowerCase() || 'usd';

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
            <MarketDataTable currency={currency} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
