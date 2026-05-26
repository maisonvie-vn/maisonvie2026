import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ Error: DATABASE_URL is not defined in process.env. Did you specify --env-file?');
  process.exit(1);
}

async function run() {
  console.log('🔄 Connecting to PostgreSQL database...');
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected successfully!');

    // Resolve path properly using path module if imported, or manually
    // Let's import path module correctly.
    const sqlPath = './scripts/crm_auth_schema.sql';
    console.log(`📖 Reading SQL from: ${sqlPath}`);
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('⚡ Executing SQL schema...');
    await client.query(sql);
    console.log('✅ SQL Schema executed successfully!');

  } catch (error) {
    console.error('❌ Error executing SQL:', error);
  } finally {
    await client.end();
    console.log('🔌 Connection closed.');
  }
}

run();
