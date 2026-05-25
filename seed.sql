-- ==========================================
-- DỮ LIỆU ĐĂNG KÝ BAN ĐẦU (SEED DATA) MAISON VIE
-- ĐỐI TƯỢNG HẠ TẦNG: SUPABASE POSTGRESQL
-- GIAI ĐOẠN 0: NỀN TẢNG (DATABASE & THỰC ĐƠN)
-- ==========================================

-- 1. SEED 14 NHÓM CHẤT GÂY DỊ ỨNG CHUẨN EU (Allergen Categories)
INSERT INTO allergen_categories (code, name) VALUES
('CELERY', '{"vi": "Cần tây", "en": "Celery", "fr": "Céleri"}'),
('GLUTEN', '{"vi": "Gluten (Bột mì/Lúa mạch)", "en": "Gluten", "fr": "Gluten"}'),
('CRUSTACEANS', '{"vi": "Giáp xác (Tôm/Cua)", "en": "Crustaceans", "fr": "Crustacés"}'),
('EGGS', '{"vi": "Trứng", "en": "Eggs", "fr": "Œufs"}'),
('FISH', '{"vi": "Cá", "en": "Fish", "fr": "Poissons"}'),
('LUPIN', '{"vi": "Đậu lupin (Bách nhật)", "en": "Lupin", "fr": "Lupin"}'),
('MILK', '{"vi": "Sữa & Sản phẩm từ sữa (Bơ/Phô mai)", "en": "Milk / Dairy", "fr": "Lait"}'),
('MOLLUSCS', '{"vi": "Thân mềm (Nghêu/Sò/Ốc)", "en": "Molluscs", "fr": "Mollusques"}'),
('MUSTARD', '{"vi": "Mù tạt", "en": "Mustard", "fr": "Moutarde"}'),
('NUTS', '{"vi": "Hạt cứng (Hạnh nhân/Óc chó/Dẻ)", "en": "Nuts", "fr": "Fruits à coque"}'),
('PEANUTS', '{"vi": "Đậu phộng", "en": "Peanuts", "fr": "Arachides"}'),
('SESAME', '{"vi": "Mè (Vừng)", "en": "Sesame seeds", "fr": "Graines de sésame"}'),
('SOYA', '{"vi": "Đậu nành", "en": "Soya", "fr": "Soja"}'),
('SULPHITES', '{"vi": "Lưu huỳnh điôxít (Sulphites trong rượu)", "en": "Sulphur dioxide / Sulphites", "fr": "Anhydride sulfureux"}')
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;


-- 2. SEED THỰC ĐƠN MẪU FINE DINING PHÁP CAO CẤP (menu_items)
-- Giá tính bằng VNĐ (Đã bao gồm hoặc chưa gồm phí dịch vụ, được lưu thô)
INSERT INTO menu_items (id, name, description, price_dine_in, price_takeaway, category, available, seasonal_flag) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    '{"vi": "Bò Wellington Thượng Hạng", "en": "Premium Beef Wellington", "fr": "Filet de Bœuf en Croûte Wellington"}',
    '{"vi": "Thăn nội bò Black Angus bọc trong lớp nấm duxelles, thịt xông khói prosciutto và vỏ bánh pastry nướng vàng ruộm, dùng kèm sốt truffle đen.", "en": "Black Angus beef tenderloin wrapped in puff pastry with mushroom duxelles, prosciutto, served with black truffle jus."}',
    1250000.00, 1150000.00,
    'Main Course', TRUE, FALSE
),
(
    '22222222-2222-2222-2222-222222222222',
    '{"vi": "Gan Ngỗng Áp Chảo Kiểu Pháp", "en": "Pan-Seared Foie Gras", "fr": "Foie Gras Poêlé Tradi"}',
    '{"vi": "Gan ngỗng Pháp áp chảo hoàn hảo, dùng kèm sốt giấm balsamic hương vả tây ngọt dịu và bánh mì brioche nướng bơ.", "en": "Sautéed French foie gras served with a sweet fig balsamic reduction and toasted brioche."}',
    650000.00, 600000.00,
    'Appetizer', TRUE, FALSE
),
(
    '33333333-3333-3333-3333-333333333333',
    '{"vi": "Súp Hải Sản Bouillabaisse", "en": "Classic Bouillabaisse Soup", "fr": "Bouillabaisse de Marseille"}',
    '{"vi": "Súp hải sản truyền thống kiểu Marseille với cá tầm, tôm, vẹm xanh đun trong nước dùng nghệ tây đậm đà, ăn kèm bánh mì bơ tỏi rouille.", "en": "Traditional Marseille seafood soup with fish, prawns, mussels, saffron broth, and garlic rouille."}',
    480000.00, 450000.00,
    'Soup', TRUE, FALSE
),
(
    '44444444-4444-4444-4444-444444444444',
    '{"vi": "Bánh Crème Brûlée Hương Vani Tahiti", "en": "Tahitian Vanilla Crème Brûlée", "fr": "Crème Brûlée à la Vanille de Tahiti"}',
    '{"vi": "Món tráng miệng Pháp kinh điển với lớp kem trứng mịn màng từ hương vani Tahiti tự nhiên, phủ lớp đường caramel khò giòn tan.", "en": "Rich custard base flavored with real Tahitian vanilla, topped with a texturally contrasting layer of hardened caramelized sugar."}',
    180000.00, 160000.00,
    'Dessert', TRUE, FALSE
)
ON CONFLICT (id) DO NOTHING;


