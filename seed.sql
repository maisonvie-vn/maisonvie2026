-- ==========================================
-- DỮ LIỆU THỰC ĐƠN À LA CARTE - MAISON VIE (2026)
-- GIÁ TƯỢNG TRƯNG - Quý khách cập nhật giá thực tế sau
-- ĐỐI TƯỢNG HẠ TẦNG: SUPABASE POSTGRESQL
-- ==========================================

-- 1. SEED 14 NHÓM CHẤT GÂY DỊ ỨNG CHUẨN EU (Allergen Categories)
INSERT INTO allergen_categories (code, name) VALUES
('CELERY',     '{"vi": "Cần tây", "en": "Celery", "fr": "Céleri"}'),
('GLUTEN',     '{"vi": "Gluten (Bột mì/Lúa mạch)", "en": "Gluten", "fr": "Gluten"}'),
('CRUSTACEANS','{"vi": "Giáp xác (Tôm/Cua)", "en": "Crustaceans", "fr": "Crustacés"}'),
('EGGS',       '{"vi": "Trứng", "en": "Eggs", "fr": "Œufs"}'),
('FISH',       '{"vi": "Cá", "en": "Fish", "fr": "Poissons"}'),
('LUPIN',      '{"vi": "Đậu lupin (Bách nhật)", "en": "Lupin", "fr": "Lupin"}'),
('MILK',       '{"vi": "Sữa & Sản phẩm từ sữa (Bơ/Phô mai)", "en": "Milk / Dairy", "fr": "Lait"}'),
('MOLLUSCS',   '{"vi": "Thân mềm (Nghêu/Sò/Ốc)", "en": "Molluscs", "fr": "Mollusques"}'),
('MUSTARD',    '{"vi": "Mù tạt", "en": "Mustard", "fr": "Moutarde"}'),
('NUTS',       '{"vi": "Hạt cứng (Hạnh nhân/Óc chó/Dẻ)", "en": "Nuts", "fr": "Fruits à coque"}'),
('PEANUTS',    '{"vi": "Đậu phộng", "en": "Peanuts", "fr": "Arachides"}'),
('SESAME',     '{"vi": "Mè (Vừng)", "en": "Sesame seeds", "fr": "Graines de sésame"}'),
('SOYA',       '{"vi": "Đậu nành", "en": "Soya", "fr": "Soja"}'),
('SULPHITES',  '{"vi": "Lưu huỳnh điôxít (Sulphites trong rượu)", "en": "Sulphur dioxide / Sulphites", "fr": "Anhydride sulfureux"}')
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;


-- ==========================================
-- 2. THỰC ĐƠN À LA CARTE (menu_items)
--    GIÁ TƯỢNG TRƯNG — Cập nhật price_dine_in khi sẵn sàng
--    price_takeaway = 0 (không cung cấp mang về theo yêu cầu)
-- ==========================================

