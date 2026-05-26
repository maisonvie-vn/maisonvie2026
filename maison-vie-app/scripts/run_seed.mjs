/**
 * run_seed.mjs
 * Nạp dữ liệu thực đơn À La Carte vào Supabase thông qua REST API
 * Chạy bằng: node run_seed.mjs
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Credentials from .env
const SUPABASE_URL = 'https://soceewbooszqkutkbylm.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvY2Vld2Jvb3N6cWt1dGtieWxtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTY5MTIyNiwiZXhwIjoyMDk1MjY3MjI2fQ.9yBb_0GZsp4dLjsm7-AgRzwp-TYdSwB4FZ7aQYCnHfU';

// Read the seed SQL file
const seedPath = join(__dirname, '..', '..', 'seed_alacarte_menu.sql');
const sql = readFileSync(seedPath, 'utf-8');

async function runSeed() {
  console.log('🌱 Đang nạp dữ liệu thực đơn vào Supabase...\n');

  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ sql }),
  });

  if (!response.ok) {
    // Fallback: try the pg endpoint
    console.warn('exec_sql RPC not available, trying pg REST...');
    const pgResp = await fetch(`${SUPABASE_URL}/pg/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ query: sql }),
    });
    const text = await pgResp.text();
    console.log('Response status:', pgResp.status);
    console.log('Response body:', text.substring(0, 500));
    if (!pgResp.ok) {
      throw new Error(`Seed failed with status ${pgResp.status}: ${text}`);
    }
  }

  const text = await response.text().catch(() => '(no body)');
  console.log('Response:', text.substring(0, 300));
  console.log('\n✅ Seed hoàn tất!');
}

runSeed().catch(err => {
  console.error('❌ Seed thất bại:', err.message);
  process.exit(1);
});
