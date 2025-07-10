
'use server';

import GhostAdminAPI from '@tryghost/admin-api';
// We are using a generic Post type from the content-api, then casting as needed.
// This is because the Admin API client doesn't export as many detailed types.
import type { Post as GhostPost } from '@tryghost/content-api';

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
  
  // Optional fields
  feature_image_alt?: string | null;
  feature_image_caption?: string | null;
  visibility?: 'public' | 'members' | 'paid';
  // The API returns tags and authors as arrays of objects
  tags?: { id: string; name: string; slug: string }[];
  authors?: { id: string; name: string; slug: string }[];
  meta_title?: string | null;
  meta_description?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  twitter_title?: string | null;
  twitter_description?: string | null;
  twitter_image?: string | null;
  canonical_url?: string | null;
  email_subject?: string | null;
  send_email_when_published?: boolean;
  codeinjection_head?: string | null;
  codeinjection_foot?: string | null;
}

export interface ImageAsset {
    url: string;
    alt: string | null;
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

function mapToAdminPost(post: any): AdminPost {
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
        excerpt: post.custom_excerpt || post.excerpt || null,
        feature_image: post.feature_image || null,

        // Map optional fields
        feature_image_alt: post.feature_image_alt,
        feature_image_caption: post.feature_image_caption,
        visibility: post.visibility,
        tags: post.tags,
        authors: post.authors,
        meta_title: post.meta_title,
        meta_description: post.meta_description,
        og_title: post.og_title,
        og_description: post.og_description,
        og_image: post.og_image,
        twitter_title: post.twitter_title,
        twitter_description: post.twitter_description,
        twitter_image: post.twitter_image,
        canonical_url: post.canonical_url,
        email_subject: post.email_subject,
        send_email_when_published: post.send_email_when_published,
        codeinjection_head: post.codeinjection_head,
        codeinjection_foot: post.codeinjection_foot,
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
      formats: ['html'],
      include: ['tags', 'authors'],
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
    const post = await api.posts.read({ id, formats: ['html'], include: ['tags', 'authors'] });
    return mapToAdminPost(post);
  } catch (err) {
    console.error(`Error fetching post with ID ${id}:`, err);
    return null;
  }
}

export async function getRecentImages(): Promise<ImageAsset[]> {
    const api = getAdminApi();
    if (!api) {
        return [];
    }

    try {
        const posts = await api.posts.browse({
            limit: 20, // Fetch recent 20 posts to find images
            fields: 'feature_image, feature_image_alt, html',
            formats: ['html'],
            status: 'published',
        });

        const imageUrls = new Set<string>();
        const imageAssets: ImageAsset[] = [];

        for (const post of posts) {
            // Add feature image
            if (post.feature_image && !imageUrls.has(post.feature_image)) {
                imageUrls.add(post.feature_image);
                imageAssets.push({
                    url: post.feature_image,
                    alt: post.feature_image_alt || null,
                });
            }

            // Extract images from post content (HTML)
            if (post.html) {
                const imageRegex = /<img[^>]+src="([^">]+)"[^>]*alt="([^"]*)"/g;
                let match;
                while ((match = imageRegex.exec(post.html)) !== null) {
                    const url = match[1];
                    const alt = match[2];
                    if (!imageUrls.has(url)) {
                        imageUrls.add(url);
                        imageAssets.push({ url, alt });
                    }
                }
            }
        }

        return imageAssets;
    } catch (err) {
        console.error('Error fetching recent images from Ghost Admin API:', err);
        return [];
    }
}
