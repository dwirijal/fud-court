
'use client';

import * as React from 'react';
import { Pie, PieChart, Cell } from 'recharts';
import {
  ChartContainer,
  ChartConfig,
} from '@/components/ui/chart';

const chartConfig = {
  value: {
    label: 'Value',
  },
  bearish: {
    label: 'Bearish',
    color: 'hsl(var(--destructive))',
  },
  neutral: {
    label: 'Neutral',
    color: 'hsl(var(--muted-foreground))',
  },
  bullish: {
    label: 'Bullish',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

// Helper to calculate pointer angle
const getAngle = (score: number) => {
    // Gauge is a semi-circle (180 degrees), from score 0 to 100
    // Angle starts at 180 (left) and ends at 0 (right)
    return 180 - (score / 100) * 180;
};

// The hand (pointer) of the gauge
const Hand = ({ score }: { score: number }) => {
    const angle = getAngle(score);
    return (
        <g>
            <circle cx="50%" cy="50%" r="6" fill="hsl(var(--card-foreground))" />
            <line
                x1="50%"
                y1="50%"
                x2="50%"
                y2="15%"
                stroke="hsl(var(--card-foreground))"
                strokeWidth="2"
                strokeLinecap="round"
                transform={`rotate(${angle} 125 125)`}
            />
        </g>
    );
};


export function ScoreGauge({
  score,
}: {
  score: number;
}) {
  const chartData = [
    { name: 'bearish', value: 40, fill: chartConfig.bearish.color },
    { name: 'neutral', value: 20, fill: chartConfig.neutral.color },
    { name: 'bullish', value: 40, fill: chartConfig.bullish.color },
  ];

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square w-full max-w-[250px]"
    >
      <PieChart>
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
          {chartData.map((entry) => (
            <Cell key={`cell-${entry.name}`} fill={entry.fill} />
          ))}
        </Pie>
        <Hand score={score} />
      </PieChart>
    </ChartContainer>
  );
}
