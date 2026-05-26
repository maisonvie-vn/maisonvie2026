/**
 * insert_menu_v2.mjs
 * Insert menu À La Carte 2026 v2 từ Maison_Vie_Menu_A_la_Carte_2026_v2.md
 */

const SUPABASE_URL = 'https://soceewbooszqkutkbylm.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvY2Vld2Jvb3N6cWt1dGtieWxtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTY5MTIyNiwiZXhwIjoyMDk1MjY3MjI2fQ.9yBb_0GZsp4dLjsm7-AgRzwp-TYdSwB4FZ7aQYCnHfU';

const HEADERS = {
  'Content-Type': 'application/json',
  'apikey': SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  'Prefer': 'return=minimal',
};

async function rest(method, table, body = null, params = '') {
  const url = `${SUPABASE_URL}/rest/v1/${table}${params}`;
  const res = await fetch(url, { method, headers: HEADERS, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) { const t = await res.text(); throw new Error(`${method} ${table} → ${res.status}: ${t}`); }
  const t = await res.text();
  return t ? JSON.parse(t) : null;
}

// ── MENU DATA — À La Carte 2026 v2 ──────────────────────────────────────────

const MENU_ITEMS = [

  // ── ENTRÉES FROIDES & LÉGÈRES (Khai vị Lạnh & Nhẹ) ──────────────────────
  {
    id: 'ec100001-0000-4000-b000-000000000001',
    name: {
      fr: 'Carpaccio de Thon de Nha Trang — Yuzu, Kumquat, Sel marin de Bà Rịa',
      vi: 'Carpaccio cá ngừ Nha Trang — yuzu, tắc, muối biển Bà Rịa',
      en: 'Nha Trang tuna carpaccio — yuzu, kumquat, Bà Rịa sea salt',
    },
    description: {
      fr: 'Carpaccio de thon frais de Nha Trang, assaisonné au yuzu, kumquat et sel marin de Bà Rịa.',
      vi: 'Carpaccio cá ngừ tươi Nha Trang, ướp yuzu, tắc và muối biển Bà Rịa.',
      en: 'Fresh Nha Trang tuna carpaccio seasoned with yuzu, kumquat and Bà Rịa sea salt.',
    },
    price_dine_in: 400000, price_takeaway: 0,
    category: 'Appetizer', available: true, seasonal_flag: false,
  },
  {
    id: 'ec100001-0000-4000-b000-000000000002',
    name: {
      fr: 'Gravlax de Saumon — Herbes vietnamiennes, Crème légère',
      vi: 'Cá hồi ướp muối nhẹ — thảo mộc Việt — kem chua thanh',
      en: 'Salmon gravlax — Vietnamese herbs — light cream',
    },
    description: {
      fr: 'Saumon gravlax mariné aux herbes vietnamiennes, servi avec une crème légère.',
      vi: 'Cá hồi ướp muối theo kiểu gravlax, phủ thảo mộc Việt tươi, dùng kèm kem chua thanh.',
      en: 'Gravlax-cured salmon with fresh Vietnamese herbs and a delicate light cream.',
    },
    price_dine_in: 300000, price_takeaway: 0,
    category: 'Appetizer', available: true, seasonal_flag: false,
  },
  {
    id: 'ec100001-0000-4000-b000-000000000003',
    name: {
      fr: 'Salade de Crabe royal — Avocat, pamplemousse rose, vinaigrette aux agrumes',
      vi: 'Salade cua hoàng đế — bơ — bưởi hồng — vinaigrette cam chanh',
      en: 'King crab salad — avocado — pink grapefruit — citrus vinaigrette',
    },
    description: {
      fr: 'Crabe royal en salade avec avocat crémeux, pamplemousse rose et vinaigrette légère aux agrumes.',
      vi: 'Salad cua hoàng đế kết hợp bơ quả, bưởi hồng và vinaigrette cam chanh tươi mát.',
      en: 'King crab salad with creamy avocado, pink grapefruit and a light citrus vinaigrette.',
    },
    price_dine_in: 1150000, price_takeaway: 0,
    category: 'Appetizer', available: true, seasonal_flag: false,
  },
  {
    id: 'ec100001-0000-4000-b000-000000000004',
    name: {
      fr: 'Saint-Jacques en Tartare — Caviar d\'Aquitaine, Crème de Yuzu',
      vi: 'Sò điệp Hokkaido tartare — caviar Aquitaine — kem yuzu',
      en: 'Hokkaido scallop tartare — Aquitaine caviar — yuzu cream',
    },
    description: {
      fr: 'Tartare de Saint-Jacques de Hokkaido, caviar d\'Aquitaine et crème de yuzu.',
      vi: 'Sò điệp Hokkaido thái tartare, phủ caviar Aquitaine và kem yuzu thanh mát.',
      en: 'Hokkaido scallop tartare topped with Aquitaine caviar and a delicate yuzu cream.',
    },
    price_dine_in: 1050000, price_takeaway: 0,
    category: 'Appetizer', available: true, seasonal_flag: false,
  },
  {
    id: 'ec100001-0000-4000-b000-000000000005',
    name: {
      fr: 'Expression Végétale de Đà Lạt — Légumes de saison, Émulsion d\'herbes',
      vi: 'Rau củ Đà Lạt theo mùa — nhũ tương thảo mộc',
      en: 'Seasonal Đà Lạt vegetables — herb emulsion',
    },
    description: {
      fr: 'Sélection de légumes frais de Đà Lạt, sublimés par une émulsion légère d\'herbes aromatiques.',
      vi: 'Tuyển chọn rau củ tươi Đà Lạt theo mùa, dùng kèm nhũ tương thảo mộc thơm dịu.',
      en: 'Fresh seasonal vegetables from Đà Lạt, served with a delicate herb emulsion.',
    },
    price_dine_in: 100000, price_takeaway: 0,
    category: 'Appetizer', available: true, seasonal_flag: true,
  },

  // ── ENTRÉES CHAUDES & SOUPES (Khai vị Nóng & Súp) ───────────────────────
  {
    id: 'ec200002-0000-4000-b000-000000000001',
    name: {
      fr: 'Soupe à l\'Oignon Gratinée — Fromage affiné, Croûton',
      vi: 'Súp hành kiểu Pháp — phô mai ủ chín — bánh mì nướng',
      en: 'French onion soup — aged cheese — toasted crouton',
    },
    description: {
      fr: 'Soupe à l\'oignon caramélisé gratinée au fromage affiné avec un croûton doré.',
      vi: 'Súp hành tây caramel hóa, phủ phô mai ủ chín tan chảy và bánh mì nướng vàng.',
      en: 'Classic caramelized onion soup gratinéed with aged cheese and a golden crouton.',
    },
    price_dine_in: 300000, price_takeaway: 0,
    category: 'Soup', available: true, seasonal_flag: false,
  },
  {
    id: 'ec200002-0000-4000-b000-000000000002',
    name: {
      fr: 'Bisque de Crevettes de Nha Trang — Crème légère au Cognac',
      vi: 'Súp bisque tôm Nha Trang — kem Cognac nhẹ',
      en: 'Nha Trang shrimp bisque — light Cognac cream',
    },
    description: {
      fr: 'Bisque onctueuse de crevettes de Nha Trang parfumée au Cognac et crème légère.',
      vi: 'Súp bisque sánh mịn từ tôm Nha Trang, thoang thoảng hương Cognac và kem nhẹ.',
      en: 'Velvety Nha Trang shrimp bisque infused with Cognac and a delicate cream.',
    },
    price_dine_in: 400000, price_takeaway: 0,
    category: 'Soup', available: true, seasonal_flag: false,
  },
  {
    id: 'ec200002-0000-4000-b000-000000000003',
    name: {
      fr: 'Velouté de Champignons de Tam Đảo — Infusion de sous-bois',
      vi: 'Súp nấm rừng Tam Đảo — hương rừng tinh tế',
      en: 'Tam Đảo wild mushroom velouté — forest aromas',
    },
    description: {
      fr: 'Velouté soyeux de champignons sauvages de Tam Đảo aux arômes de sous-bois.',
      vi: 'Súp nấm rừng Tam Đảo sánh mịn với hương thơm rừng núi tinh tế.',
      en: 'Silky velouté of Tam Đảo wild mushrooms with delicate forest aromas.',
    },
    price_dine_in: 300000, price_takeaway: 0,
    category: 'Soup', available: true, seasonal_flag: false,
  },
  {
    id: 'ec200002-0000-4000-b000-000000000004',
    name: {
      fr: 'Escargots de Bourgogne au Beurre à l\'Ail',
      vi: 'Ốc sên nướng kiểu Burgundy — bơ tỏi — bánh tuile thảo mộc',
      en: 'Burgundy snails — garlic-parsley butter — herb tuile',
    },
    description: {
      fr: 'Escargots de Bourgogne gratinés au beurre ail-persil, servis avec une tuile aux herbes.',
      vi: 'Ốc sên Burgundy nướng với bơ tỏi mùi tây, dùng kèm bánh tuile thảo mộc giòn.',
      en: 'Burgundy snails baked in garlic-parsley butter, served with a crispy herb tuile.',
    },
    price_dine_in: 350000, price_takeaway: 0,
    category: 'Soup', available: true, seasonal_flag: false,
  },
  {
    id: 'ec200002-0000-4000-b000-000000000005',
    name: {
      fr: 'Foie Gras Poêlé — Fruit de saison, Jus réduit',
      vi: 'Gan ngỗng áp chảo — trái cây theo mùa — nước sốt cô đặc',
      en: 'Seared foie gras — seasonal fruit — reduced jus',
    },
    description: {
      fr: 'Foie gras de canard poêlé, accompagné de fruits de saison et d\'un jus réduit.',
      vi: 'Gan ngỗng Pháp áp chảo hoàn hảo, dùng kèm trái cây theo mùa và nước sốt cô đặc.',
      en: 'Pan-seared duck foie gras with seasonal fruit and a rich reduced jus.',
    },
    price_dine_in: 550000, price_takeaway: 0,
    category: 'Soup', available: true, seasonal_flag: true,
  },

  // ── LES SIGNATURES DE MAISON VIE ─────────────────────────────────────────
  {
    id: 'ec300003-0000-4000-b000-000000000001',
    name: {
      fr: 'Cabillaud Noir Mariné au Miso — Légumes verts, Beurre noisette',
      vi: 'Cá tuyết đen ướp miso — rau xanh theo mùa — bơ nâu',
      en: 'Miso-marinated black cod — seasonal greens — brown butter',
    },
    description: {
      fr: 'Cabillaud noir mariné au miso blanc, accompagné de légumes verts de saison et d\'un beurre noisette.',
      vi: 'Cá tuyết đen ướp miso trắng, dùng kèm rau xanh theo mùa và bơ nâu thơm.',
      en: 'White miso-marinated black cod with seasonal greens and nutty brown butter.',
    },
    price_dine_in: 1050000, price_takeaway: 0,
    category: 'Main Course', available: true, seasonal_flag: false,
  },
  {
    id: 'ec300003-0000-4000-b000-000000000002',
    name: {
      fr: 'Wellington de Buffle du Vietnam — Duxelles de champignons, Jus au poivre Phú Quốc',
      vi: 'Wellington thịt trâu Việt Nam — nhân nấm duxelles — sốt tiêu Phú Quốc',
      en: 'Vietnamese buffalo Wellington — mushroom duxelles — Phú Quốc pepper jus',
    },
    description: {
      fr: 'Wellington de buffle vietnamien en croûte dorée avec duxelles de champignons et jus au poivre de Phú Quốc.',
      vi: 'Thịt trâu Việt Nam bọc bánh pastry vàng ruộm, nhân nấm duxelles, sốt tiêu Phú Quốc.',
      en: 'Vietnamese buffalo in golden pastry crust with mushroom duxelles and Phú Quốc pepper jus.',
    },
    price_dine_in: 450000, price_takeaway: 0,
    category: 'Main Course', available: true, seasonal_flag: false,
  },
  {
    id: 'ec300003-0000-4000-b000-000000000003',
    name: {
      fr: 'Risotto à la Truffe et Champignons de Tam Đảo — Beurre Échiré, Parmesan affiné 24 mois',
      vi: 'Risotto nấm cục và nấm rừng Tam Đảo — bơ Échiré, parmesan ủ 24 tháng',
      en: 'Truffle risotto with Tam Đảo wild mushrooms — Échiré butter — 24-month Parmesan',
    },
    description: {
      fr: 'Risotto crémeux à la truffe et champignons de Tam Đảo, monté au beurre Échiré AOP et parmesan affiné 24 mois.',
      vi: 'Risotto sánh mịn với nấm cục và nấm rừng Tam Đảo, hoàn thiện với bơ Échiré AOP và parmesan ủ 24 tháng.',
      en: 'Creamy truffle and Tam Đảo wild mushroom risotto finished with Échiré AOP butter and 24-month Parmesan.',
    },
    price_dine_in: 550000, price_takeaway: 0,
    category: 'Main Course', available: true, seasonal_flag: false,
  },

  // ── PLATS PRINCIPAUX (Món Chính) ──────────────────────────────────────────
  {
    id: 'ec400004-0000-4000-b000-000000000001',
    name: {
      fr: 'Langoustine Rôtie — Beurre noisette, Cuisson précise',
      vi: 'Tôm hùm baby áp chảo — bơ nâu — kiểm soát nhiệt chính xác',
      en: 'Roasted langoustine — brown butter — precise cuisson',
    },
    description: {
      fr: 'Langoustine rôtie à cuisson précise, nappée d\'un beurre noisette parfumé.',
      vi: 'Tôm hùm baby nướng chính xác theo nhiệt độ, rưới bơ nâu thơm lừng.',
      en: 'Precisely roasted langoustine drizzled with aromatic brown butter.',
    },
    price_dine_in: 2050000, price_takeaway: 0,
    category: 'Main Course', available: true, seasonal_flag: false,
  },
  {
    id: 'ec400004-0000-4000-b000-000000000002',
    name: {
      fr: 'Saint-Jacques Poêlées — Beurre blanc léger, Note d\'agrumes',
      vi: 'Sò điệp áp chảo — beurre blanc nhẹ — điểm chua thanh',
      en: 'Pan-seared scallops — light beurre blanc — citrus note',
    },
    description: {
      fr: 'Saint-Jacques poêlées dorées, sauce beurre blanc légère et note d\'agrumes rafraîchissante.',
      vi: 'Sò điệp áp chảo vàng ruộm, sốt beurre blanc nhẹ và điểm chua thanh của cam chanh.',
      en: 'Golden pan-seared scallops with a light beurre blanc and refreshing citrus note.',
    },
    price_dine_in: 850000, price_takeaway: 0,
    category: 'Main Course', available: true, seasonal_flag: false,
  },
  {
    id: 'ec400004-0000-4000-b000-000000000003',
    name: {
      fr: 'Bar du Vietnam Poêlé — Beurre blanc, Note d\'agrumes',
      vi: 'Cá vược Việt Nam áp chảo — beurre blanc — điểm chua thanh',
      en: 'Pan-seared Vietnamese seabass — beurre blanc — citrus note',
    },
    description: {
      fr: 'Bar du Vietnam poêlé à la peau croustillante, sauce beurre blanc et zeste d\'agrumes.',
      vi: 'Cá vược Việt Nam áp chảo da giòn, sốt beurre blanc và vỏ cam chanh tươi.',
      en: 'Crispy skin Vietnamese seabass with beurre blanc sauce and fresh citrus zest.',
    },
    price_dine_in: 400000, price_takeaway: 0,
    category: 'Main Course', available: true, seasonal_flag: false,
  },
  {
    id: 'ec400004-0000-4000-b000-000000000004',
    name: {
      fr: 'Magret de Canard du Vietnam — Compote de Prunes de Sapa, Jus au Madère',
      vi: 'Lườn vịt Việt Nam — mứt mận Sapa — sốt Madère',
      en: 'Vietnamese duck breast — Sapa plum compote — Madeira jus',
    },
    description: {
      fr: 'Magret de canard vietnamien rosé, compote de prunes de Sapa et jus au Madère.',
      vi: 'Lườn vịt Việt Nam áp chảo tái hồng, mứt mận Sapa ngọt chua và sốt Madère đậm đà.',
      en: 'Medium-rare Vietnamese duck breast with Sapa plum compote and rich Madeira jus.',
    },
    price_dine_in: 350000, price_takeaway: 0,
    category: 'Main Course', available: true, seasonal_flag: false,
  },
  {
    id: 'ec400004-0000-4000-b000-000000000005',
    name: {
      fr: 'Carré d\'Agneau aux Herbes Vietnamiennes — Lentilles du Puy, Céleri-rave',
      vi: 'Sườn cừu nướng vỏ thảo mộc Việt — đậu Le Puy — củ cần tây',
      en: 'Herb-crusted lamb rack — Le Puy lentils — celeriac',
    },
    description: {
      fr: 'Carré d\'agneau en croûte d\'herbes vietnamiennes, lentilles du Puy et purée de céleri-rave.',
      vi: 'Sườn cừu nướng vỏ thảo mộc Việt thơm, đậu Le Puy và purée củ cần tây.',
      en: 'Herb-crusted lamb rack with Vietnamese herbs, Le Puy lentils and celeriac purée.',
    },
    price_dine_in: 1750000, price_takeaway: 0,
    category: 'Main Course', available: true, seasonal_flag: false,
  },
  {
    id: 'ec400004-0000-4000-b000-000000000006',
    name: {
      fr: 'Bœuf Wagyu MBS 6–7 — Topinambour, Betterave Chioggia',
      vi: 'Bò Wagyu MBS 6–7 — atisô Jerusalem — củ dền Chioggia',
      en: 'Wagyu beef MBS 6–7 — Jerusalem artichoke — Chioggia beetroot',
    },
    description: {
      fr: 'Bœuf Wagyu MBS 6–7 saisi, accompagné de topinambour et betterave Chioggia.',
      vi: 'Thịt bò Wagyu MBS 6–7 áp chảo, dùng kèm atisô Jerusalem và củ dền Chioggia.',
      en: 'Seared Wagyu beef MBS 6–7 served with Jerusalem artichoke and Chioggia beetroot.',
    },
    price_dine_in: 1550000, price_takeaway: 0,
    category: 'Main Course', available: true, seasonal_flag: false,
  },
  {
    id: 'ec400004-0000-4000-b000-000000000007',
    name: {
      fr: 'Plat Végétal — Légumineuses, Racines',
      vi: 'Món chính chay cao cấp — đậu và củ — cấu trúc và chiều sâu',
      en: 'Vegetable main — legumes and roots — depth and texture',
    },
    description: {
      fr: 'Composition végétale autour des légumineuses et racines, alliant texture et profondeur de goût.',
      vi: 'Món chính thuần chay từ đậu và củ, kết hợp cấu trúc phong phú và chiều sâu hương vị.',
      en: 'Plant-based composition of legumes and roots with depth of flavour and varied textures.',
    },
    price_dine_in: 200000, price_takeaway: 0,
    category: 'Main Course', available: true, seasonal_flag: false,
  },

  // ── FROMAGES & DESSERTS (Phô Mai & Tráng Miệng) ──────────────────────────
  {
    id: 'ec500005-0000-4000-b000-000000000001',
    name: {
      fr: 'Sélection de Fromages Français Affinés',
      vi: 'Tuyển chọn phô mai Pháp ủ chín',
      en: 'Selection of mature French cheeses',
    },
    description: {
      fr: 'Sélection de fromages français affinés, servis avec accompagnements traditionnels.',
      vi: 'Tuyển chọn các loại phô mai Pháp ủ chín, dùng kèm phụ gia truyền thống.',
      en: 'A curated selection of mature French cheeses with traditional accompaniments.',
    },
    price_dine_in: 400000, price_takeaway: 0,
    category: 'Dessert', available: true, seasonal_flag: false,
  },
  {
    id: 'ec500005-0000-4000-b000-000000000002',
    name: {
      fr: 'Soufflé Chaud du Moment — Glace Vanille de Phú Quốc',
      vi: 'Soufflé nóng theo mùa — kem vani Phú Quốc',
      en: 'Warm seasonal soufflé — Phú Quốc vanilla ice cream',
    },
    description: {
      fr: 'Soufflé chaud préparé à la commande selon l\'inspiration du moment, servi avec glace vanille de Phú Quốc.',
      vi: 'Soufflé nóng làm theo đơn theo cảm hứng mùa vụ, dùng kèm kem vani Phú Quốc.',
      en: 'Freshly baked seasonal soufflé made to order, served with Phú Quốc vanilla ice cream.',
    },
    price_dine_in: 100000, price_takeaway: 0,
    category: 'Dessert', available: true, seasonal_flag: true,
  },
  {
    id: 'ec500005-0000-4000-b000-000000000003',
    name: {
      fr: 'Chocolat du Vietnam — Contraste d\'Agrumes',
      vi: 'Sô-cô-la Việt Nam — đối vị cam chanh',
      en: 'Vietnamese chocolate — citrus contrast',
    },
    description: {
      fr: 'Dessert autour du chocolat vietnamien, en contraste avec des notes vives d\'agrumes.',
      vi: 'Món tráng miệng từ sô-cô-la Việt Nam, tương phản với vị cam chanh tươi sáng.',
      en: 'Vietnamese chocolate dessert with a vibrant citrus contrast.',
    },
    price_dine_in: 150000, price_takeaway: 0,
    category: 'Dessert', available: true, seasonal_flag: false,
  },
  {
    id: 'ec500005-0000-4000-b000-000000000004',
    name: {
      fr: 'Crème Brûlée à la Vanille de Phú Quốc — Caramel croustillant',
      vi: 'Crème brûlée vani Phú Quốc — lớp caramel giòn',
      en: 'Phú Quốc vanilla crème brûlée — crisp caramel',
    },
    description: {
      fr: 'Crème brûlée onctueuse à la vanille naturelle de Phú Quốc, caramel croustillant réalisé à la flamme.',
      vi: 'Crème brûlée mịn màng từ vani tự nhiên Phú Quốc, lớp caramel giòn tan khò trực tiếp.',
      en: 'Smooth crème brûlée with natural Phú Quốc vanilla, finished with a flame-kissed crisp caramel.',
    },
    price_dine_in: 100000, price_takeaway: 0,
    category: 'Dessert', available: true, seasonal_flag: false,
  },
  {
    id: 'ec500005-0000-4000-b000-000000000005',
    name: {
      fr: 'Assiette de Fruits Tropicaux de Saison — Fraîcheur naturelle',
      vi: 'Tuyển chọn trái cây nhiệt đới theo mùa',
      en: 'Seasonal tropical fruit selection',
    },
    description: {
      fr: 'Sélection de fruits tropicaux frais de saison, servis nature pour une fraîcheur absolue.',
      vi: 'Tuyển chọn trái cây nhiệt đới tươi theo mùa, giữ nguyên vẹn hương vị tự nhiên.',
      en: 'Fresh seasonal tropical fruits served naturally for pure, vibrant freshness.',
    },
    price_dine_in: 100000, price_takeaway: 0,
    category: 'Dessert', available: true, seasonal_flag: true,
  },
];

// Allergen mappings từ file menu
const ALLERGEN_MAP = [
  // Entrées froides
  { item: 'ec100001-0000-4000-b000-000000000001', codes: ['FISH', 'SULPHITES'] },
  { item: 'ec100001-0000-4000-b000-000000000002', codes: ['FISH', 'MILK', 'SULPHITES'] },
  { item: 'ec100001-0000-4000-b000-000000000003', codes: ['CRUSTACEANS', 'SULPHITES'] },
  { item: 'ec100001-0000-4000-b000-000000000004', codes: ['MOLLUSCS', 'FISH', 'MILK', 'SULPHITES'] },
  { item: 'ec100001-0000-4000-b000-000000000005', codes: ['MILK'] },
  // Entrées chaudes & soupes
  { item: 'ec200002-0000-4000-b000-000000000001', codes: ['GLUTEN', 'MILK', 'SULPHITES'] },
  { item: 'ec200002-0000-4000-b000-000000000002', codes: ['CRUSTACEANS', 'MILK', 'SULPHITES'] },
  { item: 'ec200002-0000-4000-b000-000000000003', codes: ['MILK'] },
  { item: 'ec200002-0000-4000-b000-000000000004', codes: ['GLUTEN', 'MILK', 'MOLLUSCS', 'SULPHITES'] },
  { item: 'ec200002-0000-4000-b000-000000000005', codes: ['SULPHITES'] },
  // Signatures
  { item: 'ec300003-0000-4000-b000-000000000001', codes: ['FISH', 'SOYA', 'MILK', 'SULPHITES'] },
  { item: 'ec300003-0000-4000-b000-000000000002', codes: ['GLUTEN', 'MILK', 'EGGS', 'SULPHITES'] },
  { item: 'ec300003-0000-4000-b000-000000000003', codes: ['MILK', 'SULPHITES'] },
  // Plats principaux
  { item: 'ec400004-0000-4000-b000-000000000001', codes: ['CRUSTACEANS', 'MILK', 'SULPHITES'] },
  { item: 'ec400004-0000-4000-b000-000000000002', codes: ['MOLLUSCS', 'MILK', 'SULPHITES'] },
  { item: 'ec400004-0000-4000-b000-000000000003', codes: ['FISH', 'MILK', 'SULPHITES'] },
  { item: 'ec400004-0000-4000-b000-000000000004', codes: ['SULPHITES'] },
  { item: 'ec400004-0000-4000-b000-000000000005', codes: ['MILK', 'SULPHITES'] },
  { item: 'ec400004-0000-4000-b000-000000000006', codes: ['MILK', 'SULPHITES'] },
  { item: 'ec400004-0000-4000-b000-000000000007', codes: ['MILK'] },
  // Desserts
  { item: 'ec500005-0000-4000-b000-000000000001', codes: ['MILK', 'SULPHITES'] },
  { item: 'ec500005-0000-4000-b000-000000000002', codes: ['GLUTEN', 'MILK', 'EGGS'] },
  { item: 'ec500005-0000-4000-b000-000000000003', codes: ['MILK', 'EGGS'] },
  { item: 'ec500005-0000-4000-b000-000000000004', codes: ['MILK', 'EGGS'] },
  // Trái cây — no major allergens
];

async function main() {
  console.log(`📋 Nạp ${MENU_ITEMS.length} món ăn mới (À La Carte 2026 v2)...\n`);

  // Insert menu items
  await rest('POST', 'menu_items', MENU_ITEMS);
  console.log(`   ✓ ${MENU_ITEMS.length} món đã được insert`);

  // Fetch allergen IDs
  const allergens = await rest('GET', 'allergen_categories', null, '?select=id,code');
  const allergenMap = {};
  allergens.forEach(a => { allergenMap[a.code] = a.id; });

  // Build allergen rows
  const allergenRows = [];
  for (const { item, codes } of ALLERGEN_MAP) {
    for (const code of codes) {
      if (allergenMap[code]) {
        allergenRows.push({ menu_item_id: item, allergen_id: allergenMap[code] });
      } else {
        console.warn(`   ⚠ Không tìm thấy allergen: ${code}`);
      }
    }
  }

  await rest('POST', 'menu_item_allergens', allergenRows);
  console.log(`   ✓ ${allergenRows.length} allergen links đã được insert`);

  console.log('\n✅ Xong! Menu À La Carte 2026 v2 đã được nạp vào database.');
  console.log('\n📊 Tổng kết:');
  console.log(`   • Entrées froides & légères: 5 món`);
  console.log(`   • Entrées chaudes & soupes:  5 món`);
  console.log(`   • Signatures Maison Vie:     3 món`);
  console.log(`   • Plats principaux:          7 món`);
  console.log(`   • Fromages & Desserts:       5 món`);
  console.log(`   • TOTAL: ${MENU_ITEMS.length} món`);
}

main().catch(err => {
  console.error('❌ Thất bại:', err.message);
  process.exit(1);
});
