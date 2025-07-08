
'use server';

import GhostAdminAPI from '@tryghost/admin-api';
import type { Post as GhostPost } from '@tryghost/content-api';

// The AdminPost type now includes more fields for a richer editing experience.
export interface AdminPost {
  id: string;
  uuid: string;
  slug: string;
  title: string;
  status: 'published' | 'draft' | 'scheduled';
  updated_at: string;
  published_at: string | null;
  url: string;
  html?: string | null;
  excerpt?: string | null;
  feature_image?: string | null;
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
        html: post.html || null,
        excerpt: post.excerpt || null,
        feature_image: post.feature_image || null,
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
      status: 'all', 
    });
    return (posts as unknown as GhostPost[]).map(mapToAdminPost);
  } catch (err) {
    console.error('Error fetching all posts from Ghost Admin API:', err);
    return [];
  }
}

export async function getPostById(id: string): Promise<AdminPost | null> {
  const api = getAdminApi();
  if (!api) return null;

  try {
    // We now request the feature_image and excerpt fields as well.
    const post = await api.posts.read({ id, formats: ['html'], include: ['tags'] });
    return mapToAdminPost(post);
  } catch (err) {
    console.error(`Error fetching post with ID ${id}:`, err);
    return null;
  }
}
