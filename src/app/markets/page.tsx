
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Database, AlertTriangle, ArrowRight, TrendingUp, TrendingDown, Weight, Calculator, Info } from "lucide-react";
import { fetchMarketData } from "@/lib/coingecko";
import { TrendChange } from "@/components/ui/TrendChange";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { CombinedMarketData } from "@/types";

// Directly integrate the analysis logic here.
const weights = {
  marketCap: 0.25,
  volume: 0.20,
  fearAndGreed: 0.20,
  ath: 0.25,
  marketBreadth: 0.10
};

function analyzeMarketData(input: CombinedMarketData) {
    // 1. Confidence Score
    let confidence = 100;
    if (input.totalMarketCap <= 0) confidence -= 25;
    if (input.totalVolume24h <= 0) confidence -= 25;
    if (input.fearAndGreedIndex < 0 || input.fearAndGreedIndex > 100) confidence -= 15;
    const expectedCoins = 20;
    if (input.topCoins.length < expectedCoins) {
        const missingPercentage = (expectedCoins - input.topCoins.length) / expectedCoins;
        confidence -= missingPercentage * 35;
    }
    const confidenceScore = Math.max(0, Math.round(confidence));

    // 2. Component Scores
    const s1_marketCap = (input.totalMarketCap / input.maxHistoricalMarketCap) * 100;
    const raw_volume_score = (input.totalVolume24h / input.avg30DayVolume) * 100;
    const capped_volume_score = Math.min(raw_volume_score, 200);
    const s2_volume = capped_volume_score / 2;
    const s3_fearAndGreed = input.fearAndGreedIndex;

    const n_ath = input.topCoins.length;
    const distanceFromAthSum = input.topCoins.reduce((sum, coin) => {
        const distance = ((coin.ath - coin.current_price) / coin.ath) * 100;
        return sum + (distance > 0 ? distance : 0);
    }, 0);
    const avgDistanceFromAth = n_ath > 0 ? (distanceFromAthSum / n_ath) : 0;
    const s4_ath = 100 - avgDistanceFromAth;

    const risingTokens = input.topCoins.filter(c => (c.price_change_percentage_24h || 0) > 0).length;
    const n_breadth = input.topCoins.length;
    const s5_marketBreadth = n_breadth > 0 ? (risingTokens / n_breadth) * 100 : 0;

    const normalize = (value: number) => Math.max(0, Math.min(100, value));
    const finalScores = {
        marketCap: normalize(s1_marketCap),
        volume: normalize(s2_volume),
        fearAndGreed: normalize(s3_fearAndGreed),
        ath: normalize(s4_ath),
        marketBreadth: normalize(s5_marketBreadth),
    };
    
    // 3. Final Macro Score
    const macroScore = 
        finalScores.marketCap * weights.marketCap +
        finalScores.volume * weights.volume +
        finalScores.fearAndGreed * weights.fearAndGreed +
        finalScores.ath * weights.ath +
        finalScores.marketBreadth * weights.marketBreadth;
    
    let marketCondition: string;
    if (macroScore >= 80) marketCondition = 'Bullish ekstrem / Euforia';
    else if (macroScore >= 60) marketCondition = 'Bullish sehat';
    else if (macroScore >= 40) marketCondition = 'Netral / Sideways';
    else if (macroScore >= 20) marketCondition = 'Bearish / Distribusi';
    else marketCondition = 'Capitulation / Fear ekstrem';

    return {
      macroScore: Math.round(macroScore),
      marketCondition,
      components: {
        marketCapScore: Math.round(finalScores.marketCap),
        volumeScore: Math.round(finalScores.volume),
        fearGreedScore: Math.round(finalScores.fearAndGreed),
        athScore: Math.round(finalScores.ath),
        marketBreadthScore: Math.round(finalScores.marketBreadth),
      },
      confidenceScore,
    };
}


