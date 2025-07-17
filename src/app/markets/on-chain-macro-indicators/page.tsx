
import { Card } from "@/components/ui/card";
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
            <BreadcrumbPage>On-Chain Macro Indicators</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mb-8">
        <div className="flex items-center gap-4 mb-2">
            <div className="bg-accent-primary/10 text-accent-primary p-2 rounded-3">
                <TrendingUp className="h-8 w-8" />
            </div>
            <h1 className="headline-2">
                On-Chain Macro Indicators
            </h1>
        </div>
        <p className="body-large text-text-secondary mt-2">
            Jelajahi data historis Total Value Locked (TVL) di seluruh ekosistem DeFi.
        </p>
      </header>

      <Card className="chart-container">
        <div className="chart-header">
            <h3 className="chart-title">Total Value Locked (TVL) Historis</h3>
            <p className="body-small text-text-secondary">TVL gabungan dari semua protokol DeFi yang dilacak oleh DefiLlama.</p>
        </div>
        <div className="px-2">
          {chartData && chartData.length > 0 ? (
            <ChartContainer
              config={{
                tvl: { label: "TVL", color: "hsl(var(--chart-color-1))" },
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
            <div className="flex items-center justify-center h-48">
                <p className="text-center text-text-secondary py-16">Tidak ada data TVL historis yang ditemukan.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
