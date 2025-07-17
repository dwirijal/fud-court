
import { getPosts } from '@/lib/ghost';
import { NewsTicker } from '@/components/molecules/news-ticker';
import type { Post } from '@/types';

/**
 * A resilient server component to fetch news posts and render the news ticker.
 * It first tries to fetch very recent news, and if none are found,
 * it falls back to fetching the latest general news to ensure the ticker is never empty.
 */
export async function GlobalNewsTicker() {
  let newsPosts: Post[] = [];
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

  try {
    // 1. Attempt to fetch news from the last 15 minutes
    newsPosts = await getPosts({
      tag: 'realtime-news',
      limit: 70,
      since: fifteenMinutesAgo,
    });

    // 2. If no recent news, fetch the latest news as a fallback
    if (newsPosts.length === 0) {
      console.log("No news in the last 15 minutes. Fetching latest news as fallback.");
      newsPosts = await getPosts({
        tag: 'realtime-news',
        limit: 20, // Fetch a reasonable number for the fallback
      });
    }
  } catch (error) {
    console.error("Failed to fetch posts for news ticker:", error);
    // On error, newsPosts remains an empty array, so the ticker simply won't render.
  }

  return <NewsTicker posts={newsPosts} />;
}
