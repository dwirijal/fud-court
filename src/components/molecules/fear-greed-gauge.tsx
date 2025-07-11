
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";

const chartConfig = {
  value: {
    label: "Value",
  },
  fear: {
    label: "Fear",
    color: "hsl(var(--destructive))",
  },
  neutral: {
    label: "Neutral",
    color: "hsl(var(--muted-foreground))",
  },
  greed: {
    label: "Greed",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function FearGreedGauge({ value, classification }: { value: number; classification: string }) {
  const chartData = [
    { name: "value", value: value, fill: "transparent" },
    { name: "background", value: 100 - value, fill: "hsl(var(--muted))" },
  ];

  const getActiveColor = () => {
    if (classification.toLowerCase().includes("fear")) return chartConfig.fear.color;
    if (classification.toLowerCase().includes("greed")) return chartConfig.greed.color;
    return chartConfig.neutral.color;
  };

  const activeColor = getActiveColor();

  return (
    <Card className="flex flex-col items-center justify-center p-6 bg-card/60 backdrop-blur-md">
      <CardHeader className="items-center pb-2 text-center">
        <CardTitle>Fear & Greed Index</CardTitle>
        <CardDescription>Real-time market sentiment</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center justify-center p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <PieChart>
            <defs>
                <linearGradient id="fearGreedGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={chartConfig.fear.color} />
                    <stop offset="50%" stopColor={chartConfig.neutral.color} />
                    <stop offset="100%" stopColor={chartConfig.greed.color} />
                </linearGradient>
            </defs>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={80}
              outerRadius={100}
              startAngle={180}
              endAngle={0}
              cx="50%"
              cy="50%"
              cornerRadius={5}
            >
              <Cell key="value-cell" fill="url(#fearGreedGradient)" />
              <Cell key="background-cell" fill="hsl(var(--border) / 0.5)" />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
       <div className="flex flex-col items-center gap-1 text-center -mt-16">
          <span
            className="text-5xl font-bold tracking-tighter"
            style={{ color: activeColor }}
          >
            {value}
          </span>
          <span
            className="text-lg font-medium"
            style={{ color: activeColor }}
          >
            {classification}
          </span>
      </div>
    </Card>
  );
}
