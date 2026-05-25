-- ==========================================
-- SCHEMA CƠ SỞ DỮ LIỆU DỰ ÁN MAISON VIE (2026)
-- ĐỐI TƯỢNG HẠ TẦNG: SUPABASE POSTGRESQL (3NF)
-- GIAI ĐOẠN 0 & GIAI ĐOẠN 1
-- ==========================================

-- Kích hoạt các tiện ích mở rộng cần thiết
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. BẢNG DANH MỤC CHẤT DỊ ỨNG (14 nhóm chuẩn EU)
CREATE TABLE IF NOT EXISTS allergen_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name JSONB NOT NULL, -- Đa ngôn ngữ: {"vi": "...", "en": "..."}
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG DANH MỤC MÓN ĂN (MENU ITEMS)
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name JSONB NOT NULL, -- Đa ngôn ngữ: {"vi": "...", "en": "...", "fr": "..."}
    description JSONB, -- Đa ngôn ngữ
    price_dine_in NUMERIC(12, 2) NOT NULL CHECK (price_dine_in >= 0),
    price_takeaway NUMERIC(12, 2) NOT NULL CHECK (price_takeaway >= 0),
    category VARCHAR(100) NOT NULL, -- Appetizer, Main Course, Dessert, Side dish
    available BOOLEAN DEFAULT TRUE,
    seasonal_flag BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG TRUNG GIAN MÓN ĂN - CHẤT DỊ ỨNG (Menu Item Allergens)
CREATE TABLE IF NOT EXISTS menu_item_allergens (
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    allergen_id UUID REFERENCES allergen_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (menu_item_id, allergen_id)
);

-- 4. BẢNG DANH MỤC RƯỢU VANG (WINES)
CREATE TABLE IF NOT EXISTS wines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name JSONB NOT NULL, -- Đa ngôn ngữ
    price_dine_in NUMERIC(12, 2) NOT NULL CHECK (price_dine_in >= 0),
    price_takeaway NUMERIC(12, 2) NOT NULL CHECK (price_takeaway >= 0),
    available BOOLEAN DEFAULT TRUE,
    grape_variety VARCHAR(100),
    vintage INTEGER CHECK (vintage >= 1800 AND vintage <= 2100),
    region VARCHAR(100),
    country VARCHAR(100),
    volume VARCHAR(20) DEFAULT '750ml',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BẢNG THÔNG TIN KHÁCH HÀNG (CUSTOMERS - Có mã hóa dị ứng)
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) UNIQUE,
    email VARCHAR(255),
    vip_level INTEGER DEFAULT 1 CHECK (vip_level IN (1, 2, 3)), -- 1: Thường, 2: VIP, 3: Thượng khách tuyệt mật (Confidential)
    allergen_pref UUID[], -- Mảng lưu các allergen_id được chọn
    allergen_notes TEXT, -- Nội dung nhạy cảm, sẽ được mã hóa đối xứng AES-256 ở tầng backend
    consent_at TIMESTAMPTZ DEFAULT NOW(), -- Ghi vết đồng ý cung cấp dữ liệu theo Nghị định 13
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BẢNG ĐƠN ĐẶT BÀN (RESERVATIONS - Chống Overbooking & No-show)
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    guest_name VARCHAR(255) NOT NULL,
    guest_phone VARCHAR(50) NOT NULL,
    guest_email VARCHAR(255),
    guest_count INTEGER NOT NULL CHECK (guest_count > 0),
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    table_id VARCHAR(100), -- ID bàn gán trên Sơ đồ 2D
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, active, completed, cancelled, expired, B2B_Confirmed, B2B_Prep_Authorized
    deposit_status VARCHAR(50) DEFAULT 'none', -- none, pending_payment, paid, refunded, penalized
    deposit_amount NUMERIC(12, 2) DEFAULT 0 CHECK (deposit_amount >= 0),
    language VARCHAR(10) DEFAULT 'vi',
    allergen_warnings UUID[], -- Tự động đối chiếu chất dị ứng để cảnh báo
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. BẢNG BÀI VIẾT BLOG TRUYỀN THÔNG (POSTS - Chuẩn SEO)
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title JSONB NOT NULL, -- Đa ngôn ngữ
    content JSONB NOT NULL, -- Đa ngôn ngữ
    featured_image VARCHAR(512),
    seo_title VARCHAR(255),
    seo_desc VARCHAR(512),
    seo_keywords VARCHAR(255),
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. BẢNG TUYỂN DỤNG (JOBS)
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title JSONB NOT NULL,
    description JSONB NOT NULL,
    requirements JSONB NOT NULL,
    salary_range VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. BẢNG HỒ SƠ ỨNG VIÊN (JOB APPLICATIONS - Lưu CV an toàn)
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    applicant_name VARCHAR(255) NOT NULL,
    applicant_phone VARCHAR(50) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    cv_file_url VARCHAR(512) NOT NULL, -- Link lưu trong Supabase Storage private bucket
    status VARCHAR(50) DEFAULT 'applied', -- applied, reviewing, interviewed, hired, rejected
    applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. HỆ THỐNG GHI VẾT AN NINH TOÀN CỰC (AUDIT LOGS)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID, -- Lưu ID của nhân viên thao tác (liên kết auth.users của Supabase)
    action VARCHAR(50) NOT NULL, -- INSERT, UPDATE, DELETE
    table_name VARCHAR(100) NOT NULL,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. NHẬT KÝ GIẢI MÃ THÔNG TIN KHÁCH VIP (VIP PRIVACY ACCESS LOGS)
