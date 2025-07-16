
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

export function HeroSection() {
  return (
    <section className="relative flex items-center justify-center min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="container relative z-10 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          <div className="lg:col-span-2 flex justify-center items-center">
            <NftCard />
          </div>
          <div className="lg:col-span-3 text-center lg:text-left">
            <AnimatedText
              text="Clarity in Chaos."
              className="text-5xl font-extrabold tracking-tighter mb-5 [&_.letter]:inline-block"
            />
            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-6">
              Fud Court cuts through market noise with data-driven analysis and unbiased news, empowering you to make smarter crypto investment decisions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
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
