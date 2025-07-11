
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { BookOpen, Database, AlertTriangle, ArrowRight, TrendingUp, TrendingDown, Weight, Calculator } from "lucide-react";
import { fetchMarketData } from "@/lib/coingecko";
import { TrendChange } from "@/components/ui/TrendChange";

const indicators = [
    {
        id: "marketCapScore",
        name: "Market Cap Score (S₁)",
        weight: "25%",
        purpose: "Measures the current total market capitalization against its all-time high. It provides a macro view of the market's current valuation relative to its historical peak.",
        formula: "S₁ = (Current Market Cap / Peak Market Cap) * 100",
        interpretation: "A high score (near 100) indicates the market is near its historical peak, suggesting potential overheating. A low score suggests the market is significantly undervalued compared to its past performance."
    },
    {
        id: "volumeScore",
        name: "Volume Score (S₂)",
        weight: "20%",
        purpose: "Measures the current 24-hour trading volume against the 30-day average. This indicates the level of current market activity and interest.",
        formula: "S₂ = min( (Current Volume / 30-Day Avg Volume) * 100, 200 ) / 2",
        interpretation: "The score is capped at 200% of the average volume to prevent extreme outliers, then normalized to 100. A high score signifies high participation and conviction, while a low score indicates disinterest or a quiet market."
    },
    {
        id: "fearGreedScore",
        name: "Fear & Greed Score (S₃)",
        weight: "20%",
        purpose: "Directly uses the Fear & Greed Index to measure the prevailing emotional sentiment in the market. It's a classic indicator of market psychology.",
        formula: "S₃ = Fear & Greed Index Value",
        interpretation: "A low score indicates 'Extreme Fear' (potential buying opportunity), while a high score indicates 'Extreme Greed' (market may be due for a correction)."
    },
    {
        id: "athScore",
        name: "ATH Score (S₄)",
        weight: "25%",
        purpose: "Measures how far, on average, the top cryptocurrencies are from their all-time highs (ATH). This acts as a proxy for market health and potential for growth.",
        formula: "S₄ = 100 - (Average % Distance from ATH of Top Coins)",
        interpretation: "A high score means that top assets are close to their previous peaks, indicating strong market-wide momentum. A low score suggests that most assets are far from their ATHs, indicating a potential bear market or a bottoming phase."
    },
    {
        id: "marketBreadthScore",
        name: "Market Breadth Score (S₅)",
        weight: "10%",
        purpose: "Measures the percentage of top coins that have seen positive price movement in the last 24 hours. It helps validate whether a market rally is broad-based or driven by only a few large assets.",
        formula: "S₅ = (Rising Tokens / Total Top Coins) * 100",
        interpretation: "A high score (>50%) shows that a majority of the market is participating in the upward trend (healthy rally). A low score indicates that only a few coins are driving gains, which could be a sign of weakness."
    }
];

const formatCurrency = (value: number, compact: boolean = true) => {
    const options: Intl.NumberFormatOptions = {
        style: 'currency',
        currency: 'USD',
    };
    if (compact) {
        options.notation = 'compact';
        options.compactDisplay = 'short';
        options.maximumFractionDigits = 2;
    } else {
        options.minimumFractionDigits = 2;
        options.maximumFractionDigits = value < 1 ? 6 : 2;
    }
    return new Intl.NumberFormat('en-US', options).format(value);
};

