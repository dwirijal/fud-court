
'use client';

import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

export function TrendChange({ change, isPercentage = false }: { change: number | null, isPercentage?: boolean }) {
  if (change === null || isNaN(change)) {
    return <div className="font-mono text-right text-muted-foreground">-</div>;
  }

  const isPositive = change >= 0;
  const value = isPercentage ? `${Math.abs(change).toFixed(2)}%` : change.toFixed(0);
  
  const symbol = isPercentage ? (isPositive ? <TrendingUp className="h-4 w-4 shrink-0" /> : <TrendingDown className="h-4 w-4 shrink-0" />) : (change > 0 ? "▲" : change < 0 ? "▼" : "");
  const color =
    isPositive ? "text-chart-2" : "text-destructive";

  if (change === 0) {
    return <span className={cn("font-mono text-xs text-muted-foreground", isPercentage && "flex items-center justify-end gap-1")}>-</span>;
  }

  return (
    <div
      className={cn(
        'flex items-center justify-end gap-1 font-mono text-sm',
        color
      )}
    >
      {symbol}
      <span>{value}</span>
    </div>
  );
}
