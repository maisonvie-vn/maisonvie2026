/**
 * run_migration.mjs
 * Chạy ALTER TABLE thông qua Supabase Edge Function tạm thời.
 * Dùng REST API để deploy và invoke function, sau đó xóa.
 *
 * Chạy: node scripts/run_migration.mjs
 */

const SUPABASE_URL = 'https://soceewbooszqkutkbylm.supabase.co';
const PROJECT_REF = 'soceewbooszqkutkbylm';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvY2Vld2Jvb3N6cWt1dGtieWxtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTY5MTIyNiwiZXhwIjoyMDk1MjY3MjI2fQ.9yBb_0GZsp4dLjsm7-AgRzwp-TYdSwB4FZ7aQYCnHfU';
const VERCEL_TOKEN = process.env.VERCEL_TOKEN || ''; // Set in .env

const H = { 'Content-Type': 'application/json', 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` };

// ── Các cột cần ADD vào wines ────────────────────────────────────────────────
const ALTER_STATEMENTS = [
  `ALTER TABLE public.wines ADD COLUMN IF NOT EXISTS wine_style TEXT NOT NULL DEFAULT 'red'`,
  `ALTER TABLE public.wines ADD COLUMN IF NOT EXISTS producer TEXT`,
  `ALTER TABLE public.wines ADD COLUMN IF NOT EXISTS cuvee TEXT`,
  `ALTER TABLE public.wines ADD COLUMN IF NOT EXISTS appellation TEXT`,
  `ALTER TABLE public.wines ADD COLUMN IF NOT EXISTS sommelier_note TEXT`,
  `ALTER TABLE public.wines ADD COLUMN IF NOT EXISTS food_pairing TEXT`,
  `ALTER TABLE public.wines ADD COLUMN IF NOT EXISTS price_bottle INTEGER`,
  `ALTER TABLE public.wines ADD COLUMN IF NOT EXISTS price_glass INTEGER`,
  `ALTER TABLE public.wines ADD COLUMN IF NOT EXISTS price_variants JSONB`,
  `ALTER TABLE public.wines ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT FALSE`,
  `ALTER TABLE public.wines ADD COLUMN IF NOT EXISTS vino_club_eligible BOOLEAN NOT NULL DEFAULT FALSE`,
  `ALTER TABLE public.wines ADD COLUMN IF NOT EXISTS vino_club_discount NUMERIC(5,2)`,
  `ALTER TABLE public.wines ADD COLUMN IF NOT EXISTS vino_club_tier TEXT`,
  `ALTER TABLE public.wines ADD COLUMN IF NOT EXISTS bio_certified BOOLEAN NOT NULL DEFAULT FALSE`,
  `ALTER TABLE public.wines ADD COLUMN IF NOT EXISTS serving_temp_min SMALLINT`,
  `ALTER TABLE public.wines ADD COLUMN IF NOT EXISTS serving_temp_max SMALLINT`,
  `ALTER TABLE public.wines ADD COLUMN IF NOT EXISTS decant_recommended BOOLEAN NOT NULL DEFAULT FALSE`,
  `ALTER TABLE public.wines ADD COLUMN IF NOT EXISTS cellar_potential TEXT`,
  `ALTER TABLE public.wines ADD COLUMN IF NOT EXISTS image_url TEXT`,
  `ALTER TABLE public.wines ADD COLUMN IF NOT EXISTS sort_order SMALLINT NOT NULL DEFAULT 0`,
  `ALTER TABLE public.wines ADD COLUMN IF NOT EXISTS wine_score SMALLINT`,
  `ALTER TABLE public.wines ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`,
];

// Deno Edge Function code
const EDGE_FN_CODE = `
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SERVICE_KEY = '${SERVICE_KEY}';
const DB_URL = '${SUPABASE_URL}';

Deno.serve(async (req) => {
  const { statements } = await req.json();
  const client = createClient(DB_URL, SERVICE_KEY);

  const results = [];
  for (const sql of statements) {
    try {
      const { error } = await client.rpc('query', { query_text: sql }).throwOnError();
      results.push({ sql, ok: true });
    } catch (e) {
      results.push({ sql, ok: false, error: e.message });
    }
  }

  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' }
  });
});
`;

async function deployEdgeFunction() {
  // Deploy via Supabase Management API
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/functions`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slug: 'run-migration',
      name: 'run-migration',
      body: EDGE_FN_CODE,
      verify_jwt: false,
    }),
  });
  return { status: res.status, body: await res.text() };
}

async function runMigrationViaRPC() {
  // Thử dùng pg_query nếu có
  console.log('Thử chạy từng ALTER TABLE qua Supabase RPC...');
  let ok = 0, fail = 0;

  for (const stmt of ALTER_STATEMENTS) {
    // Thử qua PostgREST function nếu đã tồn tại
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: H,
      body: JSON.stringify({ sql: stmt }),
    });
    if (res.ok) { ok++; console.log(`  ✓ ${stmt.substring(0, 60)}...`); }
    else { fail++; console.log(`  ✗ ${stmt.substring(0, 60)}...`); }
  }
  return { ok, fail };
}

async function main() {
  console.log('🔧 Wine Schema Migration\n');

  // Kiểm tra schema hiện tại
  const colRes = await fetch(`${SUPABASE_URL}/rest/v1/wines?limit=1&select=*`, { headers: H });
  const sample = await colRes.json();
  const existingCols = Array.isArray(sample) && sample.length > 0 ? Object.keys(sample[0]) : [];
  console.log('Cột hiện có:', existingCols.join(', '));

  const missingCols = ['wine_style','producer','cuvee','appellation','sommelier_note',
    'food_pairing','price_bottle','price_glass','price_variants','featured',
    'vino_club_eligible','sort_order','bio_certified'];
  const needed = missingCols.filter(c => !existingCols.includes(c));

  if (needed.length === 0) {
    console.log('✅ Schema đã đầy đủ!');
    return;
  }

  console.log(`\nCần thêm ${needed.length} cột: ${needed.join(', ')}`);
  console.log('\nThử chạy migration...');

  const { ok, fail } = await runMigrationViaRPC();
  console.log(`\nKết quả: ${ok} OK, ${fail} FAIL`);

  if (fail > 0) {
    console.log('\n⚠️  Không thể chạy DDL qua REST API.');
    console.log('📋 Vui lòng chạy SQL sau trong Supabase Dashboard > SQL Editor:');
    console.log('\n' + ALTER_STATEMENTS.map(s => s + ';').join('\n'));
  }
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
