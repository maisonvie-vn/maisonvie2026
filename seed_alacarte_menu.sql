-- =========================================================================
-- SQL SEED SCRIPT: THỰC ĐƠN À LA CARTE ĐA NGỮ (PHÁP - ANH - VIỆT) MAISON VIE
-- ĐỐI TƯỢNG: SUPABASE POSTGRESQL TABLE 'menu_items' & 'menu_item_allergens'
-- =========================================================================

-- ⚠️ XÓA TOÀN BỘ dữ liệu menu cũ (mọi UUID, mọi bộ seed trước đó)
DELETE FROM menu_item_allergens;
DELETE FROM menu_items;

-- 1. NẠP MÓN ĂN À LA CARTE (menu_items)
-- Cú pháp đa ngữ JSONB: {"fr": "...", "en": "...", "vi": "..."}
INSERT INTO menu_items (id, name, description, price_dine_in, price_takeaway, category, available, seasonal_flag) VALUES

-- A. KHAI VỊ (Appetizer)
(
    '22222222-2222-2222-2222-222222222222',
    '{"fr": "Foie Gras Poêlé aux Figues", "en": "Pan-Seared Foie Gras with Figs", "vi": "Gan Ngỗng Pháp Áp Chảo Sốt Vả Tây"}',
    '{"fr": "Foie gras de canard poêlé, compotée de figues, brioche dorée au beurre.", "en": "Pan-seared duck foie gras served with warm fig compote and toasted buttery brioche.", "vi": "Gan ngỗng Pháp áp chảo hoàn hảo, dùng kèm sốt giấm balsamic hương vả tây ngọt dịu và bánh mì brioche nướng bơ."}',
    650000.00, 0.00, 'Appetizer', TRUE, FALSE
),
(
    'a1111111-1111-1111-1111-111111111111',
    '{"fr": "Escargots de Bourgogne", "en": "Burgundy Snails in Garlic Butter", "vi": "Ốc Sên Nướng Bơ Tỏi Burgundy"}',
    '{"fr": "Escargots sauvages de Bourgogne cuits dans leur coquille au beurre d''ail et persil.", "en": "Wild Burgundy snails baked in shells with rich garlic, parsley, and French butter.", "vi": "Ốc sên hoang dã vùng Bourgogne đút lò trong vỏ với bơ lạt Pháp, tỏi và ngò tây băm nhuyễn thơm nồng."}',
    350000.00, 0.00, 'Appetizer', TRUE, FALSE
),
(
    'a2222222-2222-2222-2222-222222222222',
    '{"fr": "Tartare de Saumon à l''Avocat", "en": "Salmon Tartare with Avocado", "vi": "Gỏi Cá Hồi Kèm Bơ Quả"}',
    '{"fr": "Saumon frais coupé au couteau, avocat acidulé, vinaigrette aux agrumes.", "en": "Hand-cut fresh salmon tartare layered with seasoned avocado and citrus vinaigrette.", "vi": "Cá hồi tươi thái hạt lựu trộn dầu giấm chanh bưởi tươi mát, xếp lớp trên bơ quả nghiền béo ngậy."}',
    320000.00, 0.00, 'Appetizer', TRUE, FALSE
),

-- B. SÚP KINH ĐIỂN (Soup)
(
    '33333333-3333-3333-3333-333333333333',
    '{"fr": "Bouillabaisse de Marseille", "en": "Classic Bouillabaisse Soup", "vi": "Súp Hải Sản Bouillabaisse Marseille"}',
    '{"fr": "Soupe de poisson traditionnelle marseillaise avec rouille et croûtons ailés.", "en": "Traditional Marseille seafood soup in rich saffron broth with garlic rouille and croutons.", "vi": "Súp hải sản truyền thống kiểu Marseille với cá tầm, tôm, vẹm xanh đun trong nước dùng nghệ tây đậm đà, ăn kèm bánh mì bơ tỏi rouille."}',
    480000.00, 0.00, 'Soup', TRUE, FALSE
),
(
    's1111111-1111-1111-1111-111111111111',
    '{"fr": "Soupe à l''Oignon Gratinée", "en": "French Onion Soup", "vi": "Súp Hành Tây Cổ Điển Đút Lò"}',
    '{"fr": "Soupe d''oignons caramélisés, bouillon de bœuf, croûton de pain et fromage Gruyère fondu.", "en": "Sweet caramelized onion broth with beef stock, toasted bread slice, and melted Gruyere cheese.", "vi": "Súp hành tây hầm ngọt lịm từ nước dùng xương bò, phủ bánh mì nướng và phô mai Gruyère đút lò chảy giòn."}',
    220000.00, 0.00, 'Soup', TRUE, FALSE
),
(
    's2222222-2222-2222-2222-222222222222',
    '{"fr": "Velouté de Champignons aux Truffes", "en": "Mushroom Cream Soup with Truffle", "vi": "Súp Kem Nấm Hương Vị Truffle"}',
    '{"fr": "Crème veloutée de champignons des bois parfumée à l''huile de truffe noire.", "en": "Smooth wild forest mushroom cream soup drizzled with premium black truffle oil.", "vi": "Súp kem sánh mịn chế biến từ các loại nấm rừng tự nhiên, dậy mùi hương quý phái của dầu nấm Truffle đen."}',
    250000.00, 0.00, 'Soup', TRUE, FALSE
),

