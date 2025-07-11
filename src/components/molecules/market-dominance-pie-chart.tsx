
'use client';

import * as React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const chartConfig = {
  btc: {
    label: 'Bitcoin',
    color: 'hsl(var(--chart-1))',
  },
  eth: {
    label: 'Ethereum',
    color: 'hsl(var(--chart-2))',
  },
  others: {
    label: 'Others',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

interface MarketDominancePieChartProps {
  data: {
    name: 'btc' | 'eth' | 'others';
    dominance: number;
    value: string;
  }[];
  totalMarketCap: string;
}

export function MarketDominancePieChart({ data, totalMarketCap }: MarketDominancePieChartProps) {
  const chartData = data.map(item => ({ ...item, fill: chartConfig[item.name].color }));

  return (
    <Card className="flex flex-col h-full bg-card/60 backdrop-blur-md">
      <CardHeader>
        <CardTitle>Market Dominance</CardTitle>
        <CardDescription>
          Total Market Cap: <span className="font-bold">{totalMarketCap}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                cursor={{
                  stroke: 'hsl(var(--border))',
                  strokeWidth: 1,
                  fill: 'hsl(var(--muted))',
                  radius: 4,
                }}
                content={<ChartTooltipContent 
                    nameKey="label"
                    formatter={(value, name, props) => (
                        <div className="flex flex-col">
                            <span className="font-bold">{props.payload?.value}</span>
                            <span className="text-muted-foreground">{`${value}%`}</span>
                        </div>
                    )}
                 />}
              />
              <Pie
                data={chartData}
                dataKey="dominance"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                paddingAngle={2}
                labelLine={false}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                    return (
                        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold">
                            {`${(percent * 100).toFixed(0)}%`}
                        </text>
                    );
                }}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Legend
                content={({ payload }) => {
                  return (
                    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-sm">
                      {payload?.map((entry, index) => (
                        <li key={`item-${index}`} className="flex items-center gap-2">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span>{entry.value}</span>
                        </li>
                      ))}
                    </ul>
                  )
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
