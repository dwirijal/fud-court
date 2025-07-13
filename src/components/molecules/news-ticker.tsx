
import Link from 'next/link';
import type { Post } from '@/types';
import { cn } from '@/lib/utils';

interface NewsTickerProps {
  posts: Post[];
}

export function NewsTicker({ posts }: NewsTickerProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  // Duplicate the posts to create a seamless loop effect, ensuring enough content
  const duplicatedPosts = [...posts, ...posts, ...posts, ...posts];

  return (
    <div className={cn(
      "fixed left-0 w-full z-30 group overflow-hidden",
      "h-10 border-border bg-background/60 backdrop-blur-md",
      // Mobile: Sticky top, under the header
      "top-16 border-b",
      // Desktop: Sticky bottom
      "md:top-auto md:bottom-0 md:border-b-0 md:border-t"
    )}>
      <div className="absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none" />

      <div className="animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap flex items-center h-full">
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
  );
}
