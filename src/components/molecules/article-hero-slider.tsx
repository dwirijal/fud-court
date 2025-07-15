import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  feature_image?: string;
  primary_tag?: { name: string };
}

interface ArticleHeroSliderProps {
  posts: Article[];
}

export function ArticleHeroSlider({ posts }: ArticleHeroSliderProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="mb-12">
      <Carousel className="w-full max-w-4xl mx-auto">
        <CarouselContent>
          {posts.map((post) => (
            <CarouselItem
              key={post.id}
              className="pl-0 sm:pl-2 lg:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <div className="relative h-56 md:h-72 lg:h-80 rounded-lg overflow-hidden shadow-md group transition-transform duration-200 hover:scale-[1.02] bg-background">
                {post.feature_image && (
                  <Image
                    src={post.feature_image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 md:p-5 lg:p-6">
                  {post.primary_tag && (
                    <Badge variant="secondary" className="mb-1 md:mb-2 w-fit">
                      {post.primary_tag.name}
                    </Badge>
                  )}
                  <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-1 md:mb-2 drop-shadow-lg line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-white/90 text-xs md:text-sm lg:text-base line-clamp-2 mb-0 md:mb-1 drop-shadow">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
} 