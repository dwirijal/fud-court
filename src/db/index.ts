/*
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true, // Explicitly enable SSL
});

export const db = drizzle(pool, { schema });
*/