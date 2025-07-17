
'use client'

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import type { Post } from "@/types";
import Autoplay from "embla-carousel-autoplay";

interface ArticleHeroSliderProps {
  posts: Post[];
}

export function ArticleHeroSlider({ posts }: ArticleHeroSliderProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  if (!posts || posts.length === 0) return null;

  return (
    <section className="mb-12">
      <Carousel 
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-4">
          {posts.map((post) => (
            <CarouselItem
              key={post.id}
              className="pl-4 md:basis-1/2 lg:basis-1/3"
            >
              <Link href={`/news/${post.slug}`} className="group block h-full">
                <div className="relative h-80 rounded-4 overflow-hidden shadow-lg transition-all duration-normal group-hover:scale-[1.02] group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background">
                  {post.feature_image && (
                    <Image
                      src={post.feature_image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-slow group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={posts.indexOf(post) < 3}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5">
                    {post.primary_tag && (
                      <Badge variant="secondary" className="mb-2 w-fit">
                        {post.primary_tag.name}
                      </Badge>
                    )}
                    <h2 className="headline-5 text-white mb-2 drop-shadow-lg line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="body-small text-white/80 line-clamp-2 drop-shadow">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 hidden sm:flex" />
        <CarouselNext className="right-2 hidden sm:flex"/>
      </Carousel>
    </section>
  );
}
