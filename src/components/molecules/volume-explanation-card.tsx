'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface VolumeExplanationCardProps {
  totalVolume24h: number;
  avg30DayVolume: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    compactDisplay: 'short',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export function VolumeExplanationCard({
  totalVolume24h,
  avg30DayVolume,
}: VolumeExplanationCardProps) {
  const volumeScore = (totalVolume24h / avg30DayVolume) * 100; // Simplified calculation for explanation

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Skor Volume</CardTitle>
        <CardDescription>Mengukur aktivitas pasar berdasarkan volume harian vs. rata-rata.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Skor volume menilai kesehatan pasar berdasarkan volume perdagangan harian (<code>{formatCurrency(totalVolume24h)}</code>) dibandingkan dengan rata-rata historis (misalnya, rata-rata 30 hari: <code>{formatCurrency(avg30DayVolume)}</code>).
        </p>
        <p className="text-muted-foreground mb-4">
          <strong>Bagaimana Dihitung:</strong> <code>(Volume Harian / Rata-rata Volume Historis) * 100</code>. Skor di atas 100% menunjukkan volume di atas rata-rata, dan sebaliknya.
        </p>
        <p className="text-muted-foreground">
          <strong>Mengapa Penting:</strong> Volume yang tinggi seringkali mengkonfirmasi tren harga, baik naik maupun turun. Volume yang rendah dalam tren naik bisa menjadi tanda kelemahan, sedangkan volume tinggi dalam tren turun bisa menunjukkan capitulasi atau dasar pasar. Ini membantu mengkonfirmasi validitas pergerakan harga.
        </p>
      </CardContent>
    </Card>
  );
}
