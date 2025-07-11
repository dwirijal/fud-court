
'use client';

import React, { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

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
    <section className="relative flex items-center justify-center py-24 text-center md:py-48 overflow-hidden">
      <div className="container relative z-10 mx-auto px-4">
        <AnimatedText
          text="Clarity in Chaos."
          className="text-5xl md:text-7xl font-extrabold font-headline tracking-tighter mb-6 [&_.letter]:inline-block"
        />
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          Fud Court cuts through the market noise with data-driven analysis and unbiased news, empowering you to make smarter crypto investment decisions.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="https://discord.gg" target="_blank" rel="noopener noreferrer">Join Community</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
             <Link href="/news">Read Latest News</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
