
import GhostContentAPI, { type PostOrPage } from '@tryghost/content-api';
import type { Post } from "@/types";

const GHOST_API_URL = process.env.GHOST_API_URL;
const GHOST_CONTENT_API_KEY = process.env.GHOST_CONTENT_API_KEY;

// A helper function to initialize the API safely, preventing crashes from invalid credentials.
function initializeGhostApi() {
  if (!GHOST_API_URL || !GHOST_CONTENT_API_KEY) {
    return null;
  }
  try {
    return new GhostContentAPI({
      url: GHOST_API_URL,
      key: GHOST_CONTENT_API_KEY,
      version: "v5.0"
    });
  } catch (error) {
    console.warn(
      "Ghost Content API initialization failed. News will not be available.",
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
}

const api = initializeGhostApi();

if (!api) {
    console.warn("Ghost API URL or Key not configured or invalid. News will not be available.");
}

// The Ghost API returns a lot more fields than we need.
// This function maps the Ghost post to our simpler `Post` type.
function mapGhostPost(post: PostOrPage): Post {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title || '',
    excerpt: post.excerpt || '',
    feature_image: post.feature_image || null,
    published_at: post.published_at || new Date().toISOString(),
    primary_tag: post.primary_tag ? {
      id: post.primary_tag.id,
      name: post.primary_tag.name || '',
    } : null,
    html: post.html || '',
    // Map SEO fields
    meta_title: post.meta_title,
    meta_description: post.meta_description,
    og_title: post.og_title,
    og_description: post.og_description,
    og_image: post.og_image,
    twitter_title: post.twitter_title,
    twitter_description: post.twitter_description,
    twitter_image: post.twitter_image,
  }
}

export async function getPosts(options?: { tag?: string, page?: number, limit?: number, since?: Date }): Promise<Post[]> {
  if (!api) return [];

  try {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;
    const browseOptions: Parameters<typeof api.posts.browse>[0] = {
      limit,
      page,
      include: ['tags'],
      fields: 'id,slug,title,excerpt,feature_image,published_at,primary_tag', // Only fetch necessary fields for list view
      order: 'published_at DESC', // Ensure latest posts are first
    };

    let filters = [];
    if (options?.tag) {
      filters.push(`primary_tag:${options.tag}`);
    }
    if (options?.since) {
      // Format date to 'YYYY-MM-DD HH:MM:SS'
      const sinceDate = options.since.toISOString().replace('T', ' ').substring(0, 19);
      filters.push(`published_at:>'${sinceDate}'`);
    }
    
    if (filters.length > 0) {
        browseOptions.filter = filters.join('+');
    }
    
    const posts = await api.posts.browse(browseOptions);
    return posts.map(mapGhostPost);
  } catch (error) {
    console.error("Error fetching posts from Ghost:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  if (!api) return undefined;
  
  try {
    const post = await api.posts.read({ slug }, { include: ['tags'], formats: ['html'] });
    return mapGhostPost(post);
  } catch (error) {
    // Ghost API throws a specific error for not found which we can handle gracefully.
    if (error instanceof Error && error.message.includes('404')) {
      return undefined;
    }
    console.error(`Error fetching post with slug "${slug}" from Ghost:`, error);
    return undefined;
  }
}
