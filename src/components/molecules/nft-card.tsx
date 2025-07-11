
'use client';

import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs/lib/anime.es.js';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Logo } from '../atoms/logo';

export function NftCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (cardRef.current) {
      anime({
        targets: cardRef.current,
        opacity: [0, 1],
        translateY: [50, 0],
        rotateX: [-15, 0],
        duration: 1200,
        easing: 'easeOutExpo',
        delay: 600,
      });
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !glowRef.current) return;

    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    // For the parallax tilt effect
    const rotateX = (y / height - 0.5) * -20; // Max rotation 10 degrees
    const rotateY = (x / width - 0.5) * 20;  // Max rotation 10 degrees

    // For the moving glow effect
    const glowX = (x / width) * 100;
    const glowY = (y / height) * 100;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    glowRef.current.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, oklch(var(--primary-values) / 0.15), transparent 40%)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }
    if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(circle at 50% 50%, oklch(var(--primary-values) / 0), transparent 40%)`;
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
          "group relative w-full max-w-xs cursor-pointer transition-transform duration-300 ease-out",
          isMounted ? 'opacity-100' : 'opacity-0'
      )}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      <Card className="relative overflow-hidden rounded-xl bg-background/80 backdrop-blur-sm transition-shadow duration-300 group-hover:shadow-2xl">
        <CardContent className="p-4">
          <div className="aspect-[4/5] relative w-full overflow-hidden rounded-lg" style={{ transform: 'translateZ(20px)' }}>
            <Image
              src="https://placehold.co/600x600.png"
              alt="CryptoPulse Genesis NFT"
              fill
              className="object-cover"
              data-ai-hint="futuristic cyberpunk animal"
              priority
            />
             <div ref={glowRef} className="pointer-events-none absolute inset-0 transition-all duration-300 ease-out" />
          </div>
          <div className="mt-4 flex items-start justify-between" style={{ transform: 'translateZ(50px)' }}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Fud Court
              </p>
              <h3 className="text-lg font-bold font-headline text-foreground">
                Genesis #001
              </h3>
            </div>
            <div className="shrink-0">
              <Logo className="h-10 w-10" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
