
"use client"

import * as React from "react"
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip, Legend } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  value: {
    label: "Dominance",
  },
  btc: {
    label: "Bitcoin",
    color: "hsl(var(--chart-1))",
  },
  eth: {
    label: "Ethereum",
    color: "hsl(var(--chart-2))",
  },
  others: {
    label: "Others",
    color: "hsl(var(--chart-3))",
  },
}

interface MarketDominancePieChartProps {
    data: { name: string; value: number; fill: string }[];
}

export function MarketDominancePieChart({ data }: MarketDominancePieChartProps) {
  return (
    <div className="h-64 w-full">
        <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square h-full"
        >
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Tooltip
                    cursor={false}
                    content={<ChartTooltipContent 
                        hideLabel 
                        formatter={(value, name) => `${(value as number).toFixed(2)}%`}
                    />}
                />
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    strokeWidth={5}
                    cy="50%"
                >
                    {data.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                    ))}
                </Pie>
                <Legend
                    content={({ payload }) => {
                        return (
                        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                            {payload?.map((entry) => (
                            <li key={`item-${entry.value}`} className="flex items-center gap-1.5">
                                <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                                />
                                {entry.value}
                            </li>
                            ))}
                        </ul>
                        )
                    }}
                    verticalAlign="bottom"
                />
            </PieChart>
        </ResponsiveContainer>
        </ChartContainer>
    </div>
  )
}
