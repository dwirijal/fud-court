
'use server';

import GhostAdminAPI from '@tryghost/admin-api';
import type { Post as GhostPost } from '@tryghost/content-api';

// Simplified Post type for the admin queue
export interface AdminPost {
  id: string;
  uuid: string;
  slug: string;
  title: string;
  status: 'published' | 'draft' | 'scheduled';
  updated_at: string;
  published_at: string | null;
  url: string;
}

function getAdminApi() {
    const url = process.env.GHOST_API_URL;
    const key = process.env.GHOST_ADMIN_API_KEY;

    if (!url || !key) {
        console.error('Ghost Admin API URL or Key is not configured in .env.local');
        return null;
    }

    try {
        return new GhostAdminAPI({
            url,
            key,
            version: 'v5.0',
        });
    } catch (error) {
        console.error('Failed to initialize Ghost Admin API:', error);
        return null;
    }
}

function mapToAdminPost(post: GhostPost): AdminPost {
    return {
        id: post.id,
        uuid: post.uuid,
        slug: post.slug,
        title: post.title || '',
        status: post.status as 'published' | 'draft' | 'scheduled',
        updated_at: post.updated_at || new Date().toISOString(),
        published_at: post.published_at,
        url: post.url || '',
    };
}


export async function getAllPosts(): Promise<AdminPost[]> {
  const api = getAdminApi();
  if (!api) {
    return [];
  }

  try {
    const posts = await api.posts.browse({
      limit: 'all',
      formats: ['html', 'mobiledoc'],
      status: 'all', // This is the key to get draft, scheduled and published posts
    });
    // The Admin API browse method returns a slighly different type, but it's compatible for our needs.
    // We cast it to satisfy TypeScript.
    return (posts as unknown as GhostPost[]).map(mapToAdminPost);
  } catch (err) {
    console.error('Error fetching all posts from Ghost Admin API:', err);
    return [];
  }
}
