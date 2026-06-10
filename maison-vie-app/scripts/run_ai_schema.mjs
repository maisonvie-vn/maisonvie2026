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

    // Read the SQL schema file
    const sqlPath = './scripts/ai_agent_schema.sql';
    console.log(`📖 Reading SQL from: ${sqlPath}`);
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('⚡ Executing AI Agent SQL schema & RLS policies...');
    await client.query(sql);
    console.log('✅ AI Agent SQL Schema and RLS policies executed successfully!');

  } catch (error) {
    console.error('❌ Error executing SQL:', error);
  } finally {
    await client.end();
    console.log('🔌 Connection closed.');
  }
}

run();