-- C. MÓN CHÍNH (Main Course)
(
    '11111111-1111-1111-1111-111111111111',
    '{"fr": "Filet de Bœuf en Croûte Wellington", "en": "Premium Beef Wellington", "vi": "Thăn Bò Wellington Thượng Hạng"}',
    '{"fr": "Filet de bœuf Angus en feuilletage, duxelles de champignons de Paris et truffe.", "en": "Premium Black Angus beef tenderloin wrapped in flaky pastry with mushroom duxelles and truffle jus.", "vi": "Thăn nội bò Black Angus bọc trong lớp nấm duxelles, thịt xông khói prosciutto và vỏ bánh pastry nướng vàng ruộm, dùng kèm sốt truffle đen."}',
    1250000.00, 0.00, 'Main Course', TRUE, FALSE
),
(
    'm1111111-1111-1111-1111-111111111111',
    '{"fr": "Canard à l''Orange", "en": "Classic Duck à l''Orange", "vi": "Vịt Sốt Cam Kiểu Pháp Cổ Điển"}',
    '{"fr": "Magret de canard rôti, sauce bigarade à l''orange douce et purée de pommes de terre.", "en": "Pan-roasted French duck breast served with sweet-tangy orange reduction and potato purée.", "vi": "Ức vịt Pháp áp chảo da giòn rụm, rưới sốt cam mật ong ngọt chua hài hòa, ăn kèm khoai tây nghiền mịn."}',
    580000.00, 0.00, 'Main Course', TRUE, FALSE
),
(
    'm2222222-2222-2222-2222-222222222222',
    '{"fr": "Filet de Bar de Ligne", "en": "Pan-Seared Sea Bass", "vi": "Cá Chẽm Áp Chảo Sốt Bơ Chanh"}',
    '{"fr": "Filet de bar rôti sur peau, légumes de saison, émulsion beurre blanc au citron.", "en": "Crispy skin sea bass fillet, seasonal baby vegetables, lemon-butter white wine emulsion.", "vi": "Fillet cá chẽm áp chảo giòn da, dùng kèm rau củ hữu cơ theo mùa và sốt bơ chanh trắng thơm béo."}',
    520000.00, 0.00, 'Main Course', TRUE, FALSE
),
(
    'm3333333-3333-3333-3333-333333333333',
    '{"fr": "Coq au Vin", "en": "Slow-Braised Chicken in Red Wine", "vi": "Gà Om Vang Đỏ Kiểu Pháp"}',
    '{"fr": "Mijoté de coq au vin rouge de Bourgogne, champignons, lardons và petits oignons.", "en": "Classic Burgundy red wine braised chicken leg with mushrooms, bacon lardons, and pearl onions.", "vi": "Đùi gà tơ om chậm trong rượu vang đỏ Bourgogne đậm đà với nấm mỡ, thịt ba chỉ xông khói và hành củ."}',
    450000.00, 0.00, 'Main Course', TRUE, FALSE
),

-- D. MÓN TRÁNG MIỆNG (Dessert)
(
    '44444444-4444-4444-4444-444444444444',
    '{"fr": "Crème Brûlée à la Vanille de Tahiti", "en": "Tahitian Vanilla Crème Brûlée", "vi": "Bánh Crème Brûlée Hương Vani Tahiti"}',
    '{"fr": "Crème brûlée à la vanille naturelle de Tahiti, caramel craquant khò chaud.", "en": "Rich custard base infused with natural Tahitian vanilla bean, topped with hard caramel layer.", "vi": "Món tráng miệng Pháp kinh điển với lớp kem trứng mịn màng từ hương vani Tahiti tự nhiên, phủ lớp đường caramel khò giòn tan."}',
    180000.00, 0.00, 'Dessert', TRUE, FALSE
),
(
    'd1111111-1111-1111-1111-111111111111',
    '{"fr": "Fondant au Chocolat", "en": "Lava Chocolate Cake", "vi": "Bánh Sô-cô-la Tan Chảy Kèm Kem"}',
    '{"fr": "Fondant au chocolat noir Guanaja 70%, cœur coulant, glace vanille artisanale.", "en": "Warm dark chocolate cake with lava center, served with homemade artisan vanilla ice cream.", "vi": "Bánh sô-cô-la đen Guanaja 70% nướng chảy nhân ấm áp, dùng kèm một viên kem vani lạnh thủ công."}',
    190000.00, 0.00, 'Dessert', TRUE, FALSE
),
(
    'd2222222-2222-2222-2222-222222222222',
    '{"fr": "Tarte Tatin aux Pommes", "en": "Caramelized Apple Tarte Tatin", "vi": "Bánh Táo Nướng Úp Ngược Tatin"}',
    '{"fr": "Tarte renversée aux pommes caramélisées au beurre d''Isigny, crème fraîche normande.", "en": "Upside-down caramelized apple tart with Isigny butter, served with double cream.", "vi": "Bánh táo nướng úp ngược truyền thống Pháp, táo chín caramel hóa với bơ Isigny, dùng kèm kem tươi."}',
    170000.00, 0.00, 'Dessert', TRUE, FALSE
);

