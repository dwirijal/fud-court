
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
       <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/learn">Belajar</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Indikator Skor Pasar</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mb-12">
        <div className="flex items-center gap-4 mb-2">
            <div className="bg-primary/10 text-primary p-3 rounded-3">
                <BookOpen className="h-6 w-6" />
            </div>
             <div>
                <h1 className="text-3xl font-bold tracking-tighter">
                    Indikator Skor Pasar
                </h1>
                <p className="text-base text-muted-foreground mt-1">
                    Rincian mendalam tentang komponen yang digunakan untuk menghitung Skor Sentimen Makro.
                </p>
            </div>
        </div>
      </header>
      
      <MarketIndicatorsClient marketData={marketData} />
    </div>
  );
}
