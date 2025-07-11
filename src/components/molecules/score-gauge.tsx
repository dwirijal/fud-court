
'use client';

import * as React from 'react';
import { Pie, PieChart, Cell } from 'recharts';
import {
  ChartContainer,
} from '@/components/ui/chart';

const getAngle = (score: number) => 180 - (score / 100) * 180;

const Hand = ({ cx, cy, score }: { cx: number, cy: number, score: number }) => {
    if (cx === undefined || cy === undefined) return null;
    const angle = getAngle(score);
    return (
        <g transform={`rotate(${angle} ${cx} ${cy})`} style={{ transition: 'transform 0.5s ease-out' }}>
            <circle cx={cx} cy={cy} r={6} fill="hsl(var(--card-foreground))" stroke="hsl(var(--card))" strokeWidth={2} />
            <line
                x1={cx}
                y1={cy}
                x2={cx}
                y2={cy-65}
                stroke="hsl(var(--card-foreground))"
                strokeWidth="3"
                strokeLinecap="round"
            />
             <line
                x1={cx}
                y1={cy}
                x2={cx}
                y2={cy-63}
                stroke="hsl(var(--card))"
                strokeWidth="1"
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
    { sentiment: 'bearish', value: 40, color: 'hsl(var(--destructive) / 0.8)' },
    { sentiment: 'neutral', value: 20, color: 'hsl(var(--muted-foreground) / 0.5)' },
    { sentiment: 'bullish', value: 40, color: 'hsl(var(--chart-2) / 0.8)' },
  ];

  return (
    <ChartContainer
      config={{}}
      className="mx-auto aspect-[1.5] w-full max-w-[300px]"
    >
      <PieChart margin={{ top: 0, right: 20, bottom: 20, left: 20 }}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="sentiment"
          innerRadius={70}
          outerRadius={100}
          startAngle={180}
          endAngle={0}
          cx="50%"
          cy="100%"
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
