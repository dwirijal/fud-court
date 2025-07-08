'use server';

import { z } from 'zod';

const FormSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

export async function sendMagicLink(data: { email: string }) {
  const validatedFields = FormSchema.safeParse(data);

  if (!validatedFields.success) {
    throw new Error('Invalid email address provided.');
  }

  const { email } = validatedFields.data;
  const url = process.env.GHOST_API_URL;
  const key = process.env.GHOST_CONTENT_API_KEY;

  if (!url || !key) {
    throw new Error('Ghost API URL or Content Key is not configured. Cannot send magic link.');
  }

  // The Ghost Members API is not part of the official SDK, so we use fetch directly.
  // This endpoint sends a magic link for both signing up and logging in.
  // It requires the Content API Key to be passed as a URL query parameter.
  const membersApiUrl = `${url.replace(/\/$/, '')}/members/api/send-magic-link/?key=${key}`;

  try {
    const response = await fetch(membersApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        emailType: 'signin', // 'signin' works for both login and signup
        labels: [], // Optional: assign labels on signup
      }),
    });

    if (!response.ok) {
      // Try to parse the error message from Ghost's response
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.errors?.[0]?.message || `Request failed with status ${response.status}`;
      console.error('Ghost Members API error:', errorMessage, errorData);
      throw new Error(`Could not send magic link: ${errorMessage}`);
    }

    return { success: true, message: 'Magic link sent successfully!' };

  } catch (err) {
    console.error('Failed to send magic link:', err);
    const message = err instanceof Error ? err.message : 'An unknown error occurred.';
    // Re-throw a clean error to the client
    throw new Error(message);
  }
}
