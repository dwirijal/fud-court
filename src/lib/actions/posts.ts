
'use server';

import GhostAdminAPI from '@tryghost/admin-api';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Post } from '@/types/post';

function getApi() {
  const url = process.env.GHOST_API_URL;
  const key = process.env.GHOST_ADMIN_API_KEY;

  if (!url || !key) {
    throw new Error('Ghost Admin API URL or Key is not configured in .env.local');
  }

  return new GhostAdminAPI({ url, key, version: 'v5.0' });
}

export async function createPost(post: Post) {
  const api = getApi();

  try {
    const result = await api.posts.add(
      {
        title: post.title,
        slug: post.slug || undefined,
        html: post.html,
        status: post.status,
        feature_image: post.featureImage || undefined,
        custom_excerpt: post.excerpt || undefined,
      },
      { source: 'html' }
    );
    
    revalidatePath('/admin/content/queue');
    revalidatePath('/');
    revalidatePath('/news');
    if (result.slug) {
        revalidatePath(`/news/${result.slug}`);
    }

  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : 'An unknown error occurred';
    throw new Error(`Failed to create post: ${message}`);
  }

  redirect('/admin/content/queue');
}

export async function updatePost(post: Post) {
  const api = getApi();

  if (!post.id || !post.updated_at) {
      throw new Error("Post ID and updated_at timestamp are required for updates.");
  }

  try {
    const result = await api.posts.edit(
      {
        id: post.id,
        updated_at: post.updated_at,
        title: post.title,
        slug: post.slug || undefined,
        html: post.html,
        status: post.status,
        feature_image: post.featureImage || undefined,
        custom_excerpt: post.excerpt || undefined,
      },
      { source: 'html' }
    );
    
    revalidatePath('/admin/content/queue');
    revalidatePath('/');
    revalidatePath('/news');
    if (result.slug) {
        revalidatePath(`/news/${result.slug}`);
    }

  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : 'An unknown error occurred';
    throw new Error(`Failed to update post: ${message}`);
  }

  redirect('/admin/content/queue');
}
