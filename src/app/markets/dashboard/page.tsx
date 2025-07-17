
import { MarketStatsCard } from "@/components/organisms/market-stats-card";
import { MarketSummaryCard } from "@/components/organisms/market-summary-card";
import { fetchMarketData } from "@/lib/coingecko";

export default async function MarketDashboardPage() {
  const marketData = await fetchMarketData();

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
        <MarketSummaryCard marketData={marketData} />
      </section>

      <section>
        <MarketStatsCard marketStats={marketData} />
      </section>

    </div>
  );
}
