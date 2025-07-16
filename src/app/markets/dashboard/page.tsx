
import { DetailedMarketStatsSection } from "@/components/organisms/detailed-market-stats-section";
import { DetailedMarketSummarySection } from "@/components/organisms/detailed-market-summary-section";
import { fetchMarketData } from "@/lib/coingecko";
import { getFearAndGreedIndex } from "@/lib/fear-greed";

export default async function MarketDashboardPage() {
  const marketData = await fetchMarketData();
  const fearGreedData = await getFearAndGreedIndex();

  if (!marketData) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-16 text-center">
        <h1 className="text-4xl font-semibold mb-8">Market Overview</h1>
        <p className="text-red-500">Failed to load market data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 space-y-12">
      <header>
        <h1 className="text-4xl md:text-5xl font-semibold font-headline tracking-tight mb-2">Market Dashboard</h1>
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
