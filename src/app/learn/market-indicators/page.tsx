
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

const indicators = [
    {
        name: "Market Cap Score (S₁)",
        weight: "25%",
        purpose: "Measures the current total market capitalization against its all-time high. It provides a macro view of the market's current valuation relative to its historical peak.",
        formula: "S₁ = (Current Market Cap / Peak Market Cap) * 100",
        interpretation: "A high score (near 100) indicates the market is near its historical peak, suggesting potential overheating. A low score suggests the market is significantly undervalued compared to its past performance."
    },
    {
        name: "Volume Score (S₂)",
        weight: "20%",
        purpose: "Measures the current 24-hour trading volume against the 30-day average. This indicates the level of current market activity and interest.",
        formula: "S₂ = min( (Current Volume / 30-Day Avg Volume) * 100, 200 ) / 2",
        interpretation: "The score is capped at 200% of the average volume to prevent extreme outliers, then normalized to 100. A high score signifies high participation and conviction, while a low score indicates disinterest or a quiet market."
    },
    {
        name: "Fear & Greed Score (S₃)",
        weight: "20%",
        purpose: "Directly uses the Fear & Greed Index to measure the prevailing emotional sentiment in the market. It's a classic indicator of market psychology.",
        formula: "S₃ = Fear & Greed Index Value",
        interpretation: "A low score indicates 'Extreme Fear' (potential buying opportunity), while a high score indicates 'Extreme Greed' (market may be due for a correction)."
    },
    {
        name: "ATH Score (S₄)",
        weight: "25%",
        purpose: "Measures how far, on average, the top cryptocurrencies are from their all-time highs (ATH). This acts as a proxy for market health and potential for growth.",
        formula: "S₄ = 100 - (Average % Distance from ATH of Top Coins)",
        interpretation: "A high score means that top assets are close to their previous peaks, indicating strong market-wide momentum. A low score suggests that most assets are far from their ATHs, indicating a potential bear market or a bottoming phase."
    },
    {
        name: "Market Breadth Score (S₅)",
        weight: "10%",
        purpose: "Measures the percentage of top coins that have seen positive price movement in the last 24 hours. It helps validate whether a market rally is broad-based or driven by only a few large assets.",
        formula: "S₅ = (% of Top Coins with 24h Price Increase) * 100",
        interpretation: "A high score (>50%) shows that a majority of the market is participating in the upward trend (healthy rally). A low score indicates that only a few coins are driving gains, which could be a sign of weakness."
    }
];

export default function MarketIndicatorsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
       <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/learn">Learn</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Market Score Indicators</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mb-12">
        <div className="flex items-center gap-4 mb-2">
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
                <BookOpen className="h-8 w-8" />
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight">
                Market Score Indicators
            </h1>
        </div>
        <p className="text-xl text-muted-foreground mt-2">
            A detailed breakdown of the components used to calculate the Macro Sentiment Score.
        </p>
      </header>
      
      <div className="space-y-6">
        {indicators.map((indicator, index) => (
            <Card key={index}>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-2xl font-headline">{indicator.name}</CardTitle>
                        <Badge variant="secondary">Weight: {indicator.weight}</Badge>
                    </div>
                    <CardDescription>{indicator.purpose}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-sm mb-1">Formula</h4>
                        <p className="font-mono text-xs bg-muted p-3 rounded-md">{indicator.formula}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm mb-1">Interpretation</h4>
                        <p className="text-muted-foreground text-sm">{indicator.interpretation}</p>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
