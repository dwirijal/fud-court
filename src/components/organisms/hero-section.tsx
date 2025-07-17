
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
                    backgroundImage: 'linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)',
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
    <section className="relative flex items-center justify-center min-h-screen overflow-hidden pt-20 md:pt-0">
      <GridPatternAnimation />
      <div className="container-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="flex justify-center items-center mt-8 lg:mt-0">
            <NftCard />
          </div>
          <div className="text-center lg:text-left">
            <AnimatedText
              text="Kejelasan di Tengah Kekacauan."
              className="headline-1 mb-6 [&_.letter]:inline-block"
            />
            <p className="body-large text-text-secondary max-w-xl mx-auto lg:mx-0 mb-10">
              Fud Court membelah kebisingan pasar dengan analisis berbasis data dan berita yang tidak bias, memberdayakan Anda untuk membuat keputusan investasi kripto yang lebih cerdas.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8 lg:mb-0">
              <Button size="lg" asChild>
                <Link href="/markets">Jelajahi Pasar</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                 <Link href="/news">Baca Berita</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
