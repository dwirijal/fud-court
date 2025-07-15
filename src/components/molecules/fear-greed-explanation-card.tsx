'use client';

import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface FearGreedExplanationCardProps {
  fearAndGreedIndex: number | string;
  fearAndGreedClassification: string;
}

export function FearGreedExplanationCard({
  fearAndGreedIndex,
  fearAndGreedClassification,
}: FearGreedExplanationCardProps) {
  return (
    <>
      <p className="text-muted-foreground mb-4">
        Skor berbasis data sosial, volatilitas, dan volume—mewakili suasana hati pasar. Skor saat ini adalah <code>{fearAndGreedIndex}</code>, diklasifikasikan sebagai <strong>{fearAndGreedClassification}</strong>.
      </p>
      <p className="text-muted-foreground">
        Skor &lt; 40 = Ketakutan. Skor &gt; 60 = Keserakahan. Indikator sentimen yang berguna untuk menghindari beli di puncak atau jual di dasar.
      </p>
    </>
  );
}