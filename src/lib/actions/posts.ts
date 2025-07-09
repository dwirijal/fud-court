
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

// Helper to build the post data object for the API
function buildPostData(post: Post) {
  return {
    title: post.title,
    slug: post.slug || undefined,
    html: post.html,
    status: post.status,
    feature_image: post.featureImage || undefined,
    custom_excerpt: post.excerpt || undefined,
    
    // Optional fields
    feature_image_alt: post.feature_image_alt || undefined,
    feature_image_caption: post.feature_image_caption || undefined,
    published_at: post.published_at || undefined,
    visibility: post.visibility || undefined,
    tags: post.tags,
    authors: post.authors,
    meta_title: post.meta_title || undefined,
    meta_description: post.meta_description || undefined,
    og_title: post.og_title || undefined,
    og_description: post.og_description || undefined,
    og_image: post.og_image || undefined,
    twitter_title: post.twitter_title || undefined,
    twitter_description: post.twitter_description || undefined,
    twitter_image: post.twitter_image || undefined,
    canonical_url: post.canonical_url || undefined,
    email_subject: post.email_subject || undefined,
    send_email_when_published: post.send_email_when_published,
    codeinjection_head: post.codeinjection_head || undefined,
    codeinjection_foot: post.codeinjection_foot || undefined,
  };
}


export async function createPost(post: Post) {
  const api = getApi();

  try {
    const postData = buildPostData(post);
    const result = await api.posts.add(postData, { source: 'html' });
    
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
    const postData = {
        ...buildPostData(post),
        id: post.id,
        updated_at: post.updated_at,
    };
    const result = await api.posts.edit(postData, { source: 'html' });
    
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