function MarketIndicatorsClient({ 
  marketData, 
  analysisResult 
}: { 
  marketData: CombinedMarketData | null, 
  analysisResult: ReturnType<typeof analyzeMarketData> | null 
}) {
  const indicators = [
    {
      id: "marketCapScore",
      name: "Skor Kapitalisasi Pasar (S₁)",
      weight: "25%",
      purpose: "Mengukur total kapitalisasi pasar saat ini terhadap nilai tertingginya sepanjang masa. Ini memberikan pandangan makro tentang valuasi pasar saat ini relatif terhadap puncaknya di masa lalu.",
      formula: "S₁ = (Kapitalisasi Pasar Saat Ini / Kapitalisasi Pasar Puncak) * 100",
      interpretation: "Skor tinggi (mendekati 100) menunjukkan pasar mendekati puncak historisnya, menyirukan potensi kejenuhan. Skor rendah menunjukkan pasar dinilai jauh lebih rendah dibandingkan kinerjanya di masa lalu."
    },
    {
      id: "volumeScore",
      name: "Skor Volume (S₂)",
      weight: "20%",
      purpose: "Mengukur volume perdagangan 24 jam saat ini terhadap rata-rata 30 hari. Ini menunjukkan tingkat aktivitas dan minat pasar saat ini.",
      formula: "S₂ = min( (Volume Saat Ini / Rata-rata Volume 30 Hari) * 100, 200 ) / 2",
      interpretation: "Skor dibatasi pada 200% dari volume rata-rata untuk mencegah anomali ekstrem, kemudian dinormalisasi menjadi 100. Skor tinggi menandakan partisipasi dan keyakinan tinggi, sementara skor rendah menunjukkan kurangnya minat atau pasar yang sepi."
    },
    {
      id: "fearGreedScore",
      name: "Skor Fear & Greed (S₃)",
      weight: "20%",
      purpose: "Langsung menggunakan Indeks Fear & Greed untuk mengukur sentimen emosional yang berlaku di pasar. Ini adalah indikator klasik psikologi pasar.",
      formula: "S₃ = Nilai Indeks Fear & Greed",
      interpretation: "Skor rendah menunjukkan 'Ketakutan Ekstrem' (potensi peluang beli), sementara skor tinggi menunjukkan 'Keserakahan Ekstrem' (pasar mungkin akan mengalami koreksi)."
    },
    {
      id: "athScore",
      name: "Skor ATH (S₄)",
      weight: "25%",
      purpose: "Mengukur seberapa jauh, rata-rata, mata uang kripto teratas dari harga tertinggi sepanjang masa (ATH). Ini berfungsi sebagai proksi untuk kesehatan pasar dan potensi pertumbuhan.",
      formula: "S₄ = 100 - (Rata-rata % Jarak dari ATH Koin Teratas)",
      interpretation: "Skor tinggi berarti aset-aset teratas mendekati puncak sebelumnya, menandakan momentum kuat di seluruh pasar. Skor rendah menunjukkan bahwa sebagian besar aset jauh dari ATH mereka, menandakan potensi pasar bearish atau fase dasar."
    },
    {
      id: "marketBreadthScore",
      name: "Skor Sebaran Pasar (S₅)",
      weight: "10%",
      purpose: "Mengukur persentase koin teratas yang mengalami pergerakan harga positif dalam 24 jam terakhir. Ini membantu memvalidasi apakah reli pasar bersifat luas atau hanya didorong oleh beberapa aset besar.",
      formula: "S₅ = (Token yang Naik / Total Koin Teratas) * 100",
      interpretation: "Skor tinggi (>50%) menunjukkan bahwa mayoritas pasar berpartisipasi dalam tren kenaikan (reli sehat). Skor rendah menunjukkan bahwa hanya beberapa koin yang mendorong kenaikan, yang bisa menjadi tanda kelemahan."
    }
  ];

  const formatCurrency = (value: number, compact: boolean = true) => {
    const options: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: 'USD',
    };
    if (compact) {
      options.notation = 'compact';
      options.maximumFractionDigits = 2;
    } else {
      options.minimumFractionDigits = 2;
      options.maximumFractionDigits = value < 1 ? 6 : 2;
    }
    return new Intl.NumberFormat('en-US', options).format(value);
  };
  
  const indicatorRawData = marketData ? {
    marketCapScore: {
      "Kapitalisasi Pasar Saat Ini": formatCurrency(marketData.totalMarketCap),
      "Kapitalisasi Puncak": formatCurrency(marketData.maxHistoricalMarketCap),
    },
    volumeScore: {
      "Volume Saat Ini": formatCurrency(marketData.totalVolume24h),
      "Rata-rata Volume 30h": formatCurrency(marketData.avg30DayVolume),
    },
    fearGreedScore: {
      "Nilai Indeks": marketData.fearAndGreedIndex,
    },
    athScore: {
      "Rata-rata % Jarak dari ATH": `${(100 - (analysisResult?.components.athScore ?? 0)).toFixed(2)}%`,
    },
    marketBreadthScore: {
      "Token Naik": marketData.topCoins.filter((c: any) => (c.price_change_percentage_24h || 0) > 0).length,
      "Total Koin Teratas": marketData.topCoins.length,
    },
  } : null;

  const weights = {
      marketCapScore: 0.25,
      volumeScore: 0.20,
      fearGreedScore: 0.20,
      athScore: 0.25,
      marketBreadthScore: 0.10,
  };


  return (
    <div className="container mx-auto px-4 py-3 md:py-4">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Indikator & Formula Pasar</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mb-12">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-primary/10 text-primary p-2 rounded-lg">
            <Calculator className="h-8 w-8" />
          </div>
          <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight">
            Indikator & Formula Pasar
          </h1>
        </div>
        <p className="text-xl text-muted-foreground mt-2">
          Rincian mendalam tentang komponen yang digunakan untuk menghitung Skor Sentimen Makro.
        </p>
      </header>

      <div className="space-y-12">
        {marketData ? (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Data Mentah (Input Langsung)</CardTitle>
              </div>
              <CardDescription>Nilai-nilai aktual yang dimasukkan ke dalam rumus di bawah ini.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 text-sm">
                <li className="flex justify-between items-baseline border-b pb-2">
                  <span className="text-muted-foreground">Total Kapitalisasi Pasar</span>
                  <span className="font-mono font-semibold">{formatCurrency(marketData.totalMarketCap)}</span>
                </li>
                <li className="flex justify-between items-baseline border-b pb-2">
                  <span className="text-muted-foreground pl-4">↳ Kap. Pasar BTC</span>
                  <span className="font-mono font-semibold">{formatCurrency(marketData.btcMarketCap)}</span>
                </li>
                <li className="flex justify-between items-baseline border-b pb-2">
                  <span className="text-muted-foreground pl-4">↳ Kap. Pasar ETH</span>
                  <span className="font-mono font-semibold">{formatCurrency(marketData.ethMarketCap)}</span>
                </li>
                <li className="flex justify-between items-baseline border-b pb-2">
                  <span className="text-muted-foreground pl-4">↳ Kap. Pasar SOL</span>
                  <span className="font-mono font-semibold">{formatCurrency(marketData.solMarketCap)}</span>
                </li>
                <li className="flex justify-between items-baseline border-b pb-2">
                  <span className="text-muted-foreground pl-4">↳ Kap. Pasar Stablecoin</span>
                  <span className="font-mono font-semibold">{formatCurrency(marketData.stablecoinMarketCap)}</span>
                </li>
                <li className="flex justify-between items-baseline border-b pb-2">
                  <span className="text-muted-foreground">Volume 24j</span>
                  <span className="font-mono font-semibold">{formatCurrency(marketData.totalVolume24h)}</span>
                </li>
                <li className="flex justify-between items-baseline border-b pb-2">
                  <span className="text-muted-foreground">Indeks Fear & Greed</span>
                  <span className="font-mono font-semibold">{marketData.fearAndGreedIndex}</span>
                </li>
                <li className="flex justify-between items-baseline border-b pb-2">
                  <span className="text-muted-foreground">Dominasi BTC</span>
                  <span className="font-mono font-semibold">{marketData.btcDominance.toFixed(2)}%</span>
                </li>
                <li className="flex justify-between items-baseline border-b pb-2">
                  <span className="text-muted-foreground">Kap. Historis Maks ({marketData.maxHistoricalMarketCapDate})</span>
                  <span className="font-mono font-semibold">{formatCurrency(marketData.maxHistoricalMarketCap)}</span>
                </li>
              </ul>
              <div>
                <h4 className="text-base font-semibold text-foreground mb-2">Rincian Analisis Koin Teratas ({marketData.topCoinsForAnalysis.length})</h4>
                <div className="overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Koin</TableHead>
                        <TableHead className="text-right">Harga Saat Ini</TableHead>
                        <TableHead className="text-right">ATH</TableHead>
                        <TableHead className="text-right">% Dari ATH</TableHead>
                        <TableHead className="text-right">Perubahan 24j</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {marketData.topCoinsForAnalysis.map((coin: any) => (
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
              <CardTitle className="text-destructive">Tidak Dapat Mengambil Data Langsung</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive/80">Input data mentah tidak dapat dimuat. Contoh di bawah ini akan menggunakan nilai placeholder.</p>
            </CardContent>
          </Card>
        )}


        <div className="space-y-6">
          <h2 className="text-3xl font-headline font-semibold">Rincian Indikator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {indicators.map((indicator, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader className="flex-grow">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-headline">{indicator.name}</CardTitle>
                    <Badge variant="secondary">Bobot: {indicator.weight}</Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{indicator.purpose}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-lg font-bold text-primary">
                    {analysisResult?.components ? (
                      <>
                        {analysisResult.components[indicator.id as keyof typeof analysisResult.components]} <span className="text-sm text-muted-foreground">/ 100</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </div>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Info className="h-4 w-4" /> Detail
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full md:w-1/2 lg:w-1/3 overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>{indicator.name}</SheetTitle>
                        <SheetDescription>
                          {indicator.purpose}
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-6 space-y-6">
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wider">Rumus</h4>
                          <p className="font-mono text-xs bg-muted p-3 rounded-md">{indicator.formula}</p>
                        </div>
                        {indicatorRawData && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wider">Input Data</h4>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm bg-muted p-3 rounded-md">
                              {Object.entries(indicatorRawData[indicator.id as keyof typeof indicatorRawData] || {}).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-baseline border-b border-border/50 pb-1">
                                  <span>{key}</span>
                                  <span className="font-mono font-medium">{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {analysisResult?.components && (
                          <div className="flex items-center justify-between bg-primary/10 p-3 rounded-md">
                            <h4 className="font-semibold text-sm text-primary uppercase tracking-wider">Skor Dihitung</h4>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xl text-primary">{analysisResult.components[indicator.id as keyof typeof analysisResult.components]}</span>
                              <span className="text-sm text-primary/80">/ 100</span>
                            </div>
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wider">Interpretasi</h4>
                          <p className="text-muted-foreground text-sm">{indicator.interpretation}</p>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl font-headline">Perhitungan Skor Akhir (M)</CardTitle>
              </div>
              <CardDescription>Skor makro akhir adalah rata-rata tertimbang dari kelima skor indikator, yang mencerminkan kepentingan relatifnya dalam analisis pasar secara keseluruhan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-1 text-muted-foreground uppercase tracking-wider">Rumus</h4>
                  <p className="font-mono text-xs bg-background p-3 rounded-md">M = (S₁ × 0.25) + (S₂ × 0.20) + (S₃ × 0.20) + (S₄ × 0.25) + (S₅ × 0.10)</p>
                </div>
                {analysisResult && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wider">Hasil</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm font-mono p-3 bg-background rounded-md">
                      {Object.entries(analysisResult.components).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span>({(key as string).replace('Score', ' S')}: {value} × {weights[key as keyof typeof weights]})</span>
                          <span>= {(value * weights[key as keyof typeof weights]).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between bg-primary/10 p-3 rounded-md mt-2">
                      <h4 className="font-semibold text-sm text-primary uppercase tracking-wider">Skor Akhir</h4>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xl text-primary">{analysisResult.macroScore}</span>
                        <span className="text-sm text-primary/80">/ 100</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default async function MarketIndicatorsPage() {
  const marketData = await fetchMarketData();
  const analysisResult = marketData ? analyzeMarketData(marketData) : null;

  return <MarketIndicatorsClient marketData={marketData} analysisResult={analysisResult} />;
}
