
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
      "fixed left-0 w-full z-50 group overflow-hidden",
      "h-7 border-b border-border bg-background/60 backdrop-blur-md",
      "top-0", // Positioned at the very top
      className,
    )}>
      <div className="absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none" />

      <div className="animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap flex items-center h-full">
        {duplicatedPosts.map((post, index) => (
          <Fragment key={`${post.id}-${index}`}>
            <Link
              href={`/news/${post.slug}`}
              className="mx-4 text-xs text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
            >
              {post.title}
            </Link>
            <span className="text-muted-foreground text-xs">|</span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
