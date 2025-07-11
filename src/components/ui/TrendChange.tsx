
'use client';

import { cn } from "@/lib/utils";

export function TrendChange({ change }: { change: number | null }) {
  if (change === null) {
    return <span className="font-mono text-xs text-muted-foreground">-</span>;
  }
  
  const absChange = Math.abs(change).toFixed(0);
  const symbol = change > 0 ? "▲" : change < 0 ? "▼" : "";
  const color =
    change > 0 ? "text-chart-2" : change < 0 ? "text-destructive" : "text-muted-foreground";

  if (change === 0) {
    return <span className={cn("font-mono text-xs", color)}>-</span>;
  }

  return (
    <span className={cn("font-mono text-xs", color)}>
      {symbol} {absChange} pts
    </span>
  );
}
