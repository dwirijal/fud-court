'use client';

import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface MarketBreadthExplanationCardProps {
  topCoinsForAnalysis: Array<{ name: string; price_change_percentage_24h: number | null; }>;
}

export function MarketBreadthExplanationCard({
  topCoinsForAnalysis,
}: MarketBreadthExplanationCardProps) {
  const positiveChangeCoins = topCoinsForAnalysis.filter(coin => (coin.price_change_percentage_24h || 0) > 0).length;
  const totalCoins = topCoinsForAnalysis.length;
  const breadthScore = totalCoins > 0 ? (positiveChangeCoins / totalCoins) * 100 : 0;

  return (
    <>
      <p className="text-muted-foreground mb-4">
        Mengukur partisipasi pasar: berapa banyak aset yang naik secara bersamaan. Contoh: <code>({positiveChangeCoins} dari {totalCoins} koin teratas mengalami kenaikan dalam 24 jam terakhir, menghasilkan skor {breadthScore.toFixed(2)}%)</code>.
      </p>
      <p className="text-muted-foreground">
        Skor tinggi = rally sehat dan tersebar. Skor rendah = kekuatan pasar lemah atau terbatas pada beberapa aset saja.
      </p>
    </>
  );
}