-- =========================================================================
-- 2. LIÊN KẾT MÓN ĂN VỚI CHẤT DỊ ỨNG (menu_item_allergens)
-- Đối chiếu mã code chuẩn EU để tự động đưa ra cảnh báo cho khách hàng
-- =========================================================================

-- Gan Ngỗng: Gluten (Bánh mì brioche), Milk (Bơ áp chảo)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
('22222222-2222-2222-2222-222222222222', (SELECT id FROM allergen_categories WHERE code = 'GLUTEN')),
('22222222-2222-2222-2222-222222222222', (SELECT id FROM allergen_categories WHERE code = 'MILK'));

-- Ốc Sên: Milk (Bơ nướng), Nuts (Hạt gia vị)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
('a1111111-1111-1111-1111-111111111111', (SELECT id FROM allergen_categories WHERE code = 'MILK'));

-- Salmon Tartare: Fish (Cá hồi)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
('a2222222-2222-2222-2222-222222222222', (SELECT id FROM allergen_categories WHERE code = 'FISH'));

-- Súp Bouillabaisse: Fish (Cá tầm), Crustaceans (Tôm), Molluscs (Vẹm), Gluten (Bánh mì tỏi)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
('33333333-3333-3333-3333-333333333333', (SELECT id FROM allergen_categories WHERE code = 'FISH')),
('33333333-3333-3333-3333-333333333333', (SELECT id FROM allergen_categories WHERE code = 'CRUSTACEANS')),
('33333333-3333-3333-3333-333333333333', (SELECT id FROM allergen_categories WHERE code = 'MOLLUSCS')),
('33333333-3333-3333-3333-333333333333', (SELECT id FROM allergen_categories WHERE code = 'GLUTEN'));

-- Súp Hành Tây: Gluten (Croutons), Milk (Phô mai Gruyere)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
('s1111111-1111-1111-1111-111111111111', (SELECT id FROM allergen_categories WHERE code = 'GLUTEN')),
('s1111111-1111-1111-1111-111111111111', (SELECT id FROM allergen_categories WHERE code = 'MILK'));

-- Súp Kem Nấm: Milk (Kem tươi), Celery (Cần tây nấu nước dùng)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
('s2222222-2222-2222-2222-222222222222', (SELECT id FROM allergen_categories WHERE code = 'MILK')),
('s2222222-2222-2222-2222-222222222222', (SELECT id FROM allergen_categories WHERE code = 'CELERY'));

-- Bò Wellington: Gluten (Vỏ bánh), Eggs (Quết bánh), Milk (Bơ bánh pastry)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
('11111111-1111-1111-1111-111111111111', (SELECT id FROM allergen_categories WHERE code = 'GLUTEN')),
('11111111-1111-1111-1111-111111111111', (SELECT id FROM allergen_categories WHERE code = 'EGGS')),
('11111111-1111-1111-1111-111111111111', (SELECT id FROM allergen_categories WHERE code = 'MILK'));

-- Vịt Sốt Cam: Milk (Khoai tây nghiền bơ)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
('m1111111-1111-1111-1111-111111111111', (SELECT id FROM allergen_categories WHERE code = 'MILK'));

-- Cá Chẽm Áp Chảo: Fish (Cá chẽm), Milk (Sốt bơ chanh white wine)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
('m2222222-2222-2222-2222-222222222222', (SELECT id FROM allergen_categories WHERE code = 'FISH')),
('m2222222-2222-2222-2222-222222222222', (SELECT id FROM allergen_categories WHERE code = 'MILK'));

-- Gà Om Vang Đỏ: Sulphites (Trong rượu vang Bourgogne)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
('m3333333-3333-3333-3333-333333333333', (SELECT id FROM allergen_categories WHERE code = 'SULPHITES'));

-- Crème Brûlée: Eggs (Trứng kem), Milk (Dairy)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
('44444444-4444-4444-4444-444444444444', (SELECT id FROM allergen_categories WHERE code = 'EGGS')),
('44444444-4444-4444-4444-444444444444', (SELECT id FROM allergen_categories WHERE code = 'MILK'));

-- Chocolate Fondant: Eggs (Trứng), Milk (Bơ sô-cô-la), Gluten (Bột mì)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
('d1111111-1111-1111-1111-111111111111', (SELECT id FROM allergen_categories WHERE code = 'EGGS')),
('d1111111-1111-1111-1111-111111111111', (SELECT id FROM allergen_categories WHERE code = 'MILK')),
('d1111111-1111-1111-1111-111111111111', (SELECT id FROM allergen_categories WHERE code = 'GLUTEN'));

-- Tarte Tatin: Gluten (Đế bánh pastry), Milk (Bơ đút lò)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
('d2222222-2222-2222-2222-222222222222', (SELECT id FROM allergen_categories WHERE code = 'GLUTEN')),
('d2222222-2222-2222-2222-222222222222', (SELECT id FROM allergen_categories WHERE code = 'MILK'));
