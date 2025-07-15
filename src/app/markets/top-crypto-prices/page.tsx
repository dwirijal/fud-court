import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MarketDataTable } from "../market-data-table";
import { getTopCoins } from "@/lib/coingecko";
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

export const metadata = {
  title: 'Top Crypto Prices',
  description: 'Lihat harga dan volume perdagangan koin kripto teratas.',
};

export default async function TopCryptoPricesPage({ searchParams }: { searchParams?: { currency?: string } }) {
  const currency = searchParams?.currency?.toLowerCase() || 'usd';
  const topCoins = await getTopCoins();

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <Breadcrumb className="mb-8">
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

      <header className="mb-12">
        <div className="flex items-center gap-4 mb-2">
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
                <DollarSign className="h-8 w-8" />
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight">
                Top Crypto Prices
            </h1>
        </div>
        <p className="text-xl text-muted-foreground mt-2">
            Lihat harga dan volume perdagangan koin kripto teratas secara real-time.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Koin Kripto</CardTitle>
          <CardDescription>Data harga dan volume terbaru dari CoinGecko.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {topCoins && topCoins.length > 0 ? (
            <MarketDataTable initialData={topCoins} currency={currency} />
          ) : (
            <p className="text-center text-muted-foreground p-6">Tidak ada data koin yang ditemukan.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}