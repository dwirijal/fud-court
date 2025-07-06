'use server';

import GhostAdminAPI from '@tryghost/admin-api';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const url = process.env.GHOST_API_URL;
const key = process.env.GHOST_ADMIN_API_KEY;

if (!url || !key) {
  throw new Error('Ghost Admin API URL or Key not configured.');
}

const api = new GhostAdminAPI({
  url,
  key,
  version: 'v5.0',
});

export async function createPost(data: { title: string; content: string }) {
  try {
    const post = await api.posts.add(
      {
        title: data.title,
        html: data.content,
        status: 'published',
      },
      { source: 'html' }
    );
    
    // Revalidate the news page to show the new post immediately
    revalidatePath('/news');
    revalidatePath('/news/[slug]', 'page');
    revalidatePath('/');

  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : 'An unknown error occurred';
    // Re-throw a simpler error to avoid leaking sensitive details to the client
    throw new Error(`Failed to create post: ${message}`);
  }

  // Redirect to the news page after successful creation
  redirect('/news');
}
