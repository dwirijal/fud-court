
import Link from 'next/link';
import type { Post } from '@/types';
import { cn } from '@/lib/utils';
import { Fragment } from 'react';

interface NewsTickerProps {
  posts: Post[];
  className?: string;
}

export function NewsTicker({ posts, className }: NewsTickerProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  // Duplicate the posts to create a seamless loop effect, ensuring enough content
  const duplicatedPosts = [...posts, ...posts, ...posts, ...posts];

  return (
    <div className={cn(
      "fixed left-0 w-full z-30 group overflow-hidden",
      "h-7 border-border bg-background/60 backdrop-blur-md",
      // Mobile: at top, Desktop: at bottom
      "top-0 border-b md:top-auto md:bottom-0 md:border-t md:border-b-0",
      className,
    )}>
      <div className="absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none" />

      <div className="animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap flex items-center h-full">
        {duplicatedPosts.map((post, index) => (
<<<<<<< HEAD
          <Fragment key={`${post.id}-${index}`}>
            <Link
              href={`/news/${post.slug}`}
              className="mx-4 text-xs text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
            >
              {post.title}
            </Link>
            <span className="text-muted-foreground text-xs">|</span>
          </Fragment>
=======
          <Link
            key={`${post.id}-${index}`}
            href={`/news/${post.slug}`}
            className="mx-6 text-sm text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
          >
            {post.title}
          </Link>
>>>>>>> b058873b045abf5277ae8797dcaa268e60af95fe
        ))}
      </div>
    </div>
  );
}
