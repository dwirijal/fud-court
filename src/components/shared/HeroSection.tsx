'use client';

import { cn } from '@/lib/utils/utils';

interface HeroSectionProps {
  title: string;
  description?: string;
  className?: string;
}

export function HeroSection({ title, description, className }: HeroSectionProps) {
  return (
    <section className={cn(
      "relative w-full py-12 md:py-24 lg:py-32 xl:py-48",
      "bg-gradient-to-r from-primary to-accent-primary text-primary-foreground",
      "flex items-center justify-center text-center",
      className
    )}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
            {title}
          </h1>
          {description && (
            <p className="max-w-[600px] text-primary-foreground/80 md:text-xl">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
