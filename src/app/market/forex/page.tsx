'use client';

import { HeroSection } from '@/components/shared/HeroSection';

export default function ForexPage() {
  return (
    <>
      <HeroSection
        title="Pasar Forex"
        description="Kurs mata uang asing, analisis teknikal, dan berita pasar global."
      />
      <div className="p-4 md:p-6">
        <p>Konten untuk pasar forex akan ditampilkan di sini.</p>
      </div>
    </>
  );
}
