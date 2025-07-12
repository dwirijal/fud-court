import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

if (!process.env.ANALYTIC_URL) {
  throw new Error('ANALYTIC_URL environment variable is not set.');
}

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.ANALYTIC_URL,
  },
  verbose: true,
  strict: true,
});
