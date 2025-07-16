import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MarketDataTable } from "../market-data-table";

const formatCurrency = (value: number | null | undefined, currency: string = 'usd', compact: boolean = false) => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  if (compact) {
    options.notation = 'compact';
    options.maximumFractionDigits = 2;
  }
  return new Intl.NumberFormat('en-US', options).format(value);
};

const formatPercentage = (value: number | null | undefined) => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A%';
  return `${value.toFixed(2)}%`;
};

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

  const { totalMarketCap, btcDominance, ethDominance, totalVolume24h, maxHistoricalMarketCap, maxHistoricalMarketCapDate, topCoinsForAnalysis } = marketData;
  const fearAndGreedIndex = fearGreedData?.value || 'N/A';
  const fearAndGreedClassification = fearGreedData?.value_classification || 'N/A';

  const explanationCards = [
    {
      id: "market-cap-explanation",
      title: "Skor Kapitalisasi Pasar",
      description: "Seberapa Dekat Pasar dengan Puncaknya?",
      component: (
        <MarketCapExplanationCard
          totalMarketCap={totalMarketCap}
          maxHistoricalMarketCap={maxHistoricalMarketCap}
          maxHistoricalMarketCapDate={maxHistoricalMarketCapDate}
        />
      ),
    },
    {
      id: "volume-explanation",
      title: "Skor Volume",
      description: "Seberapa Aktif Pasar Hari Ini?",
      component: (
        <VolumeExplanationCard
          totalVolume24h={totalVolume24h}
          avg30DayVolume={totalVolume24h} // Using totalVolume24h as a placeholder for avg30DayVolume
        />
      ),
    },
    {
      id: "fear-greed-explanation",
      title: "Skor Fear & Greed",
      description: "Mengukur Rasa Takut atau Serakah Investor",
      component: (
        <FearGreedExplanationCard
          fearAndGreedIndex={fearAndGreedIndex}
          fearAndGreedClassification={fearAndGreedClassification}
        />
      ),
    },
    {
      id: "ath-explanation",
      title: "Skor ATH",
      description: "Seberapa Jauh dari Puncak?",
      component: (
        <ATHExplanationCard
          topCoinsForAnalysis={topCoinsForAnalysis}
        />
      ),
    },
    {
      id: "market-breadth-explanation",
      title: "Skor Sebaran Pasar",
      description: "Apakah Pasar Bergerak Secara Luas?",
      component: (
        <MarketBreadthExplanationCard
          topCoinsForAnalysis={topCoinsForAnalysis}
        />
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 space-y-12">
      <header>
        <h1 className="text-4xl md:text-5xl font-semibold font-headline tracking-tight mb-2">Market Overview</h1>
        <p className="text-lg text-muted-foreground">Tampilan komprehensif dari metrik utama pasar kripto.</p>
      </header>
      
      <section>
        <DetailedMarketSummarySection marketData={marketData} />
      </section>

      <section>
        <DetailedMarketStatsSection marketStats={marketData} />
      </section>

      <section>
        <h2 className="text-3xl font-semibold font-headline tracking-tight mb-6">Detailed Indicator Explanations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {explanationCards.map((card) => (
            <Card key={card.id} className="flex flex-col">
              <CardHeader className="flex-grow">
                <CardTitle className="text-xl font-headline">{card.title}</CardTitle>
                <CardDescription className="line-clamp-2">{card.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Lihat Detail
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{card.title}</DialogTitle>
                      <DialogDescription>{card.description}</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      {card.component}
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold font-headline tracking-tight mb-6">Top Cryptocurrencies</h2>
        <Card>
          <CardContent className="p-0">
            <MarketDataTable currency="usd" />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
