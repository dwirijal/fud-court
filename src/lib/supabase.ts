import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Only create a client if the credentials are provided
const supabase =
  supabaseUrl && (supabaseAnonKey || supabaseServiceRoleKey)
    ? createClient(
        supabaseUrl,
        // Use service role key for server-side operations if available and anon key is not, otherwise use anon key.
        typeof window === 'undefined' && supabaseServiceRoleKey
          ? supabaseServiceRoleKey
          : supabaseAnonKey || ''
      )
    : null;

if (!supabase) {
  console.warn(
    'Supabase client not initialized. Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Caching will be disabled.'
  );
}

export { supabase };
