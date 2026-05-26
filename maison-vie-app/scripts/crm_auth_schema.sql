-- ============================================================
-- CRM Authentication & RBAC Schema — Maison Vie
-- Chạy file này trong Supabase SQL Editor
-- ============================================================

-- Bảng người dùng CRM với phân quyền 5 cấp
CREATE TABLE IF NOT EXISTS public.crm_users (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name    TEXT NOT NULL,
  email        TEXT NOT NULL,
  role         TEXT NOT NULL CHECK (role IN ('admin','manager','accountant','chef','runner')),
  department   TEXT,
  avatar_url   TEXT,
  active       BOOLEAN NOT NULL DEFAULT TRUE,
  last_login   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.crm_users ENABLE ROW LEVEL SECURITY;

-- Chỉ chính user đó hoặc admin mới được đọc
CREATE POLICY "crm_users_self_read" ON public.crm_users
  FOR SELECT USING (
    auth.uid() = id
    OR (SELECT role FROM public.crm_users WHERE id = auth.uid()) = 'admin'
  );

-- Chỉ admin được sửa
CREATE POLICY "crm_users_admin_all" ON public.crm_users
  FOR ALL USING (
    (SELECT role FROM public.crm_users WHERE id = auth.uid()) = 'admin'
  ) WITH CHECK (
    (SELECT role FROM public.crm_users WHERE id = auth.uid()) = 'admin'
  );

-- Insert admin đầu tiên (bypass RLS bằng service role khi chạy script)
INSERT INTO public.crm_users (id, full_name, email, role, department, active)
VALUES (
  '056554b2-0fd2-4035-be6d-335e3735919a',
  'Maison Vie Admin',
  'thanhceo.mr@gmail.com',
  'admin',
  'Executive',
  TRUE
)
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  active = EXCLUDED.active,
  updated_at = NOW();

-- Index
CREATE INDEX IF NOT EXISTS idx_crm_users_role ON public.crm_users(role);
CREATE INDEX IF NOT EXISTS idx_crm_users_active ON public.crm_users(active);
