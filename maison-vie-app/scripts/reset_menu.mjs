/**
 * reset_menu.mjs
 * Xóa TOÀN BỘ menu cũ và nạp lại từ seed_alacarte_menu.sql
 * Dùng Supabase REST API thuần (không cần exec_sql RPC)
 * Chạy: node scripts/reset_menu.mjs
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
  const res = await fetch(url, {
    method,
    headers: HEADERS,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${table} → ${res.status}: ${text}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ── UUID hợp lệ (chỉ dùng ký tự hex 0-9, a-f) ────────────────────────────────
// Khai Vị
const ID_FOIE_GRAS    = '22222222-2222-2222-2222-222222222222';
const ID_ESCARGOTS    = 'ae111111-1111-4111-b111-111111111111';
const ID_TARTARE_SALM = 'ae222222-2222-4222-b222-222222222222';
// Súp
const ID_BOUILLABAISE = '33333333-3333-3333-3333-333333333333';
const ID_ONION_SOUP   = 'be111111-1111-4111-b111-111111111111';
const ID_MUSHROOM_VEL = 'be222222-2222-4222-b222-222222222222';
// Món chính
const ID_WELLINGTON   = '11111111-1111-1111-1111-111111111111';
const ID_CANARD_ORNG  = 'ce111111-1111-4111-b111-111111111111';
const ID_SEA_BASS     = 'ce222222-2222-4222-b222-222222222222';
const ID_COQ_VIN      = 'ce333333-3333-4333-b333-333333333333';
// Tráng miệng
const ID_CREME_BRULEE = '44444444-4444-4444-4444-444444444444';
const ID_CHOCOLAT_LAV = 'de111111-1111-4111-b111-111111111111';
const ID_TARTE_TATIN  = 'de222222-2222-4222-b222-222222222222';

const MENU_ITEMS = [
  // A. KHAI VỊ
  {
    id: ID_FOIE_GRAS,
    name: { fr: 'Foie Gras Poêlé aux Figues', en: 'Pan-Seared Foie Gras with Figs', vi: 'Gan Ngỗng Pháp Áp Chảo Sốt Vả Tây' },
    description: {
      fr: 'Foie gras de canard poêlé, compotée de figues, brioche dorée au beurre.',
      en: 'Pan-seared duck foie gras served with warm fig compote and toasted buttery brioche.',
      vi: 'Gan ngỗng Pháp áp chảo hoàn hảo, dùng kèm sốt giấm balsamic hương vả tây ngọt dịu và bánh mì brioche nướng bơ.',
    },
    price_dine_in: 650000, price_takeaway: 0, category: 'Appetizer', available: true, seasonal_flag: false,
  },
  {
    id: ID_ESCARGOTS,
    name: { fr: "Escargots de Bourgogne", en: 'Burgundy Snails in Garlic Butter', vi: 'Ốc Sên Nướng Bơ Tỏi Burgundy' },
    description: {
      fr: "Escargots sauvages de Bourgogne cuits dans leur coquille au beurre d'ail et persil.",
      en: 'Wild Burgundy snails baked in shells with rich garlic, parsley, and French butter.',
      vi: 'Ốc sên hoang dã vùng Bourgogne đút lò trong vỏ với bơ lạt Pháp, tỏi và ngò tây băm nhuyễn thơm nồng.',
    },
    price_dine_in: 350000, price_takeaway: 0, category: 'Appetizer', available: true, seasonal_flag: false,
  },
  {
    id: ID_TARTARE_SALM,
    name: { fr: "Tartare de Saumon à l'Avocat", en: 'Salmon Tartare with Avocado', vi: 'Gỏi Cá Hồi Kèm Bơ Quả' },
    description: {
      fr: "Saumon frais coupé au couteau, avocat acidulé, vinaigrette aux agrumes.",
      en: 'Hand-cut fresh salmon tartare layered with seasoned avocado and citrus vinaigrette.',
      vi: 'Cá hồi tươi thái hạt lựu trộn dầu giấm chanh bưởi tươi mát, xếp lớp trên bơ quả nghiền béo ngậy.',
    },
    price_dine_in: 320000, price_takeaway: 0, category: 'Appetizer', available: true, seasonal_flag: false,
  },

  // B. SÚP KINH ĐIỂN
  {
    id: ID_BOUILLABAISE,
    name: { fr: 'Bouillabaisse de Marseille', en: 'Classic Bouillabaisse Soup', vi: 'Súp Hải Sản Bouillabaisse Marseille' },
    description: {
      fr: 'Soupe de poisson traditionnelle marseillaise avec rouille et croûtons ailés.',
      en: 'Traditional Marseille seafood soup in rich saffron broth with garlic rouille and croutons.',
      vi: 'Súp hải sản truyền thống kiểu Marseille với cá tầm, tôm, vẹm xanh đun trong nước dùng nghệ tây đậm đà, ăn kèm bánh mì bơ tỏi rouille.',
    },
    price_dine_in: 480000, price_takeaway: 0, category: 'Soup', available: true, seasonal_flag: false,
  },
  {
    id: ID_ONION_SOUP,
    name: { fr: "Soupe à l'Oignon Gratinée", en: 'French Onion Soup', vi: 'Súp Hành Tây Cổ Điển Đút Lò' },
    description: {
      fr: "Soupe d'oignons caramélisés, bouillon de bœuf, croûton de pain et fromage Gruyère fondu.",
      en: 'Sweet caramelized onion broth with beef stock, toasted bread slice, and melted Gruyere cheese.',
      vi: 'Súp hành tây hầm ngọt lịm từ nước dùng xương bò, phủ bánh mì nướng và phô mai Gruyère đút lò chảy giòn.',
    },
    price_dine_in: 220000, price_takeaway: 0, category: 'Soup', available: true, seasonal_flag: false,
  },
  {
    id: ID_MUSHROOM_VEL,
    name: { fr: 'Velouté de Champignons aux Truffes', en: 'Mushroom Cream Soup with Truffle', vi: 'Súp Kem Nấm Hương Vị Truffle' },
    description: {
      fr: "Crème veloutée de champignons des bois parfumée à l'huile de truffe noire.",
      en: 'Smooth wild forest mushroom cream soup drizzled with premium black truffle oil.',
      vi: 'Súp kem sánh mịn chế biến từ các loại nấm rừng tự nhiên, dậy mùi hương quý phái của dầu nấm Truffle đen.',
    },
    price_dine_in: 250000, price_takeaway: 0, category: 'Soup', available: true, seasonal_flag: false,
  },

  // C. MÓN CHÍNH
  {
    id: ID_WELLINGTON,
    name: { fr: 'Filet de Bœuf en Croûte Wellington', en: 'Premium Beef Wellington', vi: 'Thăn Bò Wellington Thượng Hạng' },
    description: {
      fr: "Filet de bœuf Angus en feuilletage, duxelles de champignons de Paris et truffe.",
      en: 'Premium Black Angus beef tenderloin wrapped in flaky pastry with mushroom duxelles and truffle jus.',
      vi: 'Thăn nội bò Black Angus bọc trong lớp nấm duxelles, thịt xông khói prosciutto và vỏ bánh pastry nướng vàng ruộm, dùng kèm sốt truffle đen.',
    },
    price_dine_in: 1250000, price_takeaway: 0, category: 'Main Course', available: true, seasonal_flag: false,
  },
  {
    id: ID_CANARD_ORNG,
    name: { fr: "Canard à l'Orange", en: "Classic Duck à l'Orange", vi: 'Vịt Sốt Cam Kiểu Pháp Cổ Điển' },
    description: {
      fr: "Magret de canard rôti, sauce bigarade à l'orange douce et purée de pommes de terre.",
      en: 'Pan-roasted French duck breast served with sweet-tangy orange reduction and potato purée.',
      vi: 'Ức vịt Pháp áp chảo da giòn rụm, rưới sốt cam mật ong ngọt chua hài hòa, ăn kèm khoai tây nghiền mịn.',
    },
    price_dine_in: 580000, price_takeaway: 0, category: 'Main Course', available: true, seasonal_flag: false,
  },
  {
    id: ID_SEA_BASS,
    name: { fr: 'Filet de Bar de Ligne', en: 'Pan-Seared Sea Bass', vi: 'Cá Chẽm Áp Chảo Sốt Bơ Chanh' },
    description: {
      fr: "Filet de bar rôti sur peau, légumes de saison, émulsion beurre blanc au citron.",
      en: 'Crispy skin sea bass fillet, seasonal baby vegetables, lemon-butter white wine emulsion.',
      vi: 'Fillet cá chẽm áp chảo giòn da, dùng kèm rau củ hữu cơ theo mùa và sốt bơ chanh trắng thơm béo.',
    },
    price_dine_in: 520000, price_takeaway: 0, category: 'Main Course', available: true, seasonal_flag: false,
  },
  {
    id: ID_COQ_VIN,
    name: { fr: 'Coq au Vin', en: 'Slow-Braised Chicken in Red Wine', vi: 'Gà Om Vang Đỏ Kiểu Pháp' },
    description: {
      fr: "Mijoté de coq au vin rouge de Bourgogne, champignons, lardons et petits oignons.",
      en: 'Classic Burgundy red wine braised chicken leg with mushrooms, bacon lardons, and pearl onions.',
      vi: 'Đùi gà tơ om chậm trong rượu vang đỏ Bourgogne đậm đà với nấm mỡ, thịt ba chỉ xông khói và hành củ.',
    },
    price_dine_in: 450000, price_takeaway: 0, category: 'Main Course', available: true, seasonal_flag: false,
  },

  // D. TRÁNG MIỆNG
  {
    id: ID_CREME_BRULEE,
    name: { fr: 'Crème Brûlée à la Vanille de Tahiti', en: 'Tahitian Vanilla Crème Brûlée', vi: 'Bánh Crème Brûlée Hương Vani Tahiti' },
    description: {
      fr: "Crème brûlée à la vanille naturelle de Tahiti, caramel craquant khò chaud.",
      en: 'Rich custard base infused with natural Tahitian vanilla bean, topped with hard caramel layer.',
      vi: 'Món tráng miệng Pháp kinh điển với lớp kem trứng mịn màng từ hương vani Tahiti tự nhiên, phủ lớp đường caramel khò giòn tan.',
    },
    price_dine_in: 180000, price_takeaway: 0, category: 'Dessert', available: true, seasonal_flag: false,
  },
  {
    id: ID_CHOCOLAT_LAV,
    name: { fr: 'Fondant au Chocolat', en: 'Lava Chocolate Cake', vi: 'Bánh Sô-cô-la Tan Chảy Kèm Kem' },
    description: {
      fr: "Fondant au chocolat noir Guanaja 70%, cœur coulant, glace vanille artisanale.",
      en: 'Warm dark chocolate cake with lava center, served with homemade artisan vanilla ice cream.',
      vi: 'Bánh sô-cô-la đen Guanaja 70% nướng chảy nhân ấm áp, dùng kèm một viên kem vani lạnh thủ công.',
    },
    price_dine_in: 190000, price_takeaway: 0, category: 'Dessert', available: true, seasonal_flag: false,
  },
  {
    id: ID_TARTE_TATIN,
    name: { fr: 'Tarte Tatin aux Pommes', en: 'Caramelized Apple Tarte Tatin', vi: 'Bánh Táo Nướng Úp Ngược Tatin' },
    description: {
      fr: "Tarte renversée aux pommes caramélisées au beurre d'Isigny, crème fraîche normande.",
      en: 'Upside-down caramelized apple tart with Isigny butter, served with double cream.',
      vi: 'Bánh táo nướng úp ngược truyền thống Pháp, táo chín caramel hóa với bơ Isigny, dùng kèm kem tươi.',
    },
    price_dine_in: 170000, price_takeaway: 0, category: 'Dessert', available: true, seasonal_flag: false,
  },
];

const ALLERGEN_MAP = [
  { item: ID_FOIE_GRAS,    codes: ['GLUTEN', 'MILK'] },
  { item: ID_ESCARGOTS,    codes: ['MILK'] },
  { item: ID_TARTARE_SALM, codes: ['FISH'] },
  { item: ID_BOUILLABAISE, codes: ['FISH', 'CRUSTACEANS', 'MOLLUSCS', 'GLUTEN'] },
  { item: ID_ONION_SOUP,   codes: ['GLUTEN', 'MILK'] },
  { item: ID_MUSHROOM_VEL, codes: ['MILK', 'CELERY'] },
  { item: ID_WELLINGTON,   codes: ['GLUTEN', 'EGGS', 'MILK'] },
  { item: ID_CANARD_ORNG,  codes: ['MILK'] },
  { item: ID_SEA_BASS,     codes: ['FISH', 'MILK'] },
  { item: ID_COQ_VIN,      codes: ['SULPHITES'] },
  { item: ID_CREME_BRULEE, codes: ['EGGS', 'MILK'] },
  { item: ID_CHOCOLAT_LAV, codes: ['EGGS', 'MILK', 'GLUTEN'] },
  { item: ID_TARTE_TATIN,  codes: ['GLUTEN', 'MILK'] },
];

async function main() {
  console.log('🗑️  Xóa toàn bộ menu cũ...');

  // 1. Xóa allergens trước (FK constraint)
  await rest('DELETE', 'menu_item_allergens', null, '?menu_item_id=neq.00000000-0000-0000-0000-000000000000');
  console.log('   ✓ menu_item_allergens cleared');

  // 2. Xóa tất cả menu items
  await rest('DELETE', 'menu_items', null, '?id=neq.00000000-0000-0000-0000-000000000000');
  console.log('   ✓ menu_items cleared');

  // 3. Insert menu items mới
  console.log('\n📋 Nạp 13 món ăn mới...');
  await rest('POST', 'menu_items', MENU_ITEMS);
  console.log('   ✓ 13 món đã được insert');

  // 4. Fetch allergen category IDs
  const allergens = await rest('GET', 'allergen_categories', null, '?select=id,code');
  const allergenMap = {};
  allergens.forEach(a => { allergenMap[a.code] = a.id; });

  // 5. Insert allergen links
  console.log('\n⚠️  Gắn thông tin dị ứng...');
  const allergenRows = [];
  for (const { item, codes } of ALLERGEN_MAP) {
    for (const code of codes) {
      if (allergenMap[code]) {
        allergenRows.push({ menu_item_id: item, allergen_id: allergenMap[code] });
      } else {
        console.warn(`   ⚠ Không tìm thấy allergen code: ${code}`);
      }
    }
  }
  await rest('POST', 'menu_item_allergens', allergenRows);
  console.log(`   ✓ ${allergenRows.length} allergen links đã được insert`);

  console.log('\n✅ Xong! Database hiện có 13 món sạch từ seed_alacarte_menu.sql');
}

main().catch(err => {
  console.error('❌ Thất bại:', err.message);
  process.exit(1);
});
