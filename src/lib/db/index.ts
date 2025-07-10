import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './schema';

const getDbClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        console.warn('Database credentials are not set in the environment. DB-dependent features will be disabled.');
        return null;
    }

    try {
        const projectRef = supabaseUrl.split('.')[0].replace('https://', '');
        const dbPassword = supabaseServiceRoleKey;
        const connectionString = `postgres://${projectRef}:${dbPassword}@db.${projectRef}.supabase.co:5432/postgres`;
        
        const client = new Client({ connectionString });
        
        // The connection will be established when a query is made.
        // We don't need to call client.connect() here, as drizzle handles it.
        return client;
    } catch (error) {
        console.error("Failed to create database client configuration:", error);
        return null;
    }
}

// Instead of a single instance, we get a new client when needed.
// For the purpose of exporting a `db` object, we'll initialize it here,
// but robust applications might manage this on a per-request basis.
// The key change is avoiding a single, module-level `client.connect()`.
const client = getDbClient();

export const db = client ? drizzle(client, { schema }) : null;
