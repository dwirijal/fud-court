
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

const LineAnimation = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;

        const handleResize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        const particles: {x: number, y: number, tx: number, ty: number, color: string, speed: number, direction: number, size: number}[] = [];
        const particleCount = 30;
        const colors = ['hsl(var(--primary)/0.5)', 'hsl(var(--accent)/0.5)', 'hsl(var(--foreground)/0.2)'];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                tx: Math.random() * w,
                ty: Math.random() * h,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: Math.random() * 0.5 + 0.1,
                direction: Math.random() * Math.PI * 2,
                size: Math.random() * 2 + 1,
            });
        }

        const updateParticle = (p: typeof particles[0]) => {
            p.x += Math.cos(p.direction) * p.speed;
            p.y += Math.sin(p.direction) * p.speed;

            if (p.x < 0 || p.x > w) p.direction = Math.PI - p.direction;
            if (p.y < 0 || p.y > h) p.direction = -p.direction;
            
            return p;
        }

        const draw = () => {
            const isDark = document.documentElement.classList.contains('dark');
            ctx.fillStyle = isDark ? 'rgba(19, 15, 18, 0.1)' : 'rgba(255, 252, 253, 0.1)';
            ctx.fillRect(0, 0, w, h);
            
            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach(p2 => {
                    const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                    if (dist < 200) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = p1.color;
                        ctx.globalAlpha = 1 - (dist / 200);
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });

            ctx.globalAlpha = 1.0;
            particles.forEach(p => {
                updateParticle(p);
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            });
        };

        const animate = () => {
            draw();
            animationFrameId.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 -z-10 w-full h-full" />;
}


export function HeroSection() {
  return (
    <section className="relative flex items-center justify-center min-h-screen overflow-hidden">
      <LineAnimation />
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center items-center">
            <NftCard />
          </div>
          <div className="text-center md:text-left">
            <AnimatedText
              text="Clarity in Chaos."
              className="text-5xl md:text-7xl font-extrabold font-headline tracking-tighter mb-6 [&_.letter]:inline-block"
            />
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0 mb-10">
              Fud Court cuts through the market noise with data-driven analysis and unbiased news, empowering you to make smarter crypto investment decisions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <Button size="lg" asChild>
                <Link href="https://discord.gg" target="_blank" rel="noopener noreferrer">Join Community</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                 <Link href="/news">Read Latest News</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
