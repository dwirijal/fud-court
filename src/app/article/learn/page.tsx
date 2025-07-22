'use client';

import { HeroSection } from '@/components/shared/HeroSection';

export default function LearnPage() {
  return (
    <>
      <HeroSection
        title="Pusat Pembelajaran"
        description="Pelajari tentang konsep investasi, analisis pasar, dan strategi keuangan."
      />
      <div className="p-4 md:p-6">
        <p>Konten untuk artikel pembelajaran akan ditampilkan di sini.</p>
      </div>
    </>
  );
}
