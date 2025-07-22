'use client';

import { HeroSection } from '@/components/shared/HeroSection';

export default function EconomicNewsPage() {
  return (
    <>
      <HeroSection
        title="Berita Ekonomi"
        description="Berita terbaru yang mempengaruhi pasar keuangan global dan ekonomi."
      />
      <div className="p-4 md:p-6">
        <p>Konten untuk berita ekonomi akan ditampilkan di sini.</p>
      </div>
    </>
  );
}
