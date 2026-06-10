-- ============================================================
-- AI Agent (OpenClaw) & RLS Security Schema — Maison Vie
-- Chạy file này trong Supabase SQL Editor hoặc qua runner script
-- ============================================================

-- Kích hoạt extension UUID nếu chưa có
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BẢNG NHÁP MÓN ĂN TẠM THỜI (Dành cho AI đề xuất)
CREATE TABLE IF NOT EXISTS public.draft_menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_item_id UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,
    name JSONB NOT NULL, -- Đa ngôn ngữ: {"vi": "...", "en": "..."}
    description JSONB, -- Đa ngôn ngữ
    price_dine_in NUMERIC(12, 2) CHECK (price_dine_in >= 0),
    price_takeaway NUMERIC(12, 2) CHECK (price_takeaway >= 0),
    category VARCHAR(100),
    available BOOLEAN DEFAULT TRUE,
    seasonal_flag BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    proposed_by VARCHAR(255) DEFAULT 'ai_agent_assistant',
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG ĐỀ XUẤT TỐI ƯU HÓA (AI Suggestions)
CREATE TABLE IF NOT EXISTS public.ai_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    suggestion_type VARCHAR(100) NOT NULL, -- 'price_optimization', 'inventory_alert', 'menu_recommendation'
    details JSONB NOT NULL, -- Dữ liệu chi tiết về đề xuất
    status VARCHAR(50) DEFAULT 'pending', -- pending, applied, dismissed
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kích hoạt Row Level Security (RLS)
ALTER TABLE public.draft_menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_suggestions ENABLE ROW LEVEL SECURITY;

-- 3. THIẾT LẬP PHÂN QUYỀN BẢO MẬT (RLS POLICIES)
-- Kiểm tra và tạo Role 'ai_agent_assistant' nếu chưa có trong DB
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'ai_agent_assistant') THEN
        CREATE ROLE ai_agent_assistant;
    END IF;
END
$$;

-- Cấp quyền cơ bản cho role ai_agent_assistant
GRANT SELECT, INSERT, UPDATE ON public.draft_menu_items TO ai_agent_assistant;
GRANT SELECT, INSERT, UPDATE ON public.ai_suggestions TO ai_agent_assistant;
GRANT SELECT ON public.menu_items TO ai_agent_assistant;

-- RLS Policy cho draft_menu_items (AI được phép ghi đề xuất)
DROP POLICY IF EXISTS ai_agent_write_draft ON public.draft_menu_items;
CREATE POLICY ai_agent_write_draft ON public.draft_menu_items
    FOR ALL TO ai_agent_assistant
    USING (true)
    WITH CHECK (true);

-- RLS Policy cho ai_suggestions (AI được phép ghi đề xuất)
DROP POLICY IF EXISTS ai_agent_write_suggestions ON public.ai_suggestions;
CREATE POLICY ai_agent_write_suggestions ON public.ai_suggestions
    FOR ALL TO ai_agent_assistant
    USING (true)
    WITH CHECK (true);

-- RLS Policy: BẤT BIẾN - Khóa chặn cứng quyền ghi của AI trên bảng menu_items chính thức
-- (AI chỉ có quyền SELECT, mọi thay đổi INSERT/UPDATE/DELETE đều bị chặn ở mức RLS)
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ai_agent_read_only_menu ON public.menu_items;
CREATE POLICY ai_agent_read_only_menu ON public.menu_items
    FOR SELECT TO ai_agent_assistant
    USING (true);

-- Chính sách cho admin thao tác toàn quyền
DROP POLICY IF EXISTS admin_all_menu ON public.menu_items;
CREATE POLICY admin_all_menu ON public.menu_items
    FOR ALL TO postgres
    USING (true)
    WITH CHECK (true);
