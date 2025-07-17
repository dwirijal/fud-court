
'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Logo } from '../atoms/logo';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

export function NftCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20, mass: 0.5 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20, mass: 0.5 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['12deg', '-12deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-12deg', '12deg']);
  
  const glowX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const glowY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);
  const glowOpacity = useTransform(mouseYSpring, [-0.5, 0, 0.5], [0, 0.3, 0]);


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
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
        rotateX: isMobile ? 0 : rotateX,
        rotateY: isMobile ? 0 : rotateY,
      }}
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="group relative w-full max-w-[300px] sm:max-w-xs"
    >
      <Card className="relative overflow-hidden rounded-4 bg-background/80 backdrop-blur-sm transition-shadow duration-300 group-hover:shadow-2xl">
        <CardContent className="p-4">
          <motion.div
            style={{ transform: 'translateZ(20px)' }}
            className="aspect-[3/4] relative w-full overflow-hidden rounded-3"
          >
            <Image
              src="https://placehold.co/600x600.png"
              alt="Fud Court Genesis NFT"
              fill
              className="object-cover"
              data-ai-hint="futuristic cyberpunk animal"
              priority
            />
            <motion.div 
              style={{
                background: `radial-gradient(circle at ${glowX.get()} ${glowY.get()}, hsl(var(--primary) / ${glowOpacity.get()}), transparent 50%)`,
                opacity: isMobile ? 0 : 1,
              }}
              className="pointer-events-none absolute inset-0 transition-opacity duration-500" 
            />
          </motion.div>
          <motion.div 
            style={{ transform: 'translateZ(50px)' }} 
            className="mt-4 flex items-start justify-between"
          >
            <div>
              <p className="caption-regular uppercase tracking-wider text-text-secondary">
                Fud Court
              </p>
              <h3 className="headline-6 text-text-primary">
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
