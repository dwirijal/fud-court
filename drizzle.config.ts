import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

// We can't use the utils/supabase/client here because this is a server-side
// script and that client is for browser environments. We'll create a lightweight
// Supabase client just for this config.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Supabase URL or Service Role Key is not configured in .env.local');
}

// Create a Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Construct the database URL from the Supabase client details.
// This ensures we're always using the correct connection details associated
// with the Supabase project, including the password which is part of the service key.
// The hostname is derived from the project reference in the URL.
const projectRef = supabaseUrl.split('.')[0].replace('https://', '');
const dbPassword = supabaseServiceRoleKey;
const dbUrl = `postgres://${projectRef}:${dbPassword}@db.${projectRef}.supabase.co:5432/postgres`;

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: dbUrl,
  },
  verbose: true,
  strict: true,
});
