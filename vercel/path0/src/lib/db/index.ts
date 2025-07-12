import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// This is a singleton pattern to ensure we only have one connection pool.
let dbInstance: ReturnType<typeof drizzle> | null = null;

const getDbInstance = () => {
    if (dbInstance) {
        return dbInstance;
    }

    const analyticUrl = process.env.ANALYTIC_URL;

    if (!analyticUrl) {
        console.warn('ANALYTIC_URL is not set. DB-dependent features will be disabled.');
        return null;
    }

    try {
        // Use the serverless-optimized neon driver.
        const sql = neon(analyticUrl);
        dbInstance = drizzle(sql, { schema });
        return dbInstance;
    } catch (error) {
        console.error("Failed to create database client:", error);
        return null;
    }
}

// Export the instance directly. The function handles the singleton logic.
export const db = getDbInstance();
