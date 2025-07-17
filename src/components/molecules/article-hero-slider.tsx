
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/types";

interface ArticleHeroSliderProps {
  posts: Post[];
}

export function ArticleHeroSlider({ posts }: ArticleHeroSliderProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="mb-12">
      <Carousel 
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
              <Link href={`/news/${post.slug}`} className="group block">
                <div className="relative h-80 rounded-3 overflow-hidden shadow-lg transition-transform duration-normal group-hover:scale-[1.02]">
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
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2"/>
      </Carousel>
    </section>
  );
}
