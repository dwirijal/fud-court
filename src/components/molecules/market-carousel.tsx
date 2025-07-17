"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import type { CryptoData } from "@/types";
import { CryptoCard } from "@/components/molecules/crypto-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface MarketCarouselProps {
  data: CryptoData[];
}

export function MarketCarousel({ data }: MarketCarouselProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-sm sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto"
    >
      <CarouselContent className="-ml-4">
        {data.map((crypto) => (
          <CarouselItem
            key={crypto.id}
            className="pl-4 basis-[60%] sm:basis-1/3 md:basis-1/4 lg:basis-1/4 xl:basis-1/5"
          >
            <div className="p-1 h-full">
              <CryptoCard data={crypto} className="h-full" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
