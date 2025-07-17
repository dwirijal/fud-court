
import { MarketStatsCard } from "@/components/organisms/market-stats-card";
import { MarketSummaryCard } from "@/components/organisms/market-summary-card";
import { fetchMarketData } from "@/lib/coingecko";

export default async function MarketDashboardPage() {
  const marketData = await fetchMarketData();

  if (!marketData) {
    return (
      <div className="container-full section-spacing text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-6">Market Overview</h1>
        <p className="text-base text-market-down">Failed to load market data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container-full section-spacing space-y-7">
      <header>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Market Dashboard</h1>
        <p className="text-lg text-text-secondary">Tampilan komprehensif dari metrik utama pasar kripto.</p>
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
