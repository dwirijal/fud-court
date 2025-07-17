
'use client';

import { useRef, useEffect } from 'react';
import anime from 'animejs';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { type LucideIcon } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { AnimatedNumber } from './animated-number';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface IndicatorCardProps {
  detail: {
    name: string;
    valueKey: string;
    summary: string;
    icon: LucideIcon;
  };
  value: number;
}

export function IndicatorCard({ detail, value }: IndicatorCardProps) {
  const Icon = detail.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/learn/market-indicators#${detail.valueKey}`} className="group block h-full">
            <Card className="flex flex-col h-full hover:bg-muted/50 transition-colors aspect-square justify-between p-4">
              <div className="flex items-center justify-between">
                <div className="bg-muted p-1.5 rounded-full w-fit">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="w-full text-left space-y-2">
                <p className="text-xs font-medium text-muted-foreground">{detail.name}</p>
                <AnimatedNumber to={value} className="text-5xl font-bold tracking-tighter" />
                <Progress value={value} className="h-1.5 w-full mt-1" />
              </div>
            </Card>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>{detail.summary}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
