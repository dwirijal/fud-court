
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

const getAngle = (score: number) => 180 - (score / 100) * 180;

const Hand = ({ cx, cy, score }: { cx: number, cy: number, score: number }) => {
    const angle = getAngle(score);
    return (
        <g>
            <circle cx={cx} cy={cy} r="6" fill="hsl(var(--card-foreground))" />
            <line
                x1={cx}
                y1={cy}
                x2={cx}
                y2={cy-55}
                stroke="hsl(var(--card-foreground))"
                strokeWidth="2"
                strokeLinecap="round"
                transform={`rotate(${angle} ${cx} ${cy})`}
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
          {({ cx, cy }) => {
            if (cx && cy) {
                return <Hand cx={cx} cy={cy} score={score} />;
            }
            return null;
          }}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
