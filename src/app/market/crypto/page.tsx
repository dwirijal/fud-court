'use client';

import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function CryptoPage() {
  return (
    <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full z-0">
        <DotLottieReact
          src="https://lottie.host/eeecf4e3-c041-40c8-acb9-3392479f3774/E08q2Hs2dd.lottie"
          loop
          autoplay
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="relative z-20 flex flex-col items-center justify-center text-center text-white p-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
          Pasar Kripto
        </h1>
        <p className="max-w-[600px] text-primary-foreground/80 md:text-xl mt-4">
          Analisis mendalam, harga real-time, dan data untuk dunia cryptocurrency.
        </p>
      </div>
    </section>
  );
}