CREATE TABLE IF NOT EXISTS vip_access_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID NOT NULL, -- Nhân viên thực hiện giải mã
    actor_name VARCHAR(255) NOT NULL,
    vip_customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    accessed_at TIMESTAMPTZ DEFAULT NOW(),
    device_info TEXT,
    ip_address VARCHAR(50)
);

-- 12. NHẬT KÝ CHUỖI LẠNH IOT (COLD CHAIN TELEMETRY LOGS)
CREATE TABLE IF NOT EXISTS cold_chain_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sensor_id VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL, -- Tủ mát 1, Tủ đông 2, Hầm rượu VIP
    temperature NUMERIC(5, 2) NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. NHẬT KÝ KHUI RƯỢU VANG MỞ DỞ TẠI BAR (OPENED BOTTLES LOG)
CREATE TABLE IF NOT EXISTS opened_bottles_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wine_id UUID REFERENCES wines(id) ON DELETE CASCADE,
    opened_at TIMESTAMPTZ DEFAULT NOW(),
    expiry_at TIMESTAMPTZ NOT NULL, -- Cảnh báo oxi hóa sau 72h hoặc 14 ngày (khí Argon)
    remaining_volume_ml NUMERIC(6, 2) NOT NULL,
    cork_method VARCHAR(50) DEFAULT 'standard' -- standard, coravin_argon
);

-- 14. BẢNG GHI NHẬN ĐỔ VỠ / THẤT THOÁT TÀI SẢN (SPOILAGE LOGS)
CREATE TABLE IF NOT EXISTS spoilage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_name VARCHAR(255) NOT NULL,
    item_code VARCHAR(100) NOT NULL, -- Mã QR/RFID của ly pha lê, đĩa mạ bạc...
    item_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    image_url VARCHAR(512), -- Link ảnh hiện trường hiện vật vỡ
    reason TEXT,
    reported_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- CƠ CHẾ TRIGGER TỰ ĐỘNG GHI VẾT AUDIT LOG (POSTGRES FUNCTIONS)
-- ==========================================

CREATE OR REPLACE FUNCTION process_audit_log()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_logs(action, table_name, record_id, old_data, new_data)
        VALUES('DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD), NULL);
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_logs(action, table_name, record_id, old_data, new_data)
        VALUES('UPDATE', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_logs(action, table_name, record_id, old_data, new_data)
        VALUES('INSERT', TG_TABLE_NAME, NEW.id, NULL, to_jsonb(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Gán Trigger tự động ghi vết cho các bảng trọng yếu nhạy cảm
CREATE TRIGGER audit_customers_trigger
AFTER INSERT OR UPDATE OR DELETE ON customers
FOR EACH ROW EXECUTE FUNCTION process_audit_log();

CREATE TRIGGER audit_reservations_trigger
AFTER INSERT OR UPDATE OR DELETE ON reservations
FOR EACH ROW EXECUTE FUNCTION process_audit_log();

CREATE TRIGGER audit_menu_items_trigger
AFTER INSERT OR UPDATE OR DELETE ON menu_items
FOR EACH ROW EXECUTE FUNCTION process_audit_log();

CREATE TRIGGER audit_wines_trigger
AFTER INSERT OR UPDATE OR DELETE ON wines
FOR EACH ROW EXECUTE FUNCTION process_audit_log();
