import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { DetailedMarketStatsSection } from "@/components/organisms/detailed-market-stats-section";
import { DetailedMarketSummarySection } from "@/components/organisms/detailed-market-summary-section";
import { MarketCapExplanationCard } from "@/components/molecules/market-cap-explanation-card";
import { VolumeExplanationCard } from "@/components/molecules/volume-explanation-card";
import { FearGreedExplanationCard } from "@/components/molecules/fear-greed-explanation-card";
import { ATHExplanationCard } from "@/components/molecules/ath-explanation-card";
import { MarketBreadthExplanationCard } from "@/components/molecules/market-breadth-explanation-card";
import { fetchMarketData } from "@/lib/coingecko";
import { getFearAndGreedIndex } from "@/lib/fear-greed";
import { format } from "date-fns";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    compactDisplay: 'short',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatPercentage = (value: number) => {
  return `${value.toFixed(2)}%`;
};

export default async function MarketDashboardPage() {
  const marketData = await fetchMarketData();
  const fearGreedData = await getFearAndGreedIndex();

  if (!marketData) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-24 text-center">
        <h1 className="text-4xl font-semibold mb-8">Market Overview</h1>
        <p className="text-red-500">Failed to load market data. Please try again later.</p>
      </div>
    );
  }

  const { totalMarketCap, btcDominance, ethDominance, totalVolume24h, maxHistoricalMarketCap, maxHistoricalMarketCapDate, topCoinsForAnalysis } = marketData;
  const fearAndGreedIndex = fearGreedData?.value || 'N/A';
  const fearAndGreedClassification = fearGreedData?.value_classification || 'N/A';

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <h1 className="text-4xl font-semibold mb-8">Market Overview</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <DetailedMarketSummarySection marketData={marketData} />
        </div>
        <DetailedMarketStatsSection marketStats={marketData} />
      </div>

      <h2 className="text-3xl font-semibold mb-6 mt-12">Detailed Indicator Explanations</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <MarketCapExplanationCard
          totalMarketCap={totalMarketCap}
          maxHistoricalMarketCap={maxHistoricalMarketCap}
          maxHistoricalMarketCapDate={maxHistoricalMarketCapDate}
        />
        <VolumeExplanationCard
          totalVolume24h={totalVolume24h}
          avg30DayVolume={totalVolume24h} // Using totalVolume24h as a placeholder for avg30DayVolume
        />
        <FearGreedExplanationCard
          fearAndGreedIndex={fearAndGreedIndex}
          fearAndGreedClassification={fearAndGreedClassification}
        />
        <ATHExplanationCard
          topCoinsForAnalysis={topCoinsForAnalysis}
        />
        <MarketBreadthExplanationCard
          topCoinsForAnalysis={topCoinsForAnalysis}
        />
      </div>
    </div>
  );
}