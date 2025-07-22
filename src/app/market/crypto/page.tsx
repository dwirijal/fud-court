'use client';

import Spline from '@splinetool/react-spline/next';

export default function CryptoPage() {
  return (
    <div className="relative h-[500px] w-full">
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white p-4 bg-black/50">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
          Pasar Kripto
        </h1>
        <p className="max-w-[600px] text-primary-foreground/80 md:text-xl mt-4">
          Analisis mendalam, harga real-time, dan data untuk dunia cryptocurrency.
        </p>
      </div>
      <Spline
        scene="https://prod.spline.design/qg4N3F3QjVzZ-k2N/scene.splinecode"
        className="absolute inset-0"
      />
    </div>
  );
}
