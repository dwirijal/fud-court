import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getDefiLlamaHistoricalTvl } from "@/lib/defillama";
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export const metadata = {
  title: 'On-Chain Macro Indicators',
  description: 'Indikator makro on-chain, termasuk Total Value Locked (TVL) historis.',
};

const formatCurrency = (value: number | null | undefined, compact: boolean = true) => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'USD',
  };
  if (compact) {
    options.notation = 'compact';
    options.maximumFractionDigits = 2;
  } else {
    options.minimumFractionDigits = 2;
    options.maximumFractionDigits = value < 1 ? 6 : 2;
  }
  return new Intl.NumberFormat('en-US', options).format(value);
};

export default async function OnChainMacroIndicatorsPage() {
  const historicalTvl = await getDefiLlamaHistoricalTvl();

  const chartData = historicalTvl?.map(dataPoint => ({
    date: format(new Date(dataPoint.date * 1000), 'MMM dd, yyyy'), // Convert Unix timestamp to readable date
    tvl: dataPoint.tvl,
  })).reverse(); // Reverse to show oldest data first

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
            <BreadcrumbPage>On-Chain Macro Indicators</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mb-12">
        <div className="flex items-center gap-4 mb-2">
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
                <TrendingUp className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold font-headline tracking-tight">
                On-Chain Macro Indicators
            </h1>
        </div>
        <p className="text-lg text-muted-foreground mt-2">
            Jelajahi data historis Total Value Locked (TVL) di seluruh ekosistem DeFi.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Total Value Locked (TVL) Historis</CardTitle>
          <CardDescription>TVL gabungan dari semua protokol DeFi yang dilacak oleh DefiLlama.</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData && chartData.length > 0 ? (
            <ChartContainer
              config={{
                tvl: { label: "TVL", color: "hsl(var(--chart-1))" },
              }}
              className="aspect-video h-[400px] w-full"
            >
              <LineChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={30}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => formatCurrency(value, true)}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Line
                  dataKey="tvl"
                  type="monotone"
                  stroke="var(--color-tvl)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <p className="text-center text-muted-foreground">Tidak ada data TVL historis yang ditemukan.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
