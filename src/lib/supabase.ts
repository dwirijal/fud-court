import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing Supabase URL. Make sure NEXT_PUBLIC_SUPABASE_URL is set in your environment variables.');
}

// Use service role key for server-side operations if available, otherwise use anon key.
// This is crucial for RLS policies that require elevated privileges for writes.
export const supabase = createClient(
  supabaseUrl,
  typeof window === 'undefined' && supabaseServiceRoleKey
    ? supabaseServiceRoleKey
    : supabaseAnonKey || ''
);

// Throw an error if anon key is missing for client-side operations
if (typeof window !== 'undefined' && !supabaseAnonKey) {
  throw new Error('Missing Supabase Anon Key. Make sure NEXT_PUBLIC_SUPABASE_ANON_KEY is set in your environment variables.');
}
