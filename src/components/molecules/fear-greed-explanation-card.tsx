'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface FearGreedExplanationCardProps {
  fearAndGreedIndex: number | string;
  fearAndGreedClassification: string;
}

export function FearGreedExplanationCard({
  fearAndGreedIndex,
  fearAndGreedClassification,
}: FearGreedExplanationCardProps) {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Skor Fear & Greed</CardTitle>
        <CardDescription>Mewakili sentimen emosional pasar.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Indeks Fear & Greed mengukur sentimen emosional investor di pasar kripto. Skor saat ini adalah <code>{fearAndGreedIndex}</code>, diklasifikasikan sebagai <strong>{fearAndGreedClassification}</strong>.
        </p>
        <p className="text-muted-foreground mb-4">
          <strong>Bagaimana Dihitung:</strong> Dihitung berdasarkan beberapa faktor, termasuk volatilitas, momentum/volume pasar, dominasi media sosial, survei, dan tren Google. Skala 0-100, di mana 0 adalah Ketakutan Ekstrem dan 100 adalah Keserakahan Ekstrem.
        </p>
        <p className="text-muted-foreground">
          <strong>Mengapa Penting:</strong> Dapat membantu investor memahami apakah pasar didorong oleh emosi. Skor mendekati 0 (Ketakutan Ekstrem) menunjukkan bahwa investor terlalu takut, yang bisa menjadi peluang beli. Skor mendekati 100 (Keserakahan Ekstrem) menunjukkan euforia, yang bisa menjadi tanda koreksi yang akan datang. Ini adalah indikator kontrarian yang kuat.
        </p>
      </CardContent>
    </Card>
  );
}
