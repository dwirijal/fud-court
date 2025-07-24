/*
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from './index';
import 'dotenv/config'; // Import dotenv/config to load .env variables

async function main() {
  try {
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migrations complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

main();
*/