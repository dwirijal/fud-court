import { getPosts } from '@/lib/ghost';
import { NewsTicker } from '@/components/molecules/news-ticker';
import type { Post } from '@/types';

/**
 * A resilient server component to fetch news posts and render the news ticker.
 * It handles potential fetching errors gracefully.
 */
export async function GlobalNewsTicker() {
  let newsPosts: Post[] = [];

  try {
    // Fetch news in a try-catch block to prevent crashing the entire layout
    newsPosts = await getPosts({ tag: 'realtime-news', limit: 20 });
  } catch (error) {
    console.error("Failed to fetch posts for news ticker:", error);
    // On error, newsPosts remains an empty array, so the ticker simply won't render.
  }

  return <NewsTicker posts={newsPosts} />;
}
