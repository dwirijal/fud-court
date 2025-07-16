
'use client';

import { useRef, useEffect } from 'react';
import anime from 'animejs';
import { Card, CardContent } from '@/components/ui/card';
import { type LucideIcon } from 'lucide-react';
import { Separator } from '../ui/separator';

interface IndicatorCardProps {
    index: number;
    icon: LucideIcon;
    name: string;
    score: number;
    formula: string;
    rawData: Record<string, string | number>;
}

export function IndicatorCard({ index, icon: Icon, name, score, formula, rawData }: IndicatorCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    // Set initial states
    anime.set(detailsRef.current, { opacity: 0, translateY: 10 });
    anime.set(scoreRef.current, { opacity: 1, translateY: 0 });

    const animation = anime.timeline({
      easing: 'easeOutExpo',
      duration: 300,
      autoplay: false,
    });

    animation
      .add({
        targets: scoreRef.current,
        opacity: [1, 0],
        translateY: [0, -10],
      })
      .add({
        targets: detailsRef.current,
        opacity: [0, 1],
        translateY: [10, 0],
      }, '-=250');

    const handleMouseEnter = () => animation.play();
    const handleMouseLeave = () => animation.reverse();

    cardElement.addEventListener('mouseenter', handleMouseEnter);
    cardElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cardElement.removeEventListener('mouseenter', handleMouseEnter);
      cardElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <Card ref={cardRef} className="h-full overflow-hidden relative group cursor-pointer">
      <CardContent className="p-4 h-full flex flex-col justify-center">
        {/* Front Side: Visible by default */}
        <div ref={scoreRef} className="absolute inset-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Icon className="h-4 w-4" />
              <span>{name}</span>
          </div>
          <p className="text-3xl font-bold font-mono text-foreground">{score}</p>
        </div>

        {/* Back Side: Hidden by default, revealed on hover */}
        <div ref={detailsRef} className="absolute inset-4 opacity-0 flex flex-col justify-center">
          <div className="text-xs w-full space-y-1">
            {Object.entries(rawData).map(([key, value]) => (
              <div key={key} className="flex justify-between items-baseline">
                <span className="text-muted-foreground truncate" title={key}>{key}</span>
                <span className="font-mono text-foreground font-semibold">{value}</span>
              </div>
            ))}
          </div>
          <Separator className="my-1.5 bg-border/50"/>
          <p className="text-xs text-center font-mono text-primary/80" title={formula}>
              {formula}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
