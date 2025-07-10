import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// This is a singleton pattern to ensure we only have one connection pool.
// It's crucial for serverless environments where functions can be reused ("warm starts").
let dbInstance: ReturnType<typeof drizzle> | null = null;

const getDbInstance = () => {
    if (dbInstance) {
        return dbInstance;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        console.warn('Database credentials are not set. DB-dependent features will be disabled.');
        return null;
    }

    try {
        const projectRef = supabaseUrl.split('.')[0].replace('https://', '');
        const dbPassword = supabaseServiceRoleKey;
        const connectionString = `postgres://${projectRef}:${dbPassword}@db.${projectRef}.supabase.co:5432/postgres?sslmode=require`;

        // The 'postgres' driver is more robust for serverless environments.
        // It manages the connection pool automatically.
        const client = postgres(connectionString);
        dbInstance = drizzle(client, { schema });
        return dbInstance;

    } catch (error) {
        console.error("Failed to create database client:", error);
        return null;
    }
}

// Export the instance directly. The function handles the singleton logic.
export const db = getDbInstance();
