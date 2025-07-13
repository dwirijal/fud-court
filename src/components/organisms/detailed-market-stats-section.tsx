'use client';

import { MarketStatsCard } from "./market-stats-card";
import type { MarketStats } from "@/types";

interface DetailedMarketStatsSectionProps {
    marketStats: MarketStats | null;
}

export function DetailedMarketStatsSection({ marketStats }: DetailedMarketStatsSectionProps) {
  return (
    <MarketStatsCard marketStats={marketStats} />
  );
}
