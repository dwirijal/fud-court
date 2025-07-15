'use client';

import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";

interface MarketCapExplanationCardProps {
  totalMarketCap: number;
  maxHistoricalMarketCap: number;
  maxHistoricalMarketCapDate: string;
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

export function MarketCapExplanationCard({
  totalMarketCap,
  maxHistoricalMarketCap,
  maxHistoricalMarketCapDate,
}: MarketCapExplanationCardProps) {
  const marketCapScore = (totalMarketCap / maxHistoricalMarketCap) * 100;

  return (
    <>
      <p className="text-muted-foreground mb-4">
        Membandingkan kapitalisasi pasar total saat ini (<code>{formatCurrency(totalMarketCap)}</code>) dengan level tertinggi sepanjang masa (ATH) (<code>{formatCurrency(maxHistoricalMarketCap)}</code> pada {format(new Date(maxHistoricalMarketCapDate), 'dd MMM yyyy')}).
      </p>
      <p className="text-muted-foreground mb-4">
        <strong>Bagaimana Dihitung:</strong> <code>(Kapitalisasi Pasar Saat Ini / Kapitalisasi Pasar ATH) * 100</code>. Hasilnya adalah persentase seberapa dekat pasar saat ini dengan puncaknya.
      </p>
      <p className="text-muted-foreground">
        Skor tinggi menandakan pasar mendekati puncaknya; skor rendah menunjukkan potensi ruang tumbuh.
      </p>
    </>
  );
}