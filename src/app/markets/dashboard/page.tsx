
import { DetailedMarketStatsSection } from "@/components/organisms/detailed-market-stats-section";
import { DetailedMarketSummarySection } from "@/components/organisms/detailed-market-summary-section";
import { fetchMarketData } from "@/lib/coingecko";
import { getFearAndGreedIndex } from "@/lib/fear-greed";

export default async function MarketDashboardPage() {
  const marketData = await fetchMarketData();
  const fearGreedData = await getFearAndGreedIndex();

  if (!marketData) {
    return (
      <div className="container mx-auto px-4 py-7 md:py-8 text-center">
        <h1 className="text-4xl font-semibold mb-6">Market Overview</h1>
        <p className="text-red-500">Failed to load market data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-7 md:py-8 space-y-7">
      <header>
        <h1 className="text-4xl font-semibold font-headline tracking-tight mb-2">Market Dashboard</h1>
        <p className="text-lg text-muted-foreground">Tampilan komprehensif dari metrik utama pasar kripto.</p>
      </header>
      
      <section>
        <DetailedMarketSummarySection marketData={marketData} />
      </section>

      <section>
        <DetailedMarketStatsSection marketStats={marketData} />
      </section>

    </div>
  );
}
