
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MarketDataTable } from "../market-data-table";
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
import { TableSkeleton } from "../market-data-table";
import { CurrencySwitcherClient } from "@/components/molecules/currency-switcher-client";

export const metadata = {
  title: 'Top Crypto Prices',
  description: 'Lihat harga dan volume perdagangan koin kripto teratas.',
};

export default async function TopCryptoPricesPage({ searchParams }: { searchParams?: { currency?: string } }) {
  const currency = searchParams?.currency?.toLowerCase() || 'usd';

  return (
    <div className="container mx-auto px-4 py-7 md:py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" asChild>
              <Link href="/">Beranda</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/markets" asChild>
              <Link href="/markets">Pasar</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Top Crypto Prices</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mb-7">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-grow">
                <div className="flex items-center gap-4 mb-2">
                    <div className="bg-primary/10 text-primary p-2 rounded-lg">
                        <DollarSign className="h-8 w-8" />
                    </div>
                    <h1 className="text-4xl font-semibold font-headline tracking-tight">
                        Top Crypto Prices
                    </h1>
                </div>
                <p className="text-lg text-muted-foreground mt-2">
                    Lihat harga dan volume perdagangan koin kripto teratas secara real-time.
                </p>
            </div>
             <Suspense fallback={<div className="h-10 w-[120px] bg-muted rounded-md" />}>
                <CurrencySwitcherClient />
            </Suspense>
        </div>
      </header>

      <Card>
        <CardContent className="p-0">
          <Suspense fallback={<TableSkeleton />}>
            <MarketDataTable currency={currency} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
