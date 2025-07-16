
'use client';

import React, { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { NftCard } from '../molecules/nft-card';

const AnimatedText = ({ text, className }: { text: string; className?: string }) => {
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const textWrapper = textRef.current;
      textWrapper.innerHTML = text.replace(
        /([^\x00-\x80]|\w|\.)/g,
        "<span class='letter'>$&</span>"
      );

      anime.timeline({ loop: false })
        .add({
          targets: '.hero-title .letter',
          translateY: [100, 0],
          translateZ: 0,
          opacity: [0, 1],
          easing: "easeOutExpo",
          duration: 1400,
          delay: (el, i) => 300 + 30 * i
        });
    }
  }, [text]);

  return (
    <h1 ref={textRef} className={cn('hero-title', className)}>
      {text}
    </h1>
  );
};

const GridPatternAnimation = () => {
    return (
        <div className="absolute inset-0 -z-10 h-full w-full">
            <div 
                className="absolute inset-0 h-full w-full"
                style={{
                    backgroundImage: 'linear-gradient(to right, hsl(var(--border-color)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border-color)) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, hsl(var(--bg-primary)) 70%, transparent 100%)',
                }}
            />
            <div
                className="absolute inset-0 bg-gradient-to-b from-transparent to-background"
            />
        </div>
    )
}

export function HeroSection() {
  return (
    <section className="relative flex items-center justify-center min-h-screen overflow-hidden">
      <GridPatternAnimation />
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-2 flex justify-center items-center">
            <NftCard />
          </div>
          <div className="lg:col-span-3 text-center lg:text-left">
            <AnimatedText
              text="Kejelasan di Tengah Kekacauan."
              className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6 [&_.letter]:inline-block text-glow"
            />
            <p className="text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 mb-10">
              Fud Court membelah kebisingan pasar dengan analisis berbasis data dan berita yang tidak bias, memberdayakan Anda untuk membuat keputusan investasi kripto yang lebih cerdas.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button size="lg" asChild>
                <Link href="#" target="_blank" rel="noopener noreferrer">Gabung Komunitas</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                 <Link href="/news">Baca Berita Terbaru</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
