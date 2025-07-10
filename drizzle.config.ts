import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Supabase environment variables are not set.');
}

const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL.split('.')[0].replace('https://', '');
const dbPassword = process.env.SUPABASE_SERVICE_ROLE_KEY;
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
