
'use server';

import GhostAdminAPI from '@tryghost/admin-api';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updatePost(data: { id: string; title: string; html: string; updated_at: string; }) {
  const url = process.env.GHOST_API_URL;
  const key = process.env.GHOST_ADMIN_API_KEY;

  if (!url || !key) {
    throw new Error('Ghost Admin API URL or Key is not configured in .env.local');
  }

  const api = new GhostAdminAPI({
    url,
    key,
    version: 'v5.0',
  });

  try {
    const post = await api.posts.edit(
      {
        id: data.id,
        title: data.title,
        html: data.html,
        updated_at: data.updated_at,
      },
      { source: 'html' }
    );
    
    revalidatePath('/admin/content/queue');
    revalidatePath('/');
    revalidatePath('/news');
    revalidatePath(`/news/${post.slug}`);

  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : 'An unknown error occurred';
    throw new Error(`Failed to update post: ${message}`);
  }

  redirect('/admin/content/queue');
}
