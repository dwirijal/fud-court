"use client";

import * as React from "react";
import {
  Line,
  LineChart,
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

  const strokeColor = isPositive ? "hsl(var(--chart-2))" : "hsl(var(--primary))";

  return (
    <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 5,
          }}
        >
          <Tooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel hideIndicator />}
          />
          <Line
            dataKey="value"
            type="natural"
            stroke={strokeColor}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