-- ---- KHAI VỊ (Appetizers) ----
INSERT INTO menu_items (id, name, description, price_dine_in, price_takeaway, category, available, seasonal_flag) VALUES
(
  'a1000001-0000-0000-0000-000000000001',
  '{"fr": "Foie Gras Poêlé aux Figues", "en": "Pan-Seared Foie Gras with Figs", "vi": "Gan Ngỗng Pháp Áp Chảo Sốt Vả Tây"}',
  '{"fr": "Foie gras de canard poêlé, compotée de figues fraîches, réduction balsamique et brioche dorée au beurre.", "en": "Seared French duck foie gras with sweet fig compote, aged balsamic reduction and toasted butter brioche.", "vi": "Gan ngỗng Pháp áp chảo hoàn hảo, dùng kèm sốt giấm balsamic hương vả tây ngọt dịu và bánh mì brioche nướng bơ thơm phức."}',
  650000.00, 0.00, 'Appetizer', TRUE, FALSE
),
(
  'a1000001-0000-0000-0000-000000000002',
  '{"fr": "Tartare de Saumon à l''Aneth", "en": "Salmon Tartare with Dill & Capers", "vi": "Cá Hồi Tartare Tươi Với Thì Là & Cáp"}',
  '{"fr": "Saumon sauvage coupé au couteau, aneth frais, câpres, zeste de citron, crème fraîche et toast melba.", "en": "Hand-cut wild salmon with fresh dill, capers, lemon zest, crème fraîche and melba toast.", "vi": "Cá hồi hoang dã thái bằng tay, kết hợp thì là tươi, nụ cáp, vỏ chanh, kem tươi và bánh melba giòn."}',
  480000.00, 0.00, 'Appetizer', TRUE, FALSE
),
(
  'a1000001-0000-0000-0000-000000000003',
  '{"fr": "Carpaccio de Bœuf Angus & Truffe", "en": "Angus Beef Carpaccio with Truffle", "vi": "Bò Angus Carpaccio Phủ Nấm Truffle"}',
  '{"fr": "Fines tranches de bœuf Angus, copeaux de truffe noire, roquette, parmesan 24 mois et huile d''olive AOC.", "en": "Paper-thin Angus beef slices with shaved black truffle, wild rocket, aged Parmigiano and AOC olive oil.", "vi": "Lát bò Angus thái mỏng phủ truffle đen, rau rocket, phô mai Parmigiano 24 tháng và dầu ô liu AOC thượng hạng."}',
  560000.00, 0.00, 'Appetizer', TRUE, FALSE
),
(
  'a1000001-0000-0000-0000-000000000004',
  '{"fr": "Escargots de Bourgogne au Beurre Persillé", "en": "Burgundy Snails with Herb Butter", "vi": "Ốc Sên Burgundy Sốt Bơ Thảo Mộc"}',
  '{"fr": "Six escargots de Bourgogne dans leur coquille, nappés de beurre à l''ail, au persil et à l''échalote.", "en": "Six Burgundy snails baked in shell with classic garlic-parsley-shallot herb butter, served with baguette.", "vi": "Sáu con ốc sên Burgundy nướng trong vỏ với bơ tỏi, mùi tây và hành phi đặc trưng, ăn kèm bánh mì baguette."}',
  420000.00, 0.00, 'Appetizer', TRUE, FALSE
),

-- ---- SÚP KINH ĐIỂN (Soups) ----
(
  'a2000002-0000-0000-0000-000000000001',
  '{"fr": "Bouillabaisse de Marseille", "en": "Classic Marseille Bouillabaisse", "vi": "Súp Hải Sản Bouillabaisse Marseille"}',
  '{"fr": "Soupe de poisson traditionnelle provençale avec filets de sole, crevettes, moules, bouillon au safran, rouille et croûtons.", "en": "Traditional Provençal fish soup with sole fillets, prawns, mussels, saffron broth, garlic rouille and croutons.", "vi": "Súp hải sản truyền thống vùng Provence với cá sole, tôm hùm, vẹm xanh trong nước dùng nghệ tây đậm đà, ăn kèm bánh mì bơ tỏi rouille."}',
  480000.00, 0.00, 'Soup', TRUE, FALSE
),
(
  'a2000002-0000-0000-0000-000000000002',
  '{"fr": "Velouté de Champignons Sauvages & Truffe", "en": "Wild Mushroom Velouté with Truffle Oil", "vi": "Súp Kem Nấm Rừng & Dầu Truffle"}',
  '{"fr": "Velouté soyeux de champignons sauvages des bois (cèpes, girolles), crème fraîche et quelques gouttes d''huile de truffe noire.", "en": "Silky wild mushroom velouté (porcini & chanterelle) with crème fraîche and a drizzle of aged black truffle oil.", "vi": "Súp kem mịn màng từ nấm rừng (cèpe và girolle), kem tươi Pháp và vài giọt dầu truffle đen cô đặc."}',
  380000.00, 0.00, 'Soup', TRUE, FALSE
),
(
  'a2000002-0000-0000-0000-000000000003',
  '{"fr": "Soupe à l''Oignon Gratinée", "en": "French Onion Soup au Gratin", "vi": "Súp Hành Tây Pháp Phủ Phô Mai"}',
  '{"fr": "Soupe à l''oignon caramélisé en bouillon de bœuf, couverte d''un croûton gratiné au fromage Comté fondu.", "en": "Caramelized onion soup in rich beef broth, topped with rustic crouton and melted Comté cheese gratin.", "vi": "Súp hành tây caramel hóa trong nước dùng bò đậm đà, phủ bánh mì giòn và phô mai Comté tan chảy vàng óng."}',
  350000.00, 0.00, 'Soup', TRUE, FALSE
),

