
'use client';

import React, { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Logo } from '../atoms/logo';

export function NftCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current && imageRef.current && textContainerRef.current && logoRef.current) {
      const timeline = anime.timeline({
        easing: 'easeOutExpo',
        duration: 1200,
      });

      timeline
        .add({
          targets: cardRef.current,
          opacity: [0, 1],
          translateY: [50, 0],
          rotateX: [-20, 0],
          duration: 1000,
        }, '+=800') // Delay to start after text animation
        .add({
          targets: imageRef.current,
          opacity: [0, 1],
          scale: [0.9, 1],
        }, '-=800')
        .add({
          targets: [textContainerRef.current, logoRef.current],
          opacity: [0, 1],
          translateY: [20, 0],
          delay: anime.stagger(100),
        }, '-=800');
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className="group relative w-full max-w-sm cursor-pointer opacity-0"
    >
      <div
        className={cn(
          'absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary via-accent to-chart-2 opacity-50 blur transition duration-500 group-hover:opacity-75 group-hover:duration-200 animate-pulse-gradient bg-[length:200%_200%]'
        )}
      />
      <Card className="relative overflow-hidden rounded-xl bg-background/80 backdrop-blur-sm transition-transform duration-300 ease-in-out group-hover:scale-105">
        <CardContent className="p-4">
          <div ref={imageRef} className="aspect-[4/5] relative w-full overflow-hidden rounded-lg opacity-0">
            <Image
              src="https://placehold.co/600x600.png"
              alt="CryptoPulse Genesis NFT"
              fill
              className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
              data-ai-hint="futuristic cyberpunk animal"
            />
          </div>
          <div className="mt-4 flex items-start justify-between">
            <div ref={textContainerRef} className="opacity-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                CryptoPulse
              </p>
              <h3 className="text-lg font-bold font-headline text-foreground">
                Genesis #001
              </h3>
            </div>
            <div ref={logoRef} className="opacity-0">
              <Logo className="h-10 w-10 shrink-0" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
