import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDefiLlamaProtocols } from "@/lib/defillama";
import { format } from "date-fns";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Zap } from "lucide-react";
import { TrendChange } from "@/components/ui/TrendChange";

export const metadata = {
  title: 'DeFi TVL Metrics',
  description: 'Metrik Total Value Locked (TVL) untuk berbagai protokol DeFi.',
};

const formatCurrency = (value: number | null | undefined, currency: string = 'usd', compact: boolean = false) => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  if (compact) {
    options.notation = 'compact';
    options.maximumFractionDigits = 2;
  }
  return new Intl.NumberFormat('en-US', options).format(value);
};

export default async function DefiTvlMetricsPage() {
  const protocols = await getDefiLlamaProtocols();

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
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
            <BreadcrumbPage>DeFi TVL Metrics</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mb-12">
        <div className="flex items-center gap-4 mb-2">
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
                <Zap className="h-[2rem] w-[2rem]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold font-headline tracking-tight">
                DeFi TVL Metrics
            </h1>
        </div>
        <p className="text-lg text-muted-foreground mt-2">
            Jelajahi Total Value Locked (TVL) untuk berbagai protokol keuangan terdesentralisasi (DeFi).
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Protokol DeFi</CardTitle>
          <CardDescription>Data TVL terbaru dari DefiLlama.</CardDescription>
        </CardHeader>
        <CardContent>
          {protocols && protocols.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Protokol</TableHead>
                    <TableHead className="text-right">TVL</TableHead>
                    <TableHead className="text-right">Perubahan 1 Hari</TableHead>
                    <TableHead className="text-right">Perubahan 7 Hari</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Jaringan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {protocols.map((protocol) => (
                    <TableRow key={protocol.id}>
                      <TableCell className="font-medium">{protocol.name}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(protocol.tvl, 'usd', true)}</TableCell>
                      <TableCell className="text-right"><TrendChange change={protocol.change_1d} isPercentage={true} /></TableCell>
                      <TableCell className="text-right"><TrendChange change={protocol.change_7d} isPercentage={true} /></TableCell>
                      <TableCell>{protocol.category}</TableCell>
                      <TableCell>{protocol.chains.join(', ')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Tidak ada data protokol DeFi yang ditemukan.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
