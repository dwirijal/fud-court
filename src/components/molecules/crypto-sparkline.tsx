
"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

interface CryptoSparklineProps {
  data: number[];
  isPositive: boolean;
}

const chartConfig = {
  value: {
    label: "Price",
  },
} satisfies ChartConfig;

export function CryptoSparkline({ data, isPositive }: CryptoSparklineProps) {
  const formattedData = data.map((value, index) => ({
    name: index,
    value: value,
  }));

  const strokeColor = isPositive ? "hsl(var(--chart-2))" : "hsl(var(--destructive))";
  const gradientId = `sparkline-gradient-${isPositive ? 'positive' : 'negative'}`;

  return (
    <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={formattedData}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4}/>
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Tooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel hideIndicator formatter={(value) => `$${Number(value).toLocaleString()}`} />}
          />
          <Area
            dataKey="value"
            type="natural"
            stroke={strokeColor}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#${gradientId})`}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
