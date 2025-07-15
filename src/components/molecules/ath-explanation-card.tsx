'use client';

import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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
    <>
      <p className="text-muted-foreground mb-4">
        Skor menunjukkan seberapa dekat harga aset top (seperti BTC & ETH) dari rekor tertinggi mereka.
      </p>
      <p className="text-muted-foreground mb-4">
        <strong>Bagaimana Dihitung:</strong> Untuk setiap aset, dihitung <code>(Harga Saat Ini / ATH) * 100</code>. Skor keseluruhan adalah rata-rata dari aset-aset utama (misalnya, Bitcoin dan Ethereum).
      </p>
      <p className="text-muted-foreground mb-4">
        <strong>Contoh Aset Utama:</strong>
      </p>
      <ul className="list-disc list-inside ml-4 mb-4">
        {topCoinsForAnalysis.slice(0, 2).map((coin) => (
          <li key={coin.name} className="text-muted-foreground">
            {coin.name}: Harga Saat Ini {formatCurrency(coin.current_price)}, ATH {formatCurrency(coin.ath)} ({((coin.current_price / coin.ath) * 100).toFixed(2)}% dari ATH)
          </li>
        ))}
      </ul>
      <p className="text-muted-foreground">
        Skor rendah = potensi upside besar. Skor tinggi = dekat zona jenuh.
      </p>
    </>
  );
}