export default async function MarketIndicatorsPage() {
  const marketData = await fetchMarketData();

  let indicatorScores: Record<string, { raw: Record<string, any>; score: number }> | null = null;
  if (marketData) {
      const { totalMarketCap, maxHistoricalMarketCap, totalVolume24h, avg30DayVolume, fearAndGreedIndex, topCoins } = marketData;
      
      const s1_marketCap = (totalMarketCap / maxHistoricalMarketCap) * 100;

      const raw_volume_score = (totalVolume24h / avg30DayVolume) * 100;
      const capped_volume_score = Math.min(raw_volume_score, 200);
      const s2_volume = capped_volume_score / 2;
      
      const s3_fearAndGreed = fearAndGreedIndex;

      const n_ath = topCoins.length;
      const distanceFromAthSum = topCoins.reduce((sum, coin) => {
        const distance = ((coin.ath - coin.current_price) / coin.ath) * 100;
        return sum + (distance > 0 ? distance : 0);
      }, 0);
      const avgDistanceFromAth = n_ath > 0 ? (distanceFromAthSum / n_ath) : 0;
      const s4_ath = 100 - avgDistanceFromAth;

      const risingTokens = topCoins.filter(c => (c.price_change_percentage_24h || 0) > 0).length;
      const n_breadth = topCoins.length;
      const s5_marketBreadth = n_breadth > 0 ? (risingTokens / n_breadth) * 100 : 0;
      
      indicatorScores = {
        marketCapScore: {
          raw: { "Current Market Cap": formatCurrency(totalMarketCap), "Peak Market Cap": formatCurrency(maxHistoricalMarketCap) },
          score: Math.round(s1_marketCap)
        },
        volumeScore: {
          raw: { "Current Volume": formatCurrency(totalVolume24h), "30d Avg Volume": formatCurrency(avg30DayVolume) },
          score: Math.round(s2_volume)
        },
        fearGreedScore: {
          raw: { "Index Value": fearAndGreedIndex },
          score: Math.round(s3_fearAndGreed)
        },
        athScore: {
          raw: { "Avg. % Distance from ATH": `${avgDistanceFromAth.toFixed(2)}%` },
          score: Math.round(s4_ath)
        },
        marketBreadthScore: {
          raw: { "Rising Tokens": risingTokens, "Total Top Coins": n_breadth },
          score: Math.round(s5_marketBreadth)
        },
      }
  }

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
      
      <div className="space-y-12">
        {marketData ? (
             <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Database className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Raw Data (Live Input)</CardTitle>
                    </div>
                    <CardDescription>The actual values being fed into the formulas below.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 text-sm">
                        <li className="flex justify-between items-baseline border-b pb-2">
                            <span className="text-muted-foreground">Total Market Cap</span>
                            <span className="font-mono font-semibold">{formatCurrency(marketData.totalMarketCap)}</span>
                        </li>
                         <li className="flex justify-between items-baseline border-b pb-2">
                            <span className="text-muted-foreground pl-4">↳ BTC Market Cap</span>
                            <span className="font-mono font-semibold">{formatCurrency(marketData.btcMarketCap)}</span>
                        </li>
                         <li className="flex justify-between items-baseline border-b pb-2">
                            <span className="text-muted-foreground pl-4">↳ ETH Market Cap</span>
                            <span className="font-mono font-semibold">{formatCurrency(marketData.ethMarketCap)}</span>
                        </li>
                         <li className="flex justify-between items-baseline border-b pb-2">
                            <span className="text-muted-foreground pl-4">↳ SOL Market Cap</span>
                            <span className="font-mono font-semibold">{formatCurrency(marketData.solMarketCap)}</span>
                        </li>
                        <li className="flex justify-between items-baseline border-b pb-2">
                            <span className="text-muted-foreground pl-4">↳ Stablecoin Market Cap</span>
                            <span className="font-mono font-semibold">{formatCurrency(marketData.stablecoinMarketCap)}</span>
                        </li>
                         <li className="flex justify-between items-baseline border-b pb-2">
                            <span className="text-muted-foreground">24h Volume</span>
                            <span className="font-mono font-semibold">{formatCurrency(marketData.totalVolume24h)}</span>
                        </li>
                        <li className="flex justify-between items-baseline border-b pb-2">
                            <span className="text-muted-foreground">Fear & Greed Index</span>
                            <span className="font-mono font-semibold">{marketData.fearAndGreedIndex}</span>
                        </li>
                        <li className="flex justify-between items-baseline border-b pb-2">
                            <span className="text-muted-foreground">BTC Dominance</span>
                            <span className="font-mono font-semibold">{marketData.btcDominance.toFixed(2)}%</span>
                        </li>
                        <li className="flex justify-between items-baseline border-b pb-2">
                            <span className="text-muted-foreground">Max Historical Cap ({marketData.maxHistoricalMarketCapDate})</span>
                             <span className="font-mono font-semibold">{formatCurrency(marketData.maxHistoricalMarketCap)}</span>
                        </li>
                    </ul>
                     <div>
                        <h4 className="text-base font-semibold text-foreground mb-2">Top Coins Analysis Breakdown ({marketData.topCoinsForAnalysis.length})</h4>
                        <div className="overflow-x-auto rounded-lg border">
                           <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Coin</TableHead>
                                <TableHead className="text-right">Current Price</TableHead>
                                <TableHead className="text-right">ATH</TableHead>
                                <TableHead className="text-right">% From ATH</TableHead>
                                <TableHead className="text-right">24h Change</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {marketData.topCoinsForAnalysis.map((coin) => (
                                <TableRow key={coin.symbol}>
                                    <TableCell className="font-medium">{coin.name} <span className="text-muted-foreground text-xs">{coin.symbol.toUpperCase()}</span></TableCell>
                                    <TableCell className="text-right font-mono text-sm">{formatCurrency(coin.current_price, false)}</TableCell>
                                    <TableCell className="text-right font-mono text-sm">{formatCurrency(coin.ath, false)}</TableCell>
                                    <TableCell className="text-right font-mono text-sm text-destructive">-{((1 - coin.current_price / coin.ath) * 100).toFixed(2)}%</TableCell>
                                    <TableCell className="text-right">
                                        <TrendChange change={coin.price_change_percentage_24h} isPercentage={true} />
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        ) : (
            <Card className="bg-destructive/10 border-destructive">
                <CardHeader className="flex-row gap-3 items-center">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <CardTitle className="text-destructive">Could Not Fetch Live Data</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-destructive/80">The raw data inputs could not be loaded. The examples below will use placeholder values.</p>
                </CardContent>
            </Card>
        )}


        <div className="space-y-6">
            <h2 className="text-3xl font-headline font-semibold">Indicator Breakdown</h2>
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
                        {indicatorScores && indicatorScores[indicator.id] ? (
                            <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                                <div>
                                    <h4 className="font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wider">Data Input</h4>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                        {Object.entries(indicatorScores[indicator.id].raw).map(([key, value]) => (
                                            <div key={key} className="flex justify-between items-baseline border-b border-muted">
                                                <span>{key}</span>
                                                <span className="font-mono font-medium">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold text-sm mb-1 text-muted-foreground uppercase tracking-wider">Formula</h4>
                                    <p className="font-mono text-xs bg-background p-3 rounded-md">{indicator.formula}</p>
                                </div>

                                <div className="flex items-center justify-between bg-background p-3 rounded-md">
                                     <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Result</h4>
                                     <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-xl text-primary">{indicatorScores[indicator.id].score}</span>
                                        <span className="text-sm text-muted-foreground">/ 100</span>
                                     </div>
                                </div>
                            </div>
                        ) : (
                             <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">Live calculation data unavailable.</div>
                        )}
                        <div>
                            <h4 className="font-semibold text-sm mb-1 text-muted-foreground uppercase tracking-wider">Interpretation</h4>
                            <p className="text-muted-foreground text-sm">{indicator.interpretation}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-2xl font-headline">Final Score Calculation (M)</CardTitle>
                    </div>
                    <CardDescription>The final macro score is a weighted average of the five indicator scores, reflecting their relative importance in the overall market analysis.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                        <div>
                            <h4 className="font-semibold text-sm mb-1 text-muted-foreground uppercase tracking-wider">Formula</h4>
                            <p className="font-mono text-xs bg-background p-3 rounded-md">M = (S₁ × 0.25) + (S₂ × 0.20) + (S₃ × 0.20) + (S₄ × 0.25) + (S₅ × 0.10)</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
