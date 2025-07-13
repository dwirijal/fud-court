'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ATHExplanationCardProps {
  topCoinsForAnalysis: Array<{ name: string; current_price: number; ath: number; }>;
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

export function ATHExplanationCard({
  topCoinsForAnalysis,
}: ATHExplanationCardProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Skor ATH (All-Time High)</CardTitle>
        <CardDescription>Mengukur seberapa jauh aset utama dari Harga Tertinggi Sepanjang Masa (ATH).</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Skor ATH mengevaluasi seberapa dekat aset kripto utama dengan harga tertinggi sepanjang masa mereka. Ini memberikan gambaran tentang potensi pemulihan atau seberapa jenuh pasar saat ini.
        </p>
        <p className="text-muted-foreground mb-4">
          <strong>Bagaimana Dihitung:</strong> Untuk setiap aset, dihitung <code>(Harga Saat Ini / ATH) * 100</code>. Skor keseluruhan adalah rata-rata dari aset-aset utama (misalnya, Bitcoin dan Ethereum).
        </p>
        <p className="text-muted-foreground mb-4">
          <strong>Contoh Aset Utama:</strong>
          <ul className="list-disc list-inside ml-4">
            {topCoinsForAnalysis.slice(0, 2).map((coin) => (
              <li key={coin.name} className="text-muted-foreground">
                {coin.name}: Harga Saat Ini {formatCurrency(coin.current_price)}, ATH {formatCurrency(coin.ath)} ({((coin.current_price / coin.ath) * 100).toFixed(2)}% dari ATH)
              </li>
            ))}
          </ul>
        </p>
        <p className="text-muted-foreground">
          <strong>Mengapa Penting:</strong> Skor yang lebih tinggi menunjukkan bahwa aset-aset ini mendekati atau telah mencapai ATH, menandakan kekuatan pasar. Skor yang lebih rendah menunjukkan bahwa aset-aset tersebut jauh dari ATH, yang bisa menjadi tanda pasar bearish atau peluang pemulihan.
        </p>
      </CardContent>
    </Card>
  );
}
