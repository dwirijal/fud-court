'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Skor Sebaran Pasar</CardTitle>
        <CardDescription>Mengukur apakah pergerakan didukung oleh banyak aset atau hanya beberapa.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Skor Market Breadth menilai seberapa luas partisipasi pasar dalam pergerakan harga. Jika banyak aset bergerak sejalan dengan pasar secara keseluruhan, breadth-nya tinggi, menunjukkan tren yang sehat. Jika hanya beberapa aset yang mendorong pasar, breadth-nya rendah, yang bisa menjadi tanda kelemahan tersembunsi atau potensi pembalikan.
        </p>
        <p className="text-muted-foreground mb-4">
          <strong>Bagaimana Dihitung:</strong> Dihitung berdasarkan persentase aset dalam daftar teratas yang mengalami kenaikan harga dalam periode tertentu (misalnya, 24 jam). Contoh: <code>({positiveChangeCoins} dari {totalCoins} koin teratas mengalami kenaikan dalam 24 jam terakhir, menghasilkan skor {breadthScore.toFixed(2)}%)</code>.
        </p>
        <p className="text-muted-foreground">
          <strong>Mengapa Penting:</strong> Jika banyak aset bergerak sejalan dengan pasar secara keseluruhan, breadth-nya tinggi, menunjukkan tren yang sehat. Jika hanya beberapa aset yang mendorong pasar, breadth-nya rendah, yang bisa menjadi tanda kelemahan tersembunyi atau potensi pembalikan.
        </p>
      </CardContent>
    </Card>
  );
}