-- ---- MÓN CHÍNH (Main Courses) ----
(
  'a3000003-0000-0000-0000-000000000001',
  '{"fr": "Filet de Bœuf en Croûte Wellington", "en": "Premium Beef Wellington", "vi": "Thăn Bò Wellington Thượng Hạng"}',
  '{"fr": "Filet de bœuf Black Angus enrobé de duxelles de champignons, prosciutto di Parma et feuilletage doré, jus de truffe.", "en": "Black Angus beef tenderloin wrapped in mushroom duxelles, Parma prosciutto and golden puff pastry, with black truffle jus.", "vi": "Thăn nội bò Black Angus bọc trong lớp nấm duxelles, prosciutto Parma và vỏ bánh pastry nướng vàng ruộm, dùng kèm sốt truffle đen."}',
  1250000.00, 0.00, 'Main Course', TRUE, FALSE
),
(
  'a3000003-0000-0000-0000-000000000002',
  '{"fr": "Magret de Canard Rôti à l''Orange", "en": "Roasted Duck Breast with Orange Sauce", "vi": "Lườn Vịt Áp Chảo Sốt Cam Pháp"}',
  '{"fr": "Magret de canard du Périgord rôti rosé, sauce à l''orange amère et grand marnier, purée de patates douces.", "en": "Périgord duck breast roasted medium-rare, bitter orange & Grand Marnier sauce, sweet potato purée.", "vi": "Ức vịt Périgord áp chảo tái hồng, sốt cam đắng và Grand Marnier, ăn kèm khoai lang nghiền bơ mịn."}',
  850000.00, 0.00, 'Main Course', TRUE, FALSE
),
(
  'a3000003-0000-0000-0000-000000000003',
  '{"fr": "Filet de Sole Meunière au Beurre Citron", "en": "Sole Meunière with Lemon Brown Butter", "vi": "Cá Sole Chiên Bơ Sốt Chanh Kiểu Pháp"}',
  '{"fr": "Filet de sole entier à la meunière, beurre noisette au citron et câpres, haricots verts fins et pommes vapeur.", "en": "Whole sole fillet pan-fried in classic meunière style, lemon-caper brown butter, fine beans and steamed potatoes.", "vi": "Cá sole nguyên philê chiên bơ kiểu Pháp chuẩn mực, sốt bơ nâu chanh và cáp, ăn kèm đậu xanh mịn và khoai hấp."}',
  780000.00, 0.00, 'Main Course', TRUE, FALSE
),
(
  'a3000003-0000-0000-0000-000000000004',
  '{"fr": "Côtelettes d''Agneau Provençale", "en": "Rack of Lamb Provençale", "vi": "Sườn Cừu Nướng Kiểu Provence"}',
  '{"fr": "Carré d''agneau rôti en croûte de pistaches et herbes de Provence, jus d''agneau réduit, gratin dauphinois.", "en": "Rack of lamb in pistachio and Provençal herb crust, reduced lamb jus and classic dauphinois gratin.", "vi": "Sườn cừu nướng trong lớp hạt dẻ cười và thảo mộc Provence, nước dùng cừu cô đặc và khoai tây dauphinois thượng hạng."}',
  1100000.00, 0.00, 'Main Course', TRUE, FALSE
),
(
  'a3000003-0000-0000-0000-000000000005',
  '{"fr": "Homard Grillé Beurre Blanc & Ciboulette", "en": "Grilled Lobster with Beurre Blanc", "vi": "Tôm Hùm Nướng Sốt Beurre Blanc"}',
  '{"fr": "Demi-homard breton grillé au four, sauce beurre blanc au champagne et ciboulette fraîche, riz pilaf au safran.", "en": "Brittany half-lobster oven-grilled with champagne beurre blanc, fresh chives and saffron pilaf rice.", "vi": "Nửa con tôm hùm Brittany nướng lò với sốt beurre blanc Champagne, hẹ tươi và cơm pilaf nghệ tây."}',
  1850000.00, 0.00, 'Main Course', TRUE, FALSE
),
(
  'a3000003-0000-0000-0000-000000000006',
  '{"fr": "Risotto aux Cèpes & Parmesan 24 Mois", "en": "Wild Porcini Risotto with Aged Parmesan", "vi": "Cơm Risotto Nấm Cèpe & Phô Mai Già 24 Tháng"}',
  '{"fr": "Risotto crémeux aux cèpes de Bordeaux, parmesan affiné 24 mois, beurre AOP et huile de truffe blanche.", "en": "Creamy Bordeaux porcini risotto finished with 24-month aged Parmesan, AOP butter and white truffle oil.", "vi": "Cơm risotto sánh mịn từ nấm cèpe Bordeaux, phô mai Parmesan già 24 tháng, bơ AOP và dầu truffle trắng tinh tế."}',
  680000.00, 0.00, 'Main Course', TRUE, FALSE
),

