const SUPABASE_URL = 'https://soceewbooszqkutkbylm.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvY2Vld2Jvb3N6cWt1dGtieWxtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTY5MTIyNiwiZXhwIjoyMDk1MjY3MjI2fQ.9yBb_0GZsp4dLjsm7-AgRzwp-TYdSwB4FZ7aQYCnHfU';

const HEADERS = {
  'Content-Type': 'application/json',
  'apikey': SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  'Prefer': 'resolution=merge-duplicates',
};

const PRICES_DATA = [
  { id: 'd0000001-e000-4000-b000-000000000001', name: { en: 'degustation_services_3', vi: 'Giá Degustation 3 món', fr: 'Prix Dégustation 3 services' }, price: 955000 },
  { id: 'd0000001-e000-4000-b000-000000000002', name: { en: 'degustation_services_4', vi: 'Giá Degustation 4 món', fr: 'Prix Dégustation 4 services' }, price: 1155000 },
  { id: 'd0000001-e000-4000-b000-000000000003', name: { en: 'degustation_services_5', vi: 'Giá Degustation 5 món', fr: 'Prix Dégustation 5 services' }, price: 1455000 },
  { id: 'd0000001-e000-4000-b000-000000000004', name: { en: 'degustation_services_6', vi: 'Giá Degustation 6 món', fr: 'Prix Dégustation 6 services' }, price: 1515000 },
  { id: 'd0000001-e000-4000-b000-000000000005', name: { en: 'degustation_services_7', vi: 'Giá Degustation 7 món', fr: 'Prix Dégustation 7 services' }, price: 1695000 },
  
  { id: 'd0000001-e000-4000-b000-000000000006', name: { en: 'degustation_pairing_3_4', vi: 'Kết hợp rượu 3-4 món', fr: 'Accord vin 3-4 services' }, price: 1400000 },
  { id: 'd0000001-e000-4000-b000-000000000007', name: { en: 'degustation_pairing_5', vi: 'Kết hợp rượu 5 món', fr: 'Accord vin 5 services' }, price: 2200000 },
  { id: 'd0000001-e000-4000-b000-000000000008', name: { en: 'degustation_pairing_6_7', vi: 'Kết hợp rượu 6-7 món', fr: 'Accord vin 6-7 services' }, price: 3000000 },
  
  { id: 'd0000001-e000-4000-b000-000000000009', name: { en: 'degustation_supp_premium', vi: 'Phụ thu tôm hùm baby', fr: 'Supplément langoustine' }, price: 250000 },
  { id: 'd0000001-e000-4000-b000-000000000010', name: { en: 'degustation_supp_agneau', vi: 'Phụ thu sườn cừu', fr: 'Supplément agneau' }, price: 200000 },
  { id: 'd0000001-e000-4000-b000-000000000011', name: { en: 'degustation_supp_wagyu', vi: 'Phụ thu bò Wagyu', fr: 'Supplément boeuf Wagyu' }, price: 450000 },
  
  { id: 'd0000001-e000-4000-b000-000000000012', name: { en: 'signature_price', vi: 'Giá Menu Signature', fr: 'Prix Menu Signature' }, price: 1795000 },
  
  { id: 'd0000001-e000-4000-b000-000000000013', name: { en: 'vegetarian_services_2', vi: 'Giá chay 2 món', fr: 'Prix végétarien 2 services' }, price: 455000 },
  { id: 'd0000001-e000-4000-b000-000000000014', name: { en: 'vegetarian_services_3', vi: 'Giá chay 3 món', fr: 'Prix végétarien 3 services' }, price: 565000 },
  { id: 'd0000001-e000-4000-b000-000000000015', name: { en: 'vegetarian_services_4', vi: 'Giá chay 4 món', fr: 'Prix végétarien 4 services' }, price: 755000 },
  
  { id: 'd0000001-e000-4000-b000-000000000016', name: { en: 'business_lunch_services_2', vi: 'Menu d\'Affaires 2 món', fr: 'Menu d\'Affaires 2 services' }, price: 395000 },
  { id: 'd0000001-e000-4000-b000-000000000017', name: { en: 'business_lunch_services_3', vi: 'Menu d\'Affaires 3 món', fr: 'Menu d\'Affaires 3 services' }, price: 485000 },
  { id: 'd0000001-e000-4000-b000-000000000018', name: { en: 'business_lunch_services_4', vi: 'Menu d\'Affaires 4 món', fr: 'Menu d\'Affaires 4 services' }, price: 575000 },
  { id: 'd0000001-e000-4000-b000-000000000019', name: { en: 'business_lunch_supp_premium', vi: 'Phụ thu Bò Bourguignon', fr: 'Supplément Boeuf Bourguignon' }, price: 100000 },
  { id: 'd0000001-e000-4000-b000-000000000020', name: { en: 'business_lunch_tea_coffee', vi: 'Phụ thu Trà hoặc Cà phê', fr: 'Supplément Thé ou Café' }, price: 45000 },
  { id: 'd0000001-e000-4000-b000-000000000021', name: { en: 'business_lunch_wine_glass', vi: 'Ly rượu vang của Chef', fr: 'Verre de vin du chef' }, price: 160000 },
  { id: 'd0000001-e000-4000-b000-000000000022', name: { en: 'business_lunch_wine_pairing_2', vi: 'Ghép cặp 2 ly rượu', fr: 'Accord 2 verres' }, price: 310000 },
  { id: 'd0000001-e000-4000-b000-000000000023', name: { en: 'degustation_supp_black_angus', vi: 'Phụ thu Bò Black Angus', fr: 'Supplément Bœuf Black Angus' }, price: 100000 },
];

async function seed() {
  console.log('🌱 Seeding Set Menu Prices into Supabase database...\n');
  
  const menuItems = PRICES_DATA.map(item => ({
    id: item.id,
    name: item.name,
    description: { en: `Set Menu Price: ${item.name.en}`, vi: item.name.vi, fr: item.name.fr },
    price_dine_in: item.price,
    price_takeaway: 0,
    category: 'Set Menu Price',
    available: true,
    seasonal_flag: false
  }));

  const url = `${SUPABASE_URL}/rest/v1/menu_items`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      ...HEADERS,
      'Prefer': 'resolution=merge-duplicates,return=representation'
    },
    body: JSON.stringify(menuItems)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Seeding failed: ${res.status} - ${text}`);
  }

  const result = await res.json();
  console.log(`✅ Seeded ${result.length} Set Menu Price records successfully.`);
}

seed().catch(console.error);
