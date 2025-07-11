
'use client';

import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function TrendIcon({ change }: { change: number | null }) {
  if (change === null) {
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  }
  
  const isPositive = change > 0;
  const isNeutral = change === 0;

  if (isNeutral) {
     return <Minus className="h-4 w-4 text-muted-foreground" />;
  }

  return isPositive ? (
    <ArrowUp className={cn("h-4 w-4 text-chart-2")} />
  ) : (
    <ArrowDown className={cn("h-4 w-4 text-destructive")} />
  );
}
