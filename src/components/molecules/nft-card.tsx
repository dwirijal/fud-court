
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Logo } from '../atoms/logo';

export function NftCard() {
  return (
    <div className="group relative w-full max-w-sm cursor-pointer">
      <div
        className={cn(
          'absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary via-accent to-chart-2 opacity-50 blur transition duration-500 group-hover:opacity-75 group-hover:duration-200'
        )}
      />
      <Card className="relative overflow-hidden rounded-xl bg-background/80 backdrop-blur-sm transition-transform duration-300 ease-in-out group-hover:scale-105">
        <CardContent className="p-4">
          <div className="aspect-square relative w-full overflow-hidden rounded-lg">
            <Image
              src="https://placehold.co/600x600.png"
              alt="CryptoPulse Genesis NFT"
              fill
              className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
              data-ai-hint="futuristic cyberpunk animal"
            />
          </div>
          <div className="mt-4 flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                CryptoPulse
              </p>
              <h3 className="text-lg font-bold font-headline text-foreground">
                Genesis #001
              </h3>
            </div>
            <Logo className="h-10 w-10 shrink-0" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
