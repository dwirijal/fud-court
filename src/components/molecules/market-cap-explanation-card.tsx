'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Skor Kapitalisasi Pasar</CardTitle>
        <CardDescription>Mengukur valuasi pasar saat ini terhadap puncak historisnya.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Skor ini membandingkan kapitalisasi pasar total saat ini (<code>{formatCurrency(totalMarketCap)}</code>) dengan kapitalisasi pasar tertinggi sepanjang masa (ATH) (<code>{formatCurrency(maxHistoricalMarketCap)}</code> pada {format(new Date(maxHistoricalMarketCapDate), 'dd MMM yyyy')}).
        </p>
        <p className="text-muted-foreground mb-4">
          <strong>Bagaimana Dihitung:</strong> <code>(Kapitalisasi Pasar Saat Ini / Kapitalisasi Pasar ATH) * 100</code>. Hasilnya adalah persentase seberapa dekat pasar saat ini dengan puncaknya.
        </p>
        <p className="text-muted-foreground">
          <strong>Mengapa Penting:</strong> Skor yang lebih tinggi menunjukkan bahwa pasar mendekati atau melampaui puncaknya, sementara skor yang lebih rendah menunjukkan potensi pertumbuhan. Ini membantu menilai apakah pasar sedang dalam fase ekspansi atau konsolidasi. Skor rendah bisa menjadi sinyal beli, sedangkan skor tinggi bisa menjadi sinyal hati-hati.
        </p>
      </CardContent>
    </Card>
  );
}
