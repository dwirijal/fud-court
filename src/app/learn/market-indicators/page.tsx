import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { fetchMarketData } from "@/lib/coingecko";
import { BookOpen } from "lucide-react";
import { MarketIndicatorsClient } from "./market-indicators-client";


export default async function MarketIndicatorsPage() {
  const marketData = await fetchMarketData();

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
            <BreadcrumbLink href="/learn" asChild>
              <Link href="/learn">Belajar</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Indikator Skor Pasar</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mb-7">
        <div className="flex items-center gap-4 mb-2">
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
                <BookOpen className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-semibold tracking-tight">
                Indikator Skor Pasar
            </h1>
        </div>
        <p className="text-lg text-muted-foreground mt-2">
            Rincian mendalam tentang komponen yang digunakan untuk menghitung Skor Sentimen Makro.
        </p>
      </header>
      
      <MarketIndicatorsClient marketData={marketData} />
    </div>
  );
}
