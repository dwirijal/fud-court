"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import type { CryptoData } from "@/types";
import { CryptoCard } from "@/components/molecules/crypto-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface MarketCarouselProps {
  data: CryptoData[];
}

export function MarketCarousel({ data }: MarketCarouselProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-sm sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="-ml-4">
        {data.map((crypto) => (
          <CarouselItem
            key={crypto.id}
            className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
          >
            <div className="p-1 h-full">
              <CryptoCard data={crypto} className="h-full" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden lg:flex" />
      <CarouselNext className="hidden lg:flex" />
    </Carousel>
  );
}
