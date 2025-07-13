
import Link from 'next/link';
import type { Post } from '@/types';
import { Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewsTickerProps {
  posts: Post[];
}

export function NewsTicker({ posts }: NewsTickerProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  // Duplicate the posts to create a seamless loop effect
  const duplicatedPosts = [...posts, ...posts];

  return (
    <div className="relative flex overflow-hidden group">
      <div className="flex-shrink-0 flex items-center justify-center bg-primary text-primary-foreground px-6 z-10">
        <Newspaper className="h-6 w-6" />
        <span className="ml-3 font-headline font-semibold uppercase tracking-wider text-lg">
          Headlines
        </span>
      </div>
      <div className="flex-grow relative flex overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent z-10 w-24 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-background to-transparent z-10 right-0 w-24 pointer-events-none"></div>

        <div className="animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap flex items-center">
          {duplicatedPosts.map((post, index) => (
            <Link
              key={`${post.id}-${index}`}
              href={`/news/${post.slug}`}
              className="mx-6 text-sm text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
            >
              <span className="font-semibold text-foreground/80">{post.primary_tag?.name || 'News'}:</span> {post.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