-- ---- TRÁNG MIỆNG (Desserts) ----
(
  'a4000004-0000-0000-0000-000000000001',
  '{"fr": "Crème Brûlée à la Vanille de Tahiti", "en": "Tahitian Vanilla Crème Brûlée", "vi": "Bánh Crème Brûlée Hương Vani Tahiti"}',
  '{"fr": "Crème brûlée onctueuse infusée à la vanille naturelle de Tahiti, caramel croustillant réalisé à la flamme.", "en": "Silky custard base infused with genuine Tahitian vanilla pod, finished with a crisp caramel brûlée crust.", "vi": "Kem trứng mịn màng thấm đẫm hương vani Tahiti tự nhiên, phủ lớp đường caramel giòn tan khò trực tiếp."}',
  180000.00, 0.00, 'Dessert', TRUE, FALSE
),
(
  'a4000004-0000-0000-0000-000000000002',
  '{"fr": "Mousse au Chocolat Grand Cru 70%", "en": "Grand Cru 70% Dark Chocolate Mousse", "vi": "Mousse Sô-cô-la Grand Cru 70% Cacao"}',
  '{"fr": "Mousse légère au chocolat noir grand cru Valrhona 70%, biscuit financier amandes et tuile de pralin.", "en": "Airy Valrhona 70% dark chocolate mousse, almond financier sponge and praline tuile.", "vi": "Mousse nhẹ bồng từ sô-cô-la đen Valrhona 70% cacao, bánh hạnh nhân financier và lá giòn praline."}',
  195000.00, 0.00, 'Dessert', TRUE, FALSE
),
(
  'a4000004-0000-0000-0000-000000000003',
  '{"fr": "Soufflé au Grand Marnier", "en": "Grand Marnier Hot Soufflé", "vi": "Bánh Soufflé Nóng Hương Grand Marnier"}',
  '{"fr": "Soufflé chaud au Grand Marnier préparé à la commande, servi immédiatement, crème anglaise à l''orange.", "en": "Classic hot soufflé with Grand Marnier, made to order and served immediately with orange crème anglaise.", "vi": "Bánh soufflé nóng hổi với rượu cam Grand Marnier, làm theo đơn và phục vụ ngay kèm kem crème anglaise cam."}',
  220000.00, 0.00, 'Dessert', TRUE, FALSE
),
(
  'a4000004-0000-0000-0000-000000000004',
  '{"fr": "Île Flottante Meringue & Caramel", "en": "Floating Island with Caramel & Almonds", "vi": "Đảo Nổi Meringue Sốt Caramel & Hạnh Nhân"}',
  '{"fr": "Blancs en neige pochés flottant sur une crème anglaise vanillée, caramel coulant et amandes effilées grillées.", "en": "Poached meringue floating on Tahitian vanilla crème anglaise, drizzled with caramel and toasted flaked almonds.", "vi": "Bánh trứng đánh bông chần mềm nhẹ nổi trên kem crème anglaise vani, sốt caramel và hạnh nhân lát rang vàng."}',
  170000.00, 0.00, 'Dessert', TRUE, FALSE
),
(
  'a4000004-0000-0000-0000-000000000005',
  '{"fr": "Mille-Feuille Vanille & Fraises", "en": "Vanilla & Strawberry Mille-Feuille", "vi": "Bánh Mille-Feuille Vani & Dâu Tây"}',
  '{"fr": "Feuilletage caramélisé croustillant, crème diplomate à la vanille Bourbon et fraises gariguette de saison.", "en": "Crisp caramelized puff pastry, Bourbon vanilla diplomat cream and seasonal gariguette strawberries.", "vi": "Lớp bánh phồng caramel giòn tan xen kẽ kem diplomate vani Bourbon và dâu tây gariguette tươi theo mùa."}',
  210000.00, 0.00, 'Dessert', TRUE, FALSE
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_dine_in = EXCLUDED.price_dine_in,
  price_takeaway = EXCLUDED.price_takeaway,
  category = EXCLUDED.category;


-- ==========================================
-- 3. LIÊN KẾT MÓN ĂN VỚI CHẤT DỊ ỨNG (menu_item_allergens)
-- ==========================================

-- Foie Gras: GLUTEN (brioche), MILK (bơ)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
  ('a1000001-0000-0000-0000-000000000001', (SELECT id FROM allergen_categories WHERE code='GLUTEN')),
  ('a1000001-0000-0000-0000-000000000001', (SELECT id FROM allergen_categories WHERE code='MILK'))
ON CONFLICT DO NOTHING;

-- Tartare Cá Hồi: FISH, MILK (crème fraîche), GLUTEN (toast)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
  ('a1000001-0000-0000-0000-000000000002', (SELECT id FROM allergen_categories WHERE code='FISH')),
  ('a1000001-0000-0000-0000-000000000002', (SELECT id FROM allergen_categories WHERE code='MILK')),
  ('a1000001-0000-0000-0000-000000000002', (SELECT id FROM allergen_categories WHERE code='GLUTEN'))
ON CONFLICT DO NOTHING;

-- Carpaccio Bò: MILK (parmesan)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
  ('a1000001-0000-0000-0000-000000000003', (SELECT id FROM allergen_categories WHERE code='MILK'))
ON CONFLICT DO NOTHING;

-- Ốc Sên Burgundy: GLUTEN (baguette), MILK (bơ)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
  ('a1000001-0000-0000-0000-000000000004', (SELECT id FROM allergen_categories WHERE code='GLUTEN')),
  ('a1000001-0000-0000-0000-000000000004', (SELECT id FROM allergen_categories WHERE code='MILK')),
  ('a1000001-0000-0000-0000-000000000004', (SELECT id FROM allergen_categories WHERE code='MOLLUSCS'))
ON CONFLICT DO NOTHING;

-- Bouillabaisse: FISH, CRUSTACEANS, MOLLUSCS, GLUTEN
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
  ('a2000002-0000-0000-0000-000000000001', (SELECT id FROM allergen_categories WHERE code='FISH')),
  ('a2000002-0000-0000-0000-000000000001', (SELECT id FROM allergen_categories WHERE code='CRUSTACEANS')),
  ('a2000002-0000-0000-0000-000000000001', (SELECT id FROM allergen_categories WHERE code='MOLLUSCS')),
  ('a2000002-0000-0000-0000-000000000001', (SELECT id FROM allergen_categories WHERE code='GLUTEN'))
ON CONFLICT DO NOTHING;

-- Súp Nấm: MILK (crème fraîche)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
  ('a2000002-0000-0000-0000-000000000002', (SELECT id FROM allergen_categories WHERE code='MILK'))
ON CONFLICT DO NOTHING;

-- Súp Hành Tây: GLUTEN (crouton), MILK (Comté)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
  ('a2000002-0000-0000-0000-000000000003', (SELECT id FROM allergen_categories WHERE code='GLUTEN')),
  ('a2000002-0000-0000-0000-000000000003', (SELECT id FROM allergen_categories WHERE code='MILK'))
ON CONFLICT DO NOTHING;

-- Bò Wellington: GLUTEN (pastry), EGGS (egg wash), MILK (bơ)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
  ('a3000003-0000-0000-0000-000000000001', (SELECT id FROM allergen_categories WHERE code='GLUTEN')),
  ('a3000003-0000-0000-0000-000000000001', (SELECT id FROM allergen_categories WHERE code='EGGS')),
  ('a3000003-0000-0000-0000-000000000001', (SELECT id FROM allergen_categories WHERE code='MILK'))
ON CONFLICT DO NOTHING;

-- Vịt Sốt Cam: SULPHITES (Grand Marnier / rượu)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
  ('a3000003-0000-0000-0000-000000000002', (SELECT id FROM allergen_categories WHERE code='SULPHITES'))
ON CONFLICT DO NOTHING;

-- Cá Sole Meunière: FISH, GLUTEN, MILK (bơ), EGGS
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
  ('a3000003-0000-0000-0000-000000000003', (SELECT id FROM allergen_categories WHERE code='FISH')),
  ('a3000003-0000-0000-0000-000000000003', (SELECT id FROM allergen_categories WHERE code='GLUTEN')),
  ('a3000003-0000-0000-0000-000000000003', (SELECT id FROM allergen_categories WHERE code='MILK'))
ON CONFLICT DO NOTHING;

-- Sườn Cừu: NUTS (pistachios), MILK (gratin)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
  ('a3000003-0000-0000-0000-000000000004', (SELECT id FROM allergen_categories WHERE code='NUTS')),
  ('a3000003-0000-0000-0000-000000000004', (SELECT id FROM allergen_categories WHERE code='MILK'))
ON CONFLICT DO NOTHING;

-- Tôm Hùm: CRUSTACEANS, MILK (beurre blanc), SULPHITES (champagne)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
  ('a3000003-0000-0000-0000-000000000005', (SELECT id FROM allergen_categories WHERE code='CRUSTACEANS')),
  ('a3000003-0000-0000-0000-000000000005', (SELECT id FROM allergen_categories WHERE code='MILK')),
  ('a3000003-0000-0000-0000-000000000005', (SELECT id FROM allergen_categories WHERE code='SULPHITES'))
ON CONFLICT DO NOTHING;

-- Risotto Nấm: MILK (parmesan, bơ)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
  ('a3000003-0000-0000-0000-000000000006', (SELECT id FROM allergen_categories WHERE code='MILK'))
ON CONFLICT DO NOTHING;

-- Crème Brûlée: EGGS, MILK (cream)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
  ('a4000004-0000-0000-0000-000000000001', (SELECT id FROM allergen_categories WHERE code='EGGS')),
  ('a4000004-0000-0000-0000-000000000001', (SELECT id FROM allergen_categories WHERE code='MILK'))
ON CONFLICT DO NOTHING;

-- Mousse Sô-cô-la: EGGS, MILK, NUTS (praline almond)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
  ('a4000004-0000-0000-0000-000000000002', (SELECT id FROM allergen_categories WHERE code='EGGS')),
  ('a4000004-0000-0000-0000-000000000002', (SELECT id FROM allergen_categories WHERE code='MILK')),
  ('a4000004-0000-0000-0000-000000000002', (SELECT id FROM allergen_categories WHERE code='NUTS'))
ON CONFLICT DO NOTHING;

-- Soufflé Grand Marnier: EGGS, MILK, GLUTEN, SULPHITES
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
  ('a4000004-0000-0000-0000-000000000003', (SELECT id FROM allergen_categories WHERE code='EGGS')),
  ('a4000004-0000-0000-0000-000000000003', (SELECT id FROM allergen_categories WHERE code='MILK')),
  ('a4000004-0000-0000-0000-000000000003', (SELECT id FROM allergen_categories WHERE code='GLUTEN')),
  ('a4000004-0000-0000-0000-000000000003', (SELECT id FROM allergen_categories WHERE code='SULPHITES'))
ON CONFLICT DO NOTHING;

-- Île Flottante: EGGS, MILK, NUTS (almonds)
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
  ('a4000004-0000-0000-0000-000000000004', (SELECT id FROM allergen_categories WHERE code='EGGS')),
  ('a4000004-0000-0000-0000-000000000004', (SELECT id FROM allergen_categories WHERE code='MILK')),
  ('a4000004-0000-0000-0000-000000000004', (SELECT id FROM allergen_categories WHERE code='NUTS'))
ON CONFLICT DO NOTHING;

-- Mille-Feuille: EGGS, MILK, GLUTEN
INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES
  ('a4000004-0000-0000-0000-000000000005', (SELECT id FROM allergen_categories WHERE code='EGGS')),
  ('a4000004-0000-0000-0000-000000000005', (SELECT id FROM allergen_categories WHERE code='MILK')),
  ('a4000004-0000-0000-0000-000000000005', (SELECT id FROM allergen_categories WHERE code='GLUTEN'))
ON CONFLICT DO NOTHING;


-- ==========================================
-- 4. SEED RƯỢU VANG MẪU (để luồng auto-cross pairing hoạt động)
-- ==========================================
INSERT INTO wines (id, name, price_dine_in, price_takeaway, available, grape_variety, vintage, region, country, volume) VALUES
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '{"vi": "Château Margaux 2015", "en": "Château Margaux 2015", "fr": "Château Margaux Grand Cru 2015"}',
  35000000.00, 0.00, TRUE,
  'Cabernet Sauvignon / Merlot', 2015, 'Bordeaux - Margaux', 'France', '750ml'
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '{"vi": "Pouilly-Fuissé Tête de Cru 2020", "en": "Pouilly-Fuissé Tête de Cru 2020", "fr": "Pouilly-Fuissé Tête de Cru Blanc"}',
  2800000.00, 0.00, TRUE,
  'Chardonnay', 2020, 'Burgundy - Fuissé', 'France', '750ml'
),
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '{"vi": "Billecart-Salmon Champagne Brut Blanc de Blancs", "en": "Billecart-Salmon Champagne Brut Blanc de Blancs", "fr": "Champagne Billecart-Salmon Blanc de Blancs"}',
  4500000.00, 0.00, TRUE,
  'Chardonnay 100%', 2018, 'Champagne - Mareuil-sur-Aÿ', 'France', '750ml'
)
ON CONFLICT (id) DO NOTHING;
