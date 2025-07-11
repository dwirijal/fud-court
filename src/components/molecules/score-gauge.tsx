
'use client';

import * as React from 'react';
import { Pie, PieChart, Cell } from 'recharts';
import {
  ChartContainer,
} from '@/components/ui/chart';

const getAngle = (score: number) => 180 - (score / 100) * 180;

const Hand = ({ cx, cy, score }: { cx: number, cy: number, score: number }) => {
    const angle = getAngle(score);
    return (
        <g transform={`rotate(${angle} ${cx} ${cy})`}>
            <circle cx={cx} cy={cy} r="6" fill="hsl(var(--card-foreground))" />
            <line
                x1={cx}
                y1={cy}
                x2={cx}
                y2={cy-55}
                stroke="hsl(var(--card-foreground))"
                strokeWidth="2"
                strokeLinecap="round"
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
    { sentiment: 'bearish', value: 40, color: 'hsl(var(--destructive))' },
    { sentiment: 'neutral', value: 20, color: 'hsl(var(--muted-foreground))' },
    { sentiment: 'bullish', value: 40, color: 'hsl(var(--chart-2))' },
  ];

  return (
    <ChartContainer
      config={{}}
      className="mx-auto aspect-square w-full max-w-[250px]"
    >
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="sentiment"
          innerRadius={80}
          outerRadius={100}
          startAngle={180}
          endAngle={0}
          cx="50%"
          cy="50%"
          cornerRadius={5}
        >
          {chartData.map((entry) => (
            <Cell key={`cell-${entry.sentiment}`} fill={entry.color} />
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