-- 3. LIÊN KẾT MÓN ĂN VỚI CHẤT DỊ ỨNG ĐỂ TỰ ĐỘNG CẢNH BÁO BẾP (menu_item_allergens)
-- Bò Wellington: chứa GLUTEN (Bột mì vỏ bánh), EGGS (Quết bánh), MILK (Bơ bánh pastry)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
(
    '11111111-1111-1111-1111-111111111111', 
    (SELECT id FROM allergen_categories WHERE code = 'GLUTEN')
),
(
    '11111111-1111-1111-1111-111111111111', 
    (SELECT id FROM allergen_categories WHERE code = 'EGGS')
),
(
    '11111111-1111-1111-1111-111111111111', 
    (SELECT id FROM allergen_categories WHERE code = 'MILK')
)
ON CONFLICT DO NOTHING;

-- Gan Ngỗng Brioche: chứa GLUTEN (Bánh brioche), MILK (Bơ áp chảo)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
(
    '22222222-2222-2222-2222-222222222222', 
    (SELECT id FROM allergen_categories WHERE code = 'GLUTEN')
),
(
    '22222222-2222-2222-2222-222222222222', 
    (SELECT id FROM allergen_categories WHERE code = 'MILK')
)
ON CONFLICT DO NOTHING;

-- Súp Bouillabaisse: chứa FISH (Cá), CRUSTACEANS (Tôm), MOLLUSCS (Vẹm vỏ cứng), GLUTEN (Bánh mì tỏi)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
(
    '33333333-3333-3333-3333-333333333333', 
    (SELECT id FROM allergen_categories WHERE code = 'FISH')
),
(
    '33333333-3333-3333-3333-333333333333', 
    (SELECT id FROM allergen_categories WHERE code = 'CRUSTACEANS')
),
(
    '33333333-3333-3333-3333-333333333333', 
    (SELECT id FROM allergen_categories WHERE code = 'MOLLUSCS')
),
(
    '33333333-3333-3333-3333-333333333333', 
    (SELECT id FROM allergen_categories WHERE code = 'GLUTEN')
)
ON CONFLICT DO NOTHING;

-- Crème Brûlée: chứa EGGS (Lòng đỏ trứng kem), MILK (Kem tươi Whipping)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
(
    '44444444-4444-4444-4444-444444444444', 
    (SELECT id FROM allergen_categories WHERE code = 'EGGS')
),
(
    '44444444-4444-4444-4444-444444444444', 
    (SELECT id FROM allergen_categories WHERE code = 'MILK')
)
ON CONFLICT DO NOTHING;


-- 4. SEED RƯỢU VANG MẪU ĐỂ CHẠY LUỒNG AUTO-CROSS PAIRING
INSERT INTO wines (id, name, price_dine_in, price_takeaway, available, grape_variety, vintage, region, country, volume) VALUES
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '{"vi": "Château Margaux 2015", "en": "Château Margaux 2015", "fr": "Château Margaux Grand Cru 2015"}',
    35000000.00, 32000000.00, TRUE,
    'Cabernet Sauvignon / Merlot', 2015,
    'Bordeaux - Margaux', 'France', '750ml'
),
(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '{"vi": "Pouilly-Fuissé Tête de Cru 2020", "en": "Pouilly-Fuissé Tête de Cru 2020", "fr": "Pouilly-Fuissé Tête de Cru Blanc"}',
    2800000.00, 2400000.00, TRUE,
    'Chardonnay', 2020,
    'Burgundy - Fuissé', 'France', '750ml'
)
ON CONFLICT (id) DO NOTHING;
