/**
 * reset_menu_v3.mjs
 * Xóa các món À La Carte cũ và nạp lại 26 món ăn mới đạt chuẩn 2026
 * với đầy đủ dịch thuật 6 ngôn ngữ (vi, en, fr, ja, ko, hk).
 * Không ảnh hưởng đến bảng Giá Set Menu ('Set Menu Price').
 * Chạy bằng: node scripts/reset_menu_v3.mjs
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

const MENU_ITEMS = [
  // ── ENTRÉES FROIDES & LÉGÈRES (Khai vị Lạnh & Nhẹ - 5 món) ──────────────────
  {
    id: 'ec100001-0000-4000-b000-000000000001',
    name: {
      fr: "Carpaccio de Thon — Agrumes, sel marin",
      vi: "Carpaccio cá ngừ Nha Trang, yuzu, tắc, muối biển Bà Rịa",
      en: "Nha Trang tuna carpaccio, yuzu, kumquat, Bà Rịa sea salt",
      ja: "ナチャン産マグロ ngừ のカルパッチョ — ゆず、金柑、バリア産天日塩",
      ko: "냐짱 참치 카르파초 — 유자, 금귤, 바리아 천일염",
      hk: "精選芽莊吞拿魚薄片 — 伴柚子、金桔及巴地海鹽"
    },
    description: {
      fr: "Carpaccio de thon frais de Nha Trang, assaisonné au yuzu, kumquat et sel marin de Bà Rịa.",
      vi: "Carpaccio cá ngừ tươi Nha Trang, ướp yuzu, tắc và muối biển Bà Rịa.",
      en: "Fresh Nha Trang tuna carpaccio seasoned with yuzu, kumquat and Bà Rịa sea salt.",
      ja: "ナチャン産の新鮮なマグロを、ゆず、金柑、バリア産天日塩で爽やかに仕上げたカルパッチョ。",
      ko: "신선한 냐짱 참치 카르파초에 상큼한 유자, 금귤과 바리아 천일염으로 맛을 낸 전채 요리.",
      hk: "選用芽莊新鮮吞拿魚薄片，佐以柚子、金桔與巴地優質海鹽，風味清新。"
    },
    price_dine_in: 300000, price_takeaway: 0, category: 'Appetizer', available: true, seasonal_flag: false,
  },
  {
    id: 'ec100001-0000-4000-b000-000000000002',
    name: {
      fr: "Saumon gravlax, herbes du Vietnam",
      vi: "Cá hồi ướp muối nhẹ, thảo mộc Việt, kem chua thanh",
      en: "Salmon gravlax, Vietnamese herbs, light cream",
      ja: "サーモンのグラブラックス — ベトナムハーブ、ライトサワークリーム",
      ko: "연어 그라블락스 — 베트남 허브, 사워크림",
      hk: "醃製三文魚 — 伴越南香草及酸忌廉"
    },
    description: {
      fr: "Saumon gravlax mariné aux herbes vietnamiennes, servi avec une crème légère.",
      vi: "Cá hồi ướp muối theo kiểu gravlax, phủ thảo mộc Việt tươi, dùng kèm kem chua thanh.",
      en: "Gravlax-cured salmon with fresh Vietnamese herbs and a delicate light cream.",
      ja: "ベトナムハーブでマリネしたサーモンのグラブラックス、軽やかなサワークリーム添え。",
      ko: "베트남 허브로 마리네이드한 연어 그라블락스에 가벼운 사워크림을 곁들인 요리.",
      hk: "選用越南香草醃製的挪威三文魚，搭配特製酸忌廉，清新開胃。"
    },
    price_dine_in: 300000, price_takeaway: 0, category: 'Appetizer', available: true, seasonal_flag: false,
  },
  {
    id: 'ec100001-0000-4000-b000-000000000003',
    name: {
      fr: "Salade de Crabe de Cà Mau, Avocat, pamplemousse, agrumes",
      vi: "Xa lát cua bể Cà Mau, bơ, bưởi hồng, vinaigrette cam chanh",
      en: "Cà Mau mud crab salad, avocado, pink grapefruit, citrus vinaigrette",
      ja: "カマウ産マッドクラブのサラダ — アボカド、ピンクグレープフルーツ、シトラスビネグレット",
      ko: "까마우 머드크랩 샐러드 — 아보카도, 핑크 자몽, 시트러스 드레싱",
      hk: "金甌泥蟹沙律 — 伴牛油果、粉紅西柚及柑橘油醋汁"
    },
    description: {
      fr: "Crabe de Cà Mau en salade avec avocat crémeux, pamplemousse rose et vinaigrette légère aux agrumes.",
      vi: "Salad cua bể Cà Mau kết hợp bơ quả béo ngậy, bưởi hồng ngọt dịu và vinaigrette cam chanh tươi mát.",
      en: "Cà Mau mud crab salad with creamy avocado, pink grapefruit and a light citrus vinaigrette.",
      ja: "カマウ産の新鮮なカニ肉にクリーミーなアボカド、爽やかなピンクグレープフルーツを合わせ、柑橘ドレッシングで仕上げたサラダ。",
      ko: "신선한 까마우 게살에 부드러운 아보카도, 쌉싸름한 핑크 자몽과 상큼한 시트러스 비네그레트를 곁들인 샐러드.",
      hk: "選用越南金甌優質泥蟹肉，搭配滑順牛油果泥與酸甜粉紅西柚，佐以柑橘油醋汁。"
    },
    price_dine_in: 495000, price_takeaway: 0, category: 'Appetizer', available: true, seasonal_flag: false,
  },
  {
    id: 'ec100001-0000-4000-b000-000000000004',
    name: {
      fr: "Tartare de Saint-Jacques — Caviar, crème de yuzu",
      vi: "Sò điệp Hokkaido tartare, caviar, kem yuzu",
      en: "Hokkaido scallop tartare, caviar, yuzu cream",
      ja: "北海道産ホタテのタルタル — キャビア、ゆずクリーム",
      ko: "홋카이도 관자 타르타르 — 캐비아, 유자 크림",
      hk: "北海道帆立貝韃靼 — 伴魚子醬及柚子忌廉"
    },
    description: {
      fr: "Tartare de Saint-Jacques de Hokkaido, caviar d'Aquitaine et crème de yuzu.",
      vi: "Sò điệp Hokkaido thái tartare, phủ caviar Aquitaine và kem yuzu thanh mát.",
      en: "Hokkaido scallop tartare topped with Aquitaine caviar and a delicate yuzu cream.",
      ja: "新鮮な北海道産ホタテのタルタル。アキテーヌ産キャビアをのせ、ゆずクリームソースで上品に。",
      ko: "신선한 홋카이도 관자 타르타르에 아키텐산 캐비아를 얹고 상큼한 유자 크림으로 완성한 전채 요리.",
      hk: "北海道大帆立貝切丁做成韃靼，面層鋪上阿基坦魚子醬，並佐以柚子忌廉醬。"
    },
    price_dine_in: 495000, price_takeaway: 0, category: 'Appetizer', available: true, seasonal_flag: false,
  },
  {
    id: 'ec100001-0000-4000-b000-000000000005',
    name: {
      fr: "Légumes de Đà Lạt — Émulsion d'Herbes",
      vi: "Rau củ Đà Lạt theo mùa, nhũ tương thảo mộc",
      en: "Seasonal Đà Lạt vegetables, herb emulsion",
      ja: "大叻産季節野菜のコンポジション — ハーブのエマルジョン",
      ko: "달랏 제철 채소 요리 — 허브 에멀션",
      hk: "時令大叻蔬菜 — 伴香草乳劑"
    },
    description: {
      fr: "Sélection de légumes frais de Đà Lạt, sublimés par une émulsion légère d'herbes aromatiques.",
      vi: "Tuyển chọn rau củ tươi Đà Lạt theo mùa, dùng kèm nhũ tương thảo mộc thơm dịu.",
      en: "Fresh seasonal vegetables from Đà Lạt, served with a delicate herb emulsion.",
      ja: "大叻の豊かな土地で育った新鮮な旬の野菜に、香り豊かなハーブのエマルジョンソースを添えて。",
      ko: "달랏에서 자란 신선한 제철 채소들에 향긋한 허브 에멀션 소스를 곁들여 자연의 맛을 살린 요리.",
      hk: "精選大叻高原時令蔬菜，保留其鮮甜爽脆，搭配輕盈細膩的香草乳劑。"
    },
    price_dine_in: 135000, price_takeaway: 0, category: 'Appetizer', available: true, seasonal_flag: true,
  },

  // ── ENTRÉES CHAUDES & SOUPES (Khai vị Nóng & Súp - 5 món) ────────────────
  {
    id: 'ec200002-0000-4000-b000-000000000001',
    name: {
      fr: "Soupe à l'oignon — Fromage, croûton",
      vi: "Súp hành kiểu Pháp — phô mai ủ chín, bánh mì nướng",
      en: "French onion soup — aged cheese, toasted crouton",
      ja: "オニオンスープ — 熟成チーズ、クルトン",
      ko: "프렌치 어니언 스프 — 숙성 치즈, 크루통",
      hk: "法式洋蔥焗湯 — 伴熟成芝士及脆麵包丁"
    },
    description: {
      fr: "Soupe à l'oignon caramélisé gratinée au fromage affiné avec un croûton doré.",
      vi: "Súp hành tây caramel hóa hầm ngọt, phủ phô mai ủ chín tan chảy và bánh mì nướng vàng.",
      en: "Classic caramelized onion soup gratinéed with aged cheese and a golden crouton.",
      ja: "じっくり炒めた玉ねぎ의甘みが広がるスープ。熟成グリュイエールチーズとクルトンをのせて香ばしく焼き上げました。",
      ko: "오랜 시간 카라멜라이징한 양파 육수에 짭조름한 숙성 그뤼에르 치즈와 바삭한 크루통을 얹어 오븐에 구워낸 클래식 스프.",
      hk: "慢火焦糖化洋蔥燉煮的濃郁湯底，面層鋪上熟成芝士及脆麵包丁烘焗至金黃拉絲。"
    },
    price_dine_in: 225000, price_takeaway: 0, category: 'Soup', available: true, seasonal_flag: false,
  },
  {
    id: 'ec200002-0000-4000-b000-000000000002',
    name: {
      fr: "Crevettes de Nha Trang — Bisque au Cognac",
      vi: "Súp bisque tôm Nha Trang, kem Cognac nhẹ",
      en: "Nha Trang shrimp bisque, light Cognac cream",
      ja: "芽荘産エビのビスク — コニャッククリーム",
      ko: "냐짱 새우 비스크 — 코냐크 크림",
      hk: "芽莊蝦濃湯 — 伴干邑白蘭地忌廉"
    },
    description: {
      fr: "Bisque onctueuse de crevettes de Nha Trang parfumée au Cognac et crème légère.",
      vi: "Súp bisque sánh mịn từ tôm Nha Trang, thoang thoảng hương Cognac và kem nhẹ.",
      en: "Velvety Nha Trang shrimp bisque infused with Cognac and a delicate cream.",
      ja: "芽荘産の新鮮なエビをふんだんに使用した濃厚なビスク。コニャックの香りと滑らかなクリームで上品な味わいに。",
      ko: "신선한 냐짱 새우를 끓여낸 진한 크림 비스크에 고급 코냐크 향과 가벼운 크림을 더해 완성한 향긋한 스프.",
      hk: "選用芽莊海蝦熬製的濃郁雙重濃湯，注入高雅的干邑白蘭地香氣與滑嫩忌廉。"
    },
    price_dine_in: 265000, price_takeaway: 0, category: 'Soup', available: true, seasonal_flag: false,
  },
  {
    id: 'ec200002-0000-4000-b000-000000000003',
    name: {
      fr: "Champignons de Tam Đảo — Infusion de sous-bois",
      vi: "Súp nấm rừng Tam Đảo, hương rừng tinh tế",
      en: "Tam Đảo wild mushroom velouté, forest aromas",
      ja: "タムダオ産野生キノコのヴルーテ — 森の香り",
      ko: "탐다오 야생 버섯 벨루테 — 깊은 버섯 향",
      hk: "三島野菌濃湯 — 伴森林香氣"
    },
    description: {
      fr: "Velouté soyeux de champignons sauvages de Tam Đảo aux arômes de sous-bois.",
      vi: "Súp nấm rừng Tam Đảo sánh mịn với hương thơm rừng núi tinh tế.",
      en: "Silky velouté of Tam Đảo wild mushrooms with delicate forest aromas.",
      ja: "タムダオ産野生キノコを贅沢に使用したシルキーなヴルーテ。森の香りが口いっぱいに広がります。",
      ko: "탐다오 산악지대의 야생 버섯으로 만든 부드러운 벨루테. 깊고 풍부한 흙내음과 숲의 향이 어우러집니다.",
      hk: "選用三島高原野菌烹調的絲滑濃湯，富含深沉的森林大自然香氣。"
    },
    price_dine_in: 235000, price_takeaway: 0, category: 'Soup', available: true, seasonal_flag: false,
  },
  {
    id: 'ec200002-0000-4000-b000-000000000004',
    name: {
      fr: "Escargots de Bourgogne au Beurre à l'Ail",
      vi: "Ốc sên nướng kiểu Burgundy — bơ tỏi, bánh tuile thảo mộc",
      en: "Burgundy snails — garlic-parsley butter, herb tuile",
      ja: "ブルゴーニュ風エスカルゴ — ガーリックパセリバター、ハーブのチュイル",
      ko: "버건디 달팽이 요리 — 마늘 파슬리 버터, 허브 튈",
      hk: "勃艮第焗田螺 — 伴蒜香香草牛油及香草脆片"
    },
    description: {
      fr: "Escargots de Bourgogne gratinés au beurre ail-persil, servis avec une tuile aux herbes.",
      vi: "Ốc sên Burgundy nướng thơm lừng với bơ tỏi mùi tây, dùng kèm bánh tuile thảo mộc giòn rụm.",
      en: "Burgundy snails baked in garlic-parsley butter, served with a crispy herb tuile.",
      ja: "ハーブとガーリックを効かせた特製バターで香ばしく焼き上げたブルゴーニュ産エスカルゴ。サクサクのハーブチュイルを添えて。",
      ko: "향긋한 마늘과 파슬리 버터를 얹어 구운 프랑스 전통 달팽이 요리. 바삭한 허브 튈이 조화를 이룹니다.",
      hk: "經典勃艮第田螺配以香濃的蒜茸及荷蘭芹牛油烘焗，口感彈牙，伴以香脆的香草脆片。"
    },
    price_dine_in: 330000, price_takeaway: 0, category: 'Soup', available: true, seasonal_flag: false,
  },
  {
    id: 'ec200002-0000-4000-b000-000000000005',
    name: {
      fr: "Foie Gras Poêlé — Fruit de saison, Jus réduit",
      vi: "Gan ngỗng áp chảo — trái cây theo mùa, nước sốt cô đặc",
      en: "Seared foie gras, seasonal fruit, reduced jus",
      ja: "フォアガラのポワレ — 季節のフルーツ、レデュースドジュ",
      ko: "팬에 구운 거위간 요리 — 계절 과일, 농축 소스",
      hk: "香煎法式鵝肝 — 伴時令水果 및 濃縮肉汁"
    },
    description: {
      fr: "Foie gras de canard poêlé, accompagné de fruits de saison et d'un jus réduit.",
      vi: "Gan ngỗng Pháp áp chảo hoàn hảo bên ngoài mềm mại bên trong, dùng kèm trái cây theo mùa và nước sốt cô đặc.",
      en: "Pan-seared duck foie gras with seasonal fruit and a rich reduced jus.",
      ja: "表面はカリッと中はクリーミーに仕上げたフォアグラ의ポワレ。酸味のある季節のフルーツと濃厚なソースとともに。",
      ko: "겉은 바삭하고 속은 부드럽게 구워낸 오리 거위간에 상큼한 계절 과일과 깊은 풍미의 농축 소스를 곁들인 고급 요리.",
      hk: "外脆內嫩的香煎頂級鴨鵝肝，搭配酸甜適口的時令水果與特製濃縮肉汁，完美平衡油膩感。"
    },
    price_dine_in: 495000, price_takeaway: 0, category: 'Soup', available: true, seasonal_flag: true,
  },

  // ── LES SIGNATURES DE MAISON VIE (Món Signature - 3 món) ─────────────────
  {
    id: 'ec300003-0000-4000-b000-000000000001',
    name: {
      fr: "Cabillaud au miso — Légumes verts",
      vi: "Cá tuyết đen ướp miso, rau xanh theo mùa, bơ nâu",
      en: "Miso-marinated black cod, seasonal greens, brown butter",
      ja: "銀だらの味噌漬け焼き — 季節の青菜、焦がしバター",
      ko: "은대구 미소 구이 — 제철 푸른 야채, 브라운 버터",
      hk: "味噌漬銀鱈魚 — 伴時令青菜及榛果褐黃油"
    },
    description: {
      fr: "Cabillaud noir mariné au miso blanc, accompagné de légumes de saison et d'un beurre noisette noisette.",
      vi: "Cá tuyết đen ướp miso trắng, dùng kèm rau xanh theo mùa và bơ nâu thơm.",
      en: "White miso-marinated black cod with seasonal greens and nutty brown butter.",
      ja: "白味噌でマリネした銀だらをふっくら焼き上げ、季節の青菜と風味豊かな焦がしバターで演出。",
      ko: "백미소에 마리네이드해 구운 촉촉한 은대구에 제철 푸른 야채와 뵈르 누아제트(브라운 버터) 소스를 곁들인 요리.",
      hk: "用白味噌醃漬的深海銀鱈魚，火候精準，肉質細嫩，伴以青菜及芳香的焦糖褐黃油。"
    },
    price_dine_in: 855000, price_takeaway: 0, category: 'Main Course', available: true, seasonal_flag: false,
  },
  {
    id: 'ec300003-0000-4000-b000-000000000002',
    name: {
      fr: "Wellington de buffle — Champignons, poivre Phú Quốc",
      vi: "Wellington thịt trâu Việt Nam, nhân nấm duxelles, sốt tiêu Phú Quốc",
      en: "Vietnamese buffalo Wellington, mushroom duxelles, Phú Quốc pepper jus",
      ja: "ベトナム水牛のウェリントン風 — キノコのデュクセル、フーコック産ペッパーソース",
      ko: "베트남 버팔로 웰링턴 — 버섯 듁셀, 푸꾸옥 통후추 소스",
      hk: "越南水牛威靈頓 — 伴野菌醬及富國島胡椒汁"
    },
    description: {
      fr: "Wellington de buffle vietnamien en croûte dorée avec duxelles de champignons et jus au poivre de Phú Quốc.",
      vi: "Thịt trâu Việt Nam bọc vỏ bánh vàng ruộm, nhân nấm duxelles ngọt bùi, dùng kèm sốt tiêu Phú Quốc thơm cay.",
      en: "Vietnamese buffalo tenderloin wrapped in golden pastry with mushroom duxelles and Phú Quốc pepper jus.",
      ja: "ベトナム水牛のフィレをサクサクのパイ生地で包み、キノコのデュクセルとフーコック特産コショウソースで仕上げた極上の逸品。",
      ko: "베트남식 수우 안심에 향긋한 버섯 듁셀을 감싸 페이스트리로 굽고 상큼한 푸꾸옥 통후추 주소스를 결들인 시그니처 웰링턴 요리.",
      hk: "招牌水牛外層裹以金黃香酥皮，內餡鋪滿濃香野菌醬，搭配富國島黑胡椒調製的風味肉汁。"
    },
    price_dine_in: 535000, price_takeaway: 0, category: 'Main Course', available: true, seasonal_flag: false,
  },
  {
    id: 'ec300003-0000-4000-b000-000000000003',
    name: {
      fr: "Risotto à la Truffe Noire et Champignons de Tam Đảo",
      vi: "Risotto nấm cục đen và nấm rừng Tam Đảo, bơ Échiré, Parmesan",
      en: "Black truffle risotto with Tam Đảo wild mushrooms, Échiré butter, Parmesan",
      ja: "黒トリュフとタムダオ産キノコのリゾット — エシレバター、パルミジャーノ",
      ko: "블랙 트러플과 탐다오 야생 버섯 리조토 — 에시레 버터, 파마산 치즈",
      hk: "黑松露及三島野菌燴飯 — 伴艾許有鹽牛油及巴馬臣芝士"
    },
    description: {
      fr: "Risotto crémeux à la truffe et champignons de Tam Đảo, monté au beurre Échiré AOP et parmesan affiné 24 mois.",
      vi: "Risotto sánh mịn với nấm cục đen và nấm rừng Tam Đảo, hoàn thiện với bơ Échiré AOP béo ngậy và phô mai Parmesan ủ 24 tháng.",
      en: "Creamy black truffle and Tam Đảo wild mushroom risotto finished with Échiré AOP butter and 24-month Parmesan.",
      ja: "タムダオ産キノコと高級黒トリュフを使用したリゾット。フランス産エシレバターと24ヶ月熟成のパルミジャーノで極上のコクを引き出しました。",
      ko: "탐다오 야생 버섯과 은은한 블랙 트러플 풍미에 최고급 에시레 AOP 버터와 24개원 숙성 파마산 치즈로 녹진함을 더한 크리미 리조토.",
      hk: "選用三島野菌與黑松露，以頂級艾許AOP牛油及24個月熟成巴馬臣芝士慢煮燴製，口感濃郁軟糯。"
    },
    price_dine_in: 435000, price_takeaway: 0, category: 'Main Course', available: true, seasonal_flag: false,
  },

  // ── PLATS PRINCIPAUX (Món Chính - 8 món) ─────────────────────────────────
  {
    id: 'ec400004-0000-4000-b000-000000000001',
    name: {
      fr: "Langoustine Rôtie — Beurre noisette, Cuisson précise",
      vi: "Tôm hùm baby áp chảo, bơ nâu, kiểm soát nhiệt chính xác",
      en: "Roasted langoustine, brown butter, precise cuisson",
      ja: "手長エビのロースト — 焦がしバター、的確な火入れ",
      ko: "랍스터 테일 구이 — 브라운 버터, 완벽한 로스팅",
      hk: "香烤小龍蝦 — 伴榛果褐黃油及精確火候"
    },
    description: {
      fr: "Langoustine rôtie à cuisson précise, nappée d'un beurre noisette parfumé.",
      vi: "Tôm hùm baby áp chảo chín tới hoàn hảo, rưới bơ nâu thơm lừng béo ngậy.",
      en: "Precisely roasted langoustine drizzled with aromatic brown butter.",
      ja: "絶妙な火入れでジューシーに仕上げた手長エビに、香ばしいナッツ風味の焦がしバターソースをかけて。",
      ko: "섬세한 온도 제어로 완벽하게 구워내 육즙이 살아있는 랍스터 테일에 브라운 버터 소스를 뿌린 메인 요리.",
      hk: "火候精準掌握的烤小龍蝦，肉質彈牙，淋上散發榛果香氣的焦糖白奶油褐黃油。"
    },
    price_dine_in: 990000, price_takeaway: 0, category: 'Main Course', available: true, seasonal_flag: false,
  },
  {
    id: 'ec400004-0000-4000-b000-000000000002',
    name: {
      fr: "Saint-Jacques — Beurre blanc, agrumes",
      vi: "Sò điệp áp chảo, beurre blanc nhẹ, điểm chua thanh",
      en: "Pan-seared scallops, light beurre blanc, citrus note",
      ja: "ホタテのポワレ — 軽いブールブランソース、シトラスの香り",
      ko: "가리비 관자 구이 — 가벼운 뵈르 블랑 소스, 시트러스 향",
      hk: "香煎帆立貝 — 伴輕奶油白汁及柑橘香"
    },
    description: {
      fr: "Saint-Jacques poêlées dorées, sauce beurre blanc légère et note d'agrumes rafraîchissante.",
      vi: "Sò điệp Hokkaido áp chảo vàng ruộm, dùng kèm sốt bơ trắng (beurre blanc) nhẹ và điểm chua thanh của cam chanh.",
      en: "Golden pan-seared scallops with a light beurre blanc and refreshing citrus note.",
      ja: "香ばしくソテーした大ぶりのホタテ。クラシックなブールブラン（白ワインバターソース）に爽やかな柑橘の酸味をプラス。",
      ko: "노릇하게 구워낸 가리비 관자에 프랑스 전통 뵈르 블랑 소스와 은은한 시트러스 향을 곁들여 풍미를 돋운 요리.",
      hk: "煎至表面金黃的北海道大帆立貝，佐以輕盈的法式白奶油醬，伴以清新的柑橘風味。"
    },
    price_dine_in: 695000, price_takeaway: 0, category: 'Main Course', available: true, seasonal_flag: false,
  },
  {
    id: 'ec400004-0000-4000-b000-000000000003',
    name: {
      fr: "Bar du Vietnam — Beurre blanc, agrumes",
      vi: "Cá vược Việt Nam áp chảo — beurre blanc — điểm chua thanh",
      en: "Pan-seared Vietnamese seabass — beurre blanc — citrus note",
      ja: "ベトナム産スズキのポワレ — ブールブランソース、柑橘風味",
      ko: "베트남산 농어 구이 — 뵈르 블랑 소스, 시트러스 터치",
      hk: "香煎越南海鱸魚 — 伴白奶油醬及柑橘汁"
    },
    description: {
      fr: "Bar du Vietnam poêlé à la peau croustillante, sauce beurre blanc et zeste d'agrumes.",
      vi: "Cá vược Việt Nam áp chảo da giòn rụm, dùng kèm sốt beurre blanc béo nhẹ và hương vỏ cam chanh tươi.",
      en: "Crispy skin Vietnamese seabass with beurre blanc sauce and fresh citrus zest.",
      ja: "皮目をパリッと香ばしく焼き上げたベトナム産のスズキ。レモンの酸味が効いたリッチなブールブランソースで。",
      ko: "껍질을 바삭하게 구워내 겉바속촉 식감의 농어에 크리미한 뵈르 블랑 소스와 상큼한 유자 제스트를 올린 요리.",
      hk: "煎至外皮金黃酥脆的越南海鱸魚，佐以香濃滑順的法式白奶油醬與新鮮柑橘皮絲。"
    },
    price_dine_in: 435000, price_takeaway: 0, category: 'Main Course', available: true, seasonal_flag: false,
  },
  {
    id: 'ec400004-0000-4000-b000-000000000004',
    name: {
      fr: "Magret de canard — Prunes de Sapa, Madère",
      vi: "Lườn vịt Việt Nam — mứt mận Sapa — sốt Madère",
      en: "Vietnamese duck breast — Sapa plum compote — Madeira jus",
      ja: "ベトナム産鴨胸肉のロースト — サパ産プラムのコンポート、マデイラソース",
      ko: "베트남 오리 가슴살 스테이크 — 사파 자두 컴포트, 마데이라 소스",
      hk: "香煎越南鴨胸 — 伴沙壩李子果醬及馬德拉醬汁"
    },
    description: {
      fr: "Magret de canard vietnamien rosé, compote de prunes de Sapa et jus au Madère.",
      vi: "Ức vịt áp chảo tái hồng da giòn, dùng kèm mứt mận Sapa chua ngọt và sốt Madère đậm đà.",
      en: "Pan-seared duck breast served medium-rare with sweet-sour Sapa plum compote and rich Madeira wine reduction.",
      ja: "絶妙なミディアムレアに焼き上げた鴨胸肉。サパ特産のプラムで作った甘酸っぱいコンポートと、深みのあるマデイラワインソース。",
      ko: "부드럽고 쥬시하게 구운 오리 가슴살에 사파 특산 자두 컴포트의 단맛과 진한 마데이라 소스의 감칠맛을 더한 요리.",
      hk: "煎至熟度適中、肉汁飽滿的香嫩鴨胸，佐以沙壩高山李子醬與香濃的馬德拉葡萄酒醬汁。"
    },
    price_dine_in: 435000, price_takeaway: 0, category: 'Main Course', available: true, seasonal_flag: false,
  },
  {
    id: 'ec400004-0000-4000-b000-000000000005',
    name: {
      fr: "Carré d'agneau, Herbes vietnamiennes, Céleri-rave",
      vi: "Sườn cừu nướng vỏ thảo mộc Việt, nước sốt đậm hương, củ cần tây",
      en: "Herb-crusted lamb rack, aromatic reduction, celeriac",
      ja: "香草風味の子羊の背肉 — 濃厚なジュ、セルリアック",
      ko: "허브 크러스트 양갈비 구이 — 농축 소스, 셀러리악",
      hk: "香草烤羊鞍 — 伴濃郁肉汁及芹菜根"
    },
    description: {
      fr: "Carré d'agneau en croûte d'herbes vietnamiennes, lentilles du Puy et purée de céleri-rave.",
      vi: "Sườn cừu nướng bọc vỏ thảo mộc Việt thơm lừng, dùng kèm nước dùng cô đặc và purée củ cần tây mịn.",
      en: "Herb-crusted lamb rack with Vietnamese herbs, served with rich reduced jus and celeriac purée.",
      ja: "ベトナムの香草をブレンドした特製パン粉で焼き上げた骨付きラム。濃厚な肉汁ソースとセロリアックのピューレを添えて。",
      ko: "향긋한 로컬 허브 튀김옷을 입혀 미디움으로 오븐 구이한 프리미엄 양갈비. 짭조름한 소스와 크리미한 셀러리악 퓨레 곁들임.",
      hk: "外層覆蓋新鮮越南香草麵包糠烤製的羊排，配以慢熬濃郁肉汁及綿滑芹菜根泥。"
    },
    price_dine_in: 990000, price_takeaway: 0, category: 'Main Course', available: true, seasonal_flag: false,
  },
  {
    id: 'ec400004-0000-4000-b000-000000000008',
    name: {
      fr: "Côte de Bœuf Black Angus, Pommes grenaille, Échalote confite",
      vi: "Bò Black Angus ribeye, khoai grenaille, hành tím confit",
      en: "Black Angus ribeye, grenaille potatoes, shallot confit",
      ja: "ブラックアンガス牛リブアイ — グルナイユポテト、エシャロットのコンフィ",
      ko: "블랙 앵거스 꽃등심 구이 — 알감자, 샬롯 콘피",
      hk: "安格斯肋眼牛排 — 伴小土豆及油封香蔥"
    },
    description: {
      fr: "Entrecôte Black Angus grillée, accompagnée de pommes de terre grenaille sautées et d'échalotes confites fondantes.",
      vi: "Bò thăn ngoại Black Angus nướng thơm, dùng kèm khoai tây baby chiên bơ và hành tím confit ngọt ngào.",
      en: "Grilled Black Angus ribeye served with roasted grenaille baby potatoes and melt-in-your-mouth shallot confit.",
      ja: "極上のブラックアンガス牛リブアイ。じっくり香ばしく焼き上げ、ローストした小ジャガイモと甘く柔らかいエシャロットのコンフィを添えて。",
      ko: "풍부한 마블링의 블랙 앵거스 꽃등심을 그릴에 구워 고소한 알감자 구이와 부드러운 샬롯 콘피를 매칭한 요리.",
      hk: "優質黑安格斯肉眼牛扒，烤至香氣四溢，配以香草炒小馬鈴薯與香甜軟糯的油封紅蔥頭。"
    },
    price_dine_in: 890000, price_takeaway: 0, category: 'Main Course', available: true, seasonal_flag: false,
  },
  {
    id: 'ec400004-0000-4000-b000-000000000006',
    name: {
      fr: "Bœuf Wagyu MBS 6–7, Jus Maison Vie (120 g)",
      vi: "Bò Wagyu MBS 6–7 áp chảo, sốt Maison Vie, rau củ theo mùa (120 g)",
      en: "Seared Wagyu beef MBS 6–7, Maison Vie jus, seasonal garnish (120 g)",
      ja: "和牛 MBS 6–7 のポワレ — メゾン・ヴィ特製ジュ、季節の温野菜 (120 g)",
      ko: "와규 MBS 6–7 구이 — 메종 비 소스, 계절 채소 (120 g)",
      hk: "香煎和牛 MBS 6–7 — 伴招牌肉汁及時令蔬菜 (120 g)"
    },
    description: {
      fr: "Bœuf Wagyu MBS 6–7 saisi, accompagné de légumes de saison et d'un jus Maison Vie réduit.",
      vi: "Thịt bò Wagyu MBS 6–7 áp chảo chín vừa, ăn kèm rau củ hữu cơ theo mùa và sốt nước dùng Maison Vie hầm cô đặc.",
      en: "Pan-seared premium Wagyu beef MBS 6-7, served with seasonal garden vegetables and rich signature Maison Vie jus.",
      ja: "見事なサシが入った最高級Wagyu（MBS6-7クラス）のポワレ。コクのある肉汁ベースの自家製ソースと旬の温野菜。",
      ko: "최상급 와규 MBS 6-7 꽃등심을 구워 육즙을 채우고, 가벼운 계절 야채와 정성껏 끓인 시그니처 주소스를 곁들인 명품 스테이크.",
      hk: "頂級和牛（大理石花紋分數MBS 6-7），雙面煎烤鎖住肉汁，佐以精燉招牌肉汁與大叻時蔬。"
    },
    price_dine_in: 1595000, price_takeaway: 0, category: 'Main Course', available: true, seasonal_flag: false,
  },
  {
    id: 'ec400004-0000-4000-b000-000000000007',
    name: {
      fr: "Plat Végétal — Légumineuses, Racines",
      vi: "Món chính chay cao cấp — đậu và củ, cấu trúc và chiều sâu",
      en: "Vegetable main, legumes and roots, depth and texture",
      ja: "野菜のメインディッシュ — 豆類と根菜、食感と深い味わい",
      ko: "프리미엄 채식 메인 요리 — 두류와 뿌리채소, 식감과 풍미",
      hk: "精緻蔬食主菜 — 豆類與根莖蔬菜，層次與深度"
    },
    description: {
      fr: "Composition végétale autour des légumineuses et racines, alliant texture et profondeur de goût.",
      vi: "Món chính thuần chay từ các loại đậu hữu cơ và củ rễ theo mùa, kết hợp cấu trúc phong phú và chiều sâu hương vị.",
      en: "Plant-based composition of legumes and roots with depth of flavour and varied textures.",
      ja: "様々な豆類と滋味豊かな根菜を巧みに組み合わせ、豊かな食感と奥深いコクを引き出した本格的な野菜メインディッシュ。",
      ko: "유기농 두류와 제철 뿌리채소를 조화롭게 구성하여 풍부한 식감과 깊은 맛을 낸 고급 채식 요리.",
      hk: "選用多種有機豆類及時令根莖類蔬菜，精心烹調，呈現豐富的口感層次與深厚的自然風味。"
    },
    price_dine_in: 290000, price_takeaway: 0, category: 'Main Course', available: true, seasonal_flag: false,
  },

  // ── FROMAGES & DESSERTS (Phô Mai & Tráng Miệng - 5 món) ──────────────────
  {
    id: 'ec500005-0000-4000-b000-000000000001',
    name: {
      fr: "Sélection de Fromages Français Affinés",
      vi: "Tuyển chọn phô mai Pháp ủ chín",
      en: "Selection of mature French cheeses",
      ja: "フランス産熟成チーズのセレクト",
      ko: "엄선한 프랑스 전통 숙성 치즈 플레이트",
      hk: "精選法式熟成芝士拼盤"
    },
    description: {
      fr: "Sélection de fromages français affinés, servis avec accompagnements traditionnels.",
      vi: "Tuyển chọn các loại phô mai Pháp ủ chín đặc sắc, dùng kèm các loại hạt và mứt trái cây khô.",
      en: "A curated selection of mature French cheeses with traditional accompaniments.",
      ja: "ソムリエが厳選した熟成フランス産チーズ。ナッツやドライフルーツなど伝統的な付け合わせとともに。",
      ko: "프랑스 각 지역에서 생산되어 알맞게 꿀과 건과일, 견과류를 곁들인 정통 숙성 치즈 모둠.",
      hk: "精選多款法國不同產區的熟成芝士，搭配乾果、堅果及蜂蜜等傳統伴碟。"
    },
    price_dine_in: 395000, price_takeaway: 0, category: 'Dessert', available: true, seasonal_flag: false,
  },
  {
    id: 'ec500005-0000-4000-b000-000000000002',
    name: {
      fr: "Soufflé du moment — Glace vanille de Phú Quốc",
      vi: "Soufflé nóng theo mùa, kem vani Phú Quốc",
      en: "Warm seasonal soufflé, Phú Quốc vanilla ice cream",
      ja: "季節の焼きたてスフレ — フーコック産バニラアイス添え",
      ko: "시즌 스페셜 수플레 — 푸꾸옥 바닐라 아이스크림",
      hk: "時令現焗梳乎厘 — 伴富國島香草雪糕"
    },
    description: {
      fr: "Soufflé chaud préparé à la commande selon l'inspiration du moment, servi avec glace vanille de Phú Quốc.",
      vi: "Bánh soufflé nướng nóng nổi làm theo đơn khi khách gọi món, dùng kèm một viên kem vani Phú Quốc ngọt thơm.",
      en: "Freshly baked seasonal soufflé made to order, served with Phú Quốc vanilla ice cream.",
      ja: "ご注文を受けてからオーブンでふわふわに焼き上げる本日のスフレ。豊かな香りのフーコック産バニラアイスクリームとともに。",
      ko: "주문 즉시 오븐에서 구워내 봉긋하게 부푼 부드러운 수플레. 신선한 푸꾸옥 바닐라 아이스크림이 곁들여집니다.",
      hk: "即點即烘、蓬鬆綿軟的時令風味梳乎厘，搭配自製的富國島天然香草雪糕，冰熱交融。"
    },
    price_dine_in: 235000, price_takeaway: 0, category: 'Dessert', available: true, seasonal_flag: true,
  },
  {
    id: 'ec500005-0000-4000-b000-000000000003',
    name: {
      fr: "Chocolat du Vietnam — Contraste d'Agrumes",
      vi: "Sô-cô-la Việt Nam — đối vị cam chanh",
      en: "Vietnamese chocolate — citrus contrast",
      ja: "ベトナム産チョコレート — 柑橘のコントラスト",
      ko: "베트남 카카오 초콜릿 — 상큼한 시트러스의 대비",
      hk: "越南朱古力 — 伴柑橘對比風味"
    },
    description: {
      fr: "Dessert autour du chocolat vietnamien, en contraste avec des notes vives d'agrumes.",
      vi: "Món tráng miệng tinh tế chế biến từ sô-cô-la thủ công Việt Nam, kết hợp vị đắng ấm tương phản với nốt chua thanh của cam quýt.",
      en: "Vietnamese chocolate dessert with a vibrant citrus contrast.",
      ja: "高品質なベトナム産カカオのダークチョコレートを使用。柑橘フルーツの爽やかな酸味との見事な対比を楽しむデセール。",
      ko: "세계적으로 각광받는 싱글 오리진 베트남 초콜릿의 깊은 달콤 쌉싸름함과 신선한 오렌지, 귤의 산뜻함이 극적 대조를 이루는 디저트.",
      hk: "選用優質越南本地黑朱古力，質地細滑，與清新柑橘的水果酸甜形成絕妙的味覺對比。"
    },
    price_dine_in: 155000, price_takeaway: 0, category: 'Dessert', available: true, seasonal_flag: false,
  },
  {
    id: 'ec500005-0000-4000-b000-000000000004',
    name: {
      fr: "Crème brûlée — Vanille de Phú Quốc",
      vi: "Crème brûlée vani Phú Quốc — lớp caramel giòn",
      en: "Phú Quốc vanilla crème brûlée — crisp caramel",
      ja: "フーコック産バニラのクレームブリュレ — パリパリのキャラメル",
      ko: "푸꾸옥 바닐라 크림 브륄레 — 바삭한 캐러멜 토핑",
      hk: "富國島香草焦糖燉蛋 — 伴香脆焦糖面"
    },
    description: {
      fr: "Crème brûlée onctueuse à la vanille naturelle de Phú Quốc, caramel croustillant réalisé à la flamme.",
      vi: "Kem trứng custard sánh mịn từ vani tự nhiên Phú Quốc, phủ lớp đường khò vàng giòn tan.",
      en: "Smooth crème brûlée with natural Phú Quốc vanilla, finished with a flame-kissed crisp caramel.",
      ja: "香り高いフーコック産天然バニラビーンズを使用した濃厚なプリン液。表面の砂糖をバーナーで焦がし、パリパリの食感に。",
      ko: "푸꾸옥 천연 바닐라 빈을 듬뿍 넣은 부드러운 커스터드 크림 위에 설탕을 올려 불로 바삭하게 그을린 프랑스 전통 디저트.",
      hk: "燉煮滑嫩的富國島天然香草蛋奶凍，撒上砂糖後以火槍噴烘出香脆微焦的焦糖薄殼。"
    },
    price_dine_in: 135000, price_takeaway: 0, category: 'Dessert', available: true, seasonal_flag: false,
  },
  {
    id: 'ec500005-0000-4000-b000-000000000005',
    name: {
      fr: "Assiette de fruits tropicaux",
      vi: "Tuyển chọn trái cây nhiệt đới theo mùa",
      en: "Seasonal tropical fruit selection",
      ja: "季節のトロピカルフルーツの盛り合わせ",
      ko: "제철 열대과일 모둠 플래터",
      hk: "時令熱帶鮮果拼盤"
    },
    description: {
      fr: "Sélection de fruits tropicaux frais de saison, servis nature pour une fraîcheur absolue.",
      vi: "Tuyển chọn các loại trái cây nhiệt đới tươi chín tự nhiên theo mùa, giữ trọn vẹn hương sắc tươi mát.",
      en: "Fresh seasonal tropical fruits served naturally for pure, vibrant freshness.",
      ja: "厳選された新鮮なベトナムの熱帯フルーツをそのままお召し上がりいただく、フレッシュで贅沢な一皿。",
      ko: "잘 익은 제철 열대 과일들을 엄선하여 신선하고 다채롭게 구성한 과일 플래터.",
      hk: "精心挑选的時令熱帶水果，色彩繽紛，天然清甜，為完美一餐畫下句點。"
    },
    price_dine_in: 195000, price_takeaway: 0, category: 'Dessert', available: true, seasonal_flag: true,
  },
];

const ALLERGEN_MAP = [
  // Appetizers
  { item: 'ec100001-0000-4000-b000-000000000001', codes: ['FISH', 'SULPHITES'] },
  { item: 'ec100001-0000-4000-b000-000000000002', codes: ['FISH', 'MILK', 'SULPHITES'] },
  { item: 'ec100001-0000-4000-b000-000000000003', codes: ['CRUSTACEANS', 'SULPHITES'] },
  { item: 'ec100001-0000-4000-b000-000000000004', codes: ['MOLLUSCS', 'FISH', 'MILK', 'SULPHITES'] },
  { item: 'ec100001-0000-4000-b000-000000000005', codes: ['MILK'] },
  // Soups
  { item: 'ec200002-0000-4000-b000-000000000001', codes: ['GLUTEN', 'MILK', 'SULPHITES'] },
  { item: 'ec200002-0000-4000-b000-000000000002', codes: ['CRUSTACEANS', 'MILK', 'SULPHITES'] },
  { item: 'ec200002-0000-4000-b000-000000000003', codes: ['MILK'] },
  { item: 'ec200002-0000-4000-b000-000000000004', codes: ['GLUTEN', 'MILK', 'MOLLUSCS', 'SULPHITES'] },
  { item: 'ec200002-0000-4000-b000-000000000005', codes: ['SULPHITES'] },
  // Signatures
  { item: 'ec300003-0000-4000-b000-000000000001', codes: ['FISH', 'SOYA', 'MILK', 'SULPHITES'] },
  { item: 'ec300003-0000-4000-b000-000000000002', codes: ['GLUTEN', 'MILK', 'EGGS', 'SULPHITES'] },
  { item: 'ec300003-0000-4000-b000-000000000003', codes: ['MILK', 'SULPHITES'] },
  // Main courses
  { item: 'ec400004-0000-4000-b000-000000000001', codes: ['CRUSTACEANS', 'MILK', 'SULPHITES'] },
  { item: 'ec400004-0000-4000-b000-000000000002', codes: ['MOLLUSCS', 'MILK', 'SULPHITES'] },
  { item: 'ec400004-0000-4000-b000-000000000003', codes: ['FISH', 'MILK', 'SULPHITES'] },
  { item: 'ec400004-0000-4000-b000-000000000004', codes: ['SULPHITES'] },
  { item: 'ec400004-0000-4000-b000-000000000005', codes: ['MILK', 'SULPHITES'] },
  { item: 'ec400004-0000-4000-b000-000000000008', codes: ['MILK', 'SULPHITES'] },
  { item: 'ec400004-0000-4000-b000-000000000006', codes: ['MILK', 'SULPHITES'] },
  // Desserts
  { item: 'ec500005-0000-4000-b000-000000000001', codes: ['MILK', 'SULPHITES'] },
  { item: 'ec500005-0000-4000-b000-000000000002', codes: ['GLUTEN', 'MILK', 'EGGS'] },
  { item: 'ec500005-0000-4000-b000-000000000003', codes: ['MILK', 'EGGS'] },
  { item: 'ec500005-0000-4000-b000-000000000004', codes: ['MILK', 'EGGS'] },
];

async function main() {
  console.log('🗑️ Xóa các món ăn À La Carte cũ...');
  
  // Xóa các allergens trước của các món ăn À La Carte
  const menuIdsToDelete = MENU_ITEMS.map(i => i.id);
  const idsString = menuIdsToDelete.map(id => id).join(',');
  
  await rest('DELETE', 'menu_item_allergens', null, `?menu_item_id=in.(${idsString})`);
  console.log('   ✓ Đã xóa liên kết allergen cũ');

  // Xóa các món ăn À La Carte (lọc theo categories cụ thể để không ảnh hưởng Set Menu Price)
  await rest('DELETE', 'menu_items', null, `?category=in.(Appetizer,Soup,"Main Course",Dessert)`);
  console.log('   ✓ Đã dọn dẹp danh mục À La Carte cũ');

  // Nạp menu mới
  console.log(`\n📋 Nạp ${MENU_ITEMS.length} món ăn mới (À La Carte 2026)...`);
  await rest('POST', 'menu_items', MENU_ITEMS);
  console.log(`   ✓ Nạp thành công ${MENU_ITEMS.length} món`);

  // Fetch allergen category IDs
  const allergens = await rest('GET', 'allergen_categories', null, '?select=id,code');
  const allergenMap = {};
  allergens.forEach(a => { allergenMap[a.code] = a.id; });

  // Nạp allergen links
  console.log('\n⚠️ Nạp thông tin dị ứng...');
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
  console.log(`   ✓ Đã liên kết ${allergenRows.length} dị ứng`);

  console.log('\n✅ Hoàn tất thiết lập lại menu À La Carte 2026!');
}

main().catch(err => {
  console.error('❌ Thất bại:', err.message);
  process.exit(1);
});
