
'use client';

import { format, parseISO } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { KlineData } from "@/types";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface CoinChartProps {
  symbol: string;
  klinesData: KlineData[] | null;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: value < 1 ? 6 : 2,
  }).format(value);
};

export function CoinChart({ symbol, klinesData }: CoinChartProps) {
  const chartData = klinesData?.map(k => ({
    date: format(new Date(k.openTime), 'dd MMM'),
    fullDate: format(new Date(k.openTime), 'dd MMMM yyyy'),
    close: parseFloat(k.close),
  }));

  return (
    <Card className="card-primary">
      <CardHeader>
        <CardTitle>Grafik Harga ({symbol?.toUpperCase()}/USDT)</CardTitle>
        <CardDescription>Grafik harga harian dari Binance</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData && chartData.length > 0 ? (
          <ChartContainer
            config={{ close: { label: "Close", color: "hsl(var(--chart-color-1))" } }}
            className="aspect-video h-[300px] w-full"
          >
            <LineChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={30} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  `$${Number(value).toLocaleString('en-US', {
                    notation: 'compact',
                    compactDisplay: 'short',
                  })}`
                }
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(label, payload) => payload?.[0]?.payload.fullDate || label}
                    formatter={(value) => formatCurrency(Number(value))}
                    indicator="dot"
                  />
                }
              />
              <Line dataKey="close" type="monotone" stroke="var(--color-close)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-text-tertiary body-regular">
            Tidak ada data grafik yang tersedia.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
