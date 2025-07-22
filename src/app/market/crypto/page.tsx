'use client';

import { HeroSection } from '@/components/shared/HeroSection';

export default function CryptoPage() {
  return (
    <>
      <HeroSection
        title="Pasar Kripto"
        description="Analisis mendalam, harga real-time, dan data untuk dunia cryptocurrency."
      />
      <div className="p-4 md:p-6">
        <p>Konten untuk pasar kripto akan ditampilkan di sini.</p>
      </div>
    </>
  );
}
