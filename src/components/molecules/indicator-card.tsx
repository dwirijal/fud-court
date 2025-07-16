
'use client';

import { useRef, useEffect } from 'react';
import anime from 'animejs';
import { Card, CardContent } from '@/components/ui/card';
import { type LucideIcon } from 'lucide-react';

interface IndicatorCardProps {
    index: number;
    icon: LucideIcon;
    name: string;
    score: number;
    formula: string;
    rawData: Record<string, string | number>;
}

export function IndicatorCard({ index, icon: Icon, name, score, formula, rawData }: IndicatorCardProps) {
  const cardRef = useRef(null);
  const scoreContainerRef = useRef(null);
  const detailsContainerRef = useRef(null);
  const animation = useRef<anime.AnimeInstance | null>(null);

  useEffect(() => {
    animation.current = anime.timeline({
      easing: 'easeOutExpo',
      duration: 400,
      autoplay: false,
    });

    animation.current
      .add({
        targets: scoreContainerRef.current,
        translateY: -10,
        opacity: 0,
      })
      .add({
        targets: detailsContainerRef.current,
        translateY: [10, 0],
        opacity: [0, 1],
      }, '-=300');

  }, []);

  const handleMouseEnter = () => animation.current?.play();
  const handleMouseLeave = () => animation.current?.reverse();
  
  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden rounded-lg border bg-secondary p-4 cursor-pointer group h-24"
    >
      <div ref={scoreContainerRef} className="absolute inset-4 flex flex-col justify-between h-[calc(100%-2rem)]">
        <div className="flex items-center justify-between text-sm font-semibold text-muted-foreground">
          <span>{name}</span>
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-2xl font-bold font-mono text-foreground">{score}</p>
      </div>

      <div ref={detailsContainerRef} className="absolute inset-4 flex flex-col justify-center items-center opacity-0 h-[calc(100%-2rem)]">
        <div className="text-xs w-full space-y-1">
          {Object.entries(rawData).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-muted-foreground truncate" title={key}>{key}</span>
              <span className="font-mono text-foreground">{value}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-primary/80 font-mono mt-auto pt-1">{formula}</p>
      </div>
    </div>
  );
}
