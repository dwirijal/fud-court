
'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Logo } from '../atoms/logo';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export function NftCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20, mass: 0.5 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20, mass: 0.5 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['12deg', '-12deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-12deg', '12deg']);
  
  const glowX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const glowY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);
  const glowOpacity = useTransform(mouseYSpring, [-0.5, 0.5], [0.3, 0]);


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        rotateX,
        rotateY,
      }}
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="group relative w-full max-w-xs cursor-pointer"
    >
      <Card className="relative overflow-hidden rounded-xl bg-background/80 backdrop-blur-sm transition-shadow duration-300 group-hover:shadow-2xl">
        <CardContent className="p-4">
          <motion.div
            style={{ transform: 'translateZ(20px)' }}
            className="aspect-[4/5] relative w-full overflow-hidden rounded-lg"
          >
            <Image
              src="https://images.unsplash.com/photo-1719433203940-a9329d15d3e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxGRU5ORUMlMjBGT1h8ZW58MHx8fHwxNzUyNjg3OTA5fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="CryptoPulse Genesis NFT"
              fill
              className="object-cover"
              data-ai-hint="futuristic cyberpunk animal"
              priority
            />
            <motion.div 
              style={{
                background: `radial-gradient(circle at ${glowX.get()} ${glowY.get()}, oklch(var(--primary-values) / ${glowOpacity.get()}), transparent 50%)`,
              }}
              className="pointer-events-none absolute inset-0 transition-opacity duration-500" 
            />
          </motion.div>
          <motion.div 
            style={{ transform: 'translateZ(50px)' }} 
            className="mt-4 flex items-start justify-between"
          >
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
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
