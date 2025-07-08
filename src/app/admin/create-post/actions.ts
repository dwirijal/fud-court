'use server';

import GhostAdminAPI from '@tryghost/admin-api';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(data: { title: string; content: string }) {
  const url = process.env.GHOST_API_URL;
  const key = process.env.GHOST_ADMIN_API_KEY;

  if (!url || !key) {
    // This error will now be caught by the form's try-catch block
    // and displayed as a toast, which is much better than crashing.
    throw new Error('Ghost Admin API URL or Key is not configured in .env.local');
  }

  const api = new GhostAdminAPI({
    url,
    key,
    version: 'v5.0',
  });

  try {
    const post = await api.posts.add(
      {
        title: data.title,
        html: data.content,
        status: 'published',
      },
      { source: 'html' }
    );
    
    // Revalidate paths to show the new post immediately
    revalidatePath('/');
    revalidatePath('/news');
    revalidatePath('/articles');
    revalidatePath('/learn');
    revalidatePath(`/news/${post.slug}`);

  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : 'An unknown error occurred';
    // Re-throw a simpler error to avoid leaking sensitive details to the client
    throw new Error(`Failed to create post: ${message}`);
  }

  // Redirect to the news page after successful creation
  redirect('/news');
}
