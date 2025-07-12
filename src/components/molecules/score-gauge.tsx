
'use client';

import * as React from 'react';
import { Pie, PieChart, Cell } from 'recharts';
import {
  ChartContainer,
} from '@/components/ui/chart';

const getAngle = (score: number) => 180 - (score / 100) * 180;

const Hand = ({ score, style }: { score: number, style?: React.CSSProperties }) => {
    const angle = getAngle(score);
    return (
        <div 
            className="absolute top-0 left-0 w-full h-full"
            style={{
                transform: `rotate(${angle}deg)`,
                transformOrigin: 'bottom center',
                transition: 'transform 0.5s ease-out',
                ...style
            }}
        >
            <div 
                className="absolute"
                style={{
                    bottom: '50%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '3px',
                    height: '35%',
                    backgroundColor: 'hsl(var(--card-foreground))',
                    borderRadius: '3px 3px 0 0',
                    boxShadow: '0 0 2px rgba(0,0,0,0.5)'
                }}
            />
            <div 
                className="absolute rounded-full"
                style={{
                    bottom: 'calc(50% - 6px)',
                    left: 'calc(50% - 6px)',
                    width: '12px',
                    height: '12px',
                    backgroundColor: 'hsl(var(--card-foreground))',
                    border: '2px solid hsl(var(--card))'
                }}
            />
        </div>
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
      className="mx-auto aspect-[1.5] w-full max-w-[300px] relative"
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
        </Pie>
      </PieChart>
       <Hand score={score} style={{ bottom: '20px' }} />
    </ChartContainer>
  );
}
