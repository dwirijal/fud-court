import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './schema';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn('Database credentials are not set. DB-dependent features will be disabled.');
}

const getDbClient = () => {
    if (!supabaseUrl || !supabaseServiceRoleKey) {
        return null;
    }
    const projectRef = supabaseUrl.split('.')[0].replace('https://', '');
    const dbPassword = supabaseServiceRoleKey;
    const connectionString = `postgres://${projectRef}:${dbPassword}@db.${projectRef}.supabase.co:5432/postgres`;
    
    const client = new Client({
        connectionString,
    });
    
    // Asynchronous connection
    client.connect().catch(err => {
        console.error('Failed to connect to the database', err);
    });

    return client;
}

const client = getDbClient();

export const db = client ? drizzle(client, { schema }) : null;
