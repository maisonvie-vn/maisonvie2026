/**
 * migrate_wines_schema.mjs
 * Thêm các cột mới vào bảng wines hiện có và tạo bảng wines_au_verre
 * bằng cách gọi Supabase Edge Function exec hoặc tự tạo từng cột qua upsert dummy.
 *
 * Vì Supabase REST API không hỗ trợ DDL trực tiếp, script này:
 * 1. Kiểm tra cột hiện có
 * 2. Insert một record tạm để trigger auto-schema discovery
 * 3. Dùng cách tạo Edge Function tạm thời để chạy ALTER TABLE
 *
 * Chạy: node scripts/migrate_wines_schema.mjs
 */

const SUPABASE_URL = 'https://soceewbooszqkutkbylm.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvY2Vld2Jvb3N6cWt1dGtieWxtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTY5MTIyNiwiZXhwIjoyMDk1MjY3MjI2fQ.9yBb_0GZsp4dLjsm7-AgRzwp-TYdSwB4FZ7aQYCnHfU';

const H = {
  'Content-Type': 'application/json',
  'apikey': SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
};

// Chạy SQL qua Supabase Realtime Admin endpoint (undocumented nhưng hoạt động với service role)
async function runSQL(sql) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
    method: 'POST',
    headers: H,
    body: JSON.stringify({ sql }),
  });
  const text = await res.text();
  return { status: res.status, body: text };
}

const MIGRATION_SQL = `
-- Thêm các cột mới vào bảng wines (nếu chưa có)
DO $$ BEGIN
  -- wine_style (cột phân loại chính mới)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='wines' AND column_name='wine_style') THEN
    ALTER TABLE public.wines ADD COLUMN wine_style TEXT NOT NULL DEFAULT 'red'
      CHECK (wine_style IN ('champagne','sparkling','rose','white','red','dessert'));
  END IF;
  -- producer
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='wines' AND column_name='producer') THEN
    ALTER TABLE public.wines ADD COLUMN producer TEXT;
  END IF;
  -- cuvee
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='wines' AND column_name='cuvee') THEN
    ALTER TABLE public.wines ADD COLUMN cuvee TEXT;
  END IF;
  -- appellation
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='wines' AND column_name='appellation') THEN
    ALTER TABLE public.wines ADD COLUMN appellation TEXT;
  END IF;
  -- sommelier_note
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='wines' AND column_name='sommelier_note') THEN
    ALTER TABLE public.wines ADD COLUMN sommelier_note TEXT;
  END IF;
  -- food_pairing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='wines' AND column_name='food_pairing') THEN
    ALTER TABLE public.wines ADD COLUMN food_pairing TEXT;
  END IF;
  -- price_bottle (thay thế price_dine_in cho wine)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='wines' AND column_name='price_bottle') THEN
    ALTER TABLE public.wines ADD COLUMN price_bottle INTEGER;
  END IF;
  -- price_glass
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='wines' AND column_name='price_glass') THEN
    ALTER TABLE public.wines ADD COLUMN price_glass INTEGER;
  END IF;
  -- price_variants (JSONB — multi-volume)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='wines' AND column_name='price_variants') THEN
    ALTER TABLE public.wines ADD COLUMN price_variants JSONB;
  END IF;
  -- featured
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='wines' AND column_name='featured') THEN
    ALTER TABLE public.wines ADD COLUMN featured BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;
  -- vino_club_eligible
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='wines' AND column_name='vino_club_eligible') THEN
    ALTER TABLE public.wines ADD COLUMN vino_club_eligible BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;
  -- vino_club_discount
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='wines' AND column_name='vino_club_discount') THEN
    ALTER TABLE public.wines ADD COLUMN vino_club_discount NUMERIC(5,2);
  END IF;
  -- vino_club_tier
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='wines' AND column_name='vino_club_tier') THEN
    ALTER TABLE public.wines ADD COLUMN vino_club_tier TEXT;
  END IF;
  -- bio_certified
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='wines' AND column_name='bio_certified') THEN
    ALTER TABLE public.wines ADD COLUMN bio_certified BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;
  -- serving_temp_min / max
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='wines' AND column_name='serving_temp_min') THEN
    ALTER TABLE public.wines ADD COLUMN serving_temp_min SMALLINT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='wines' AND column_name='serving_temp_max') THEN
    ALTER TABLE public.wines ADD COLUMN serving_temp_max SMALLINT;
  END IF;
  -- decant_recommended
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='wines' AND column_name='decant_recommended') THEN
    ALTER TABLE public.wines ADD COLUMN decant_recommended BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;
  -- cellar_potential
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='wines' AND column_name='cellar_potential') THEN
    ALTER TABLE public.wines ADD COLUMN cellar_potential TEXT;
  END IF;
  -- image_url
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='wines' AND column_name='image_url') THEN
    ALTER TABLE public.wines ADD COLUMN image_url TEXT;
  END IF;
  -- sort_order
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='wines' AND column_name='sort_order') THEN
    ALTER TABLE public.wines ADD COLUMN sort_order SMALLINT NOT NULL DEFAULT 0;
  END IF;
  -- wine_score
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='wines' AND column_name='wine_score') THEN
    ALTER TABLE public.wines ADD COLUMN wine_score SMALLINT;
  END IF;
  -- updated_at
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='wines' AND column_name='updated_at') THEN
    ALTER TABLE public.wines ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
  END IF;
END $$;

-- Tạo bảng wines_au_verre nếu chưa có
CREATE TABLE IF NOT EXISTS public.wines_au_verre (
  id           TEXT        PRIMARY KEY,
  wine_id      TEXT        REFERENCES public.wines(id) ON DELETE CASCADE,
  name         TEXT        NOT NULL,
  grape        TEXT,
  wine_style   TEXT,
  appellation  TEXT,
  price_glass  INTEGER,
  volume_ml    SMALLINT    NOT NULL DEFAULT 125,
  available    BOOLEAN     NOT NULL DEFAULT TRUE,
  sort_order   SMALLINT    NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS nếu chưa
ALTER TABLE public.wines_au_verre ENABLE ROW LEVEL SECURITY;

-- Policy public read
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='wines_au_verre' AND policyname='Public can read available au verre'
  ) THEN
    CREATE POLICY "Public can read available au verre"
      ON public.wines_au_verre FOR SELECT USING (available = TRUE);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='wines_au_verre' AND policyname='Auth full access au verre'
  ) THEN
    CREATE POLICY "Auth full access au verre"
      ON public.wines_au_verre FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
  END IF;
END $$;
`;

async function main() {
  console.log('🔧 Migrate wines schema...\n');
  const r = await runSQL(MIGRATION_SQL);
  console.log(`Status: ${r.status}`);
  console.log(`Response: ${r.body}`);
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
