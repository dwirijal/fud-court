'use client';

import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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
    <>
      <p className="text-muted-foreground mb-4">
        Menilai kekuatan aktivitas trading berdasarkan perbandingan volume harian (<code>{formatCurrency(totalVolume24h)}</code>) dengan rata-rata historis (misalnya, rata-rata 30 hari: <code>{formatCurrency(avg30DayVolume)}</code>).
      </p>
      <p className="text-muted-foreground mb-4">
        <strong>Bagaimana Dihitung:</strong> <code>(Volume Harian / Rata-rata Volume Historis) * 100</code>. Skor di atas 100% menunjukkan volume di atas rata-rata, dan sebaliknya.
      </p>
      <p className="text-muted-foreground">
        Skor di atas 100 menandakan lonjakan volume, sinyal kuat untuk pergerakan harga.
      </p>
    </>
  );
}