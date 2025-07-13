'use client';

import { MarketSummaryCard } from "./market-summary-card";
import type { CombinedMarketData } from '@/types';

interface DetailedMarketSummarySectionProps {
    marketData: CombinedMarketData | null;
}

export function DetailedMarketSummarySection({ marketData }: DetailedMarketSummarySectionProps) {
  return (
    <MarketSummaryCard marketData={marketData} />
  );
}