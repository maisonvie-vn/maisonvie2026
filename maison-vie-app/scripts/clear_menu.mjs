const URL_BASE = 'https://soceewbooszqkutkbylm.supabase.co/rest/v1';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvY2Vld2Jvb3N6cWt1dGtieWxtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTY5MTIyNiwiZXhwIjoyMDk1MjY3MjI2fQ.9yBb_0GZsp4dLjsm7-AgRzwp-TYdSwB4FZ7aQYCnHfU';
const H = { 'apikey': KEY, 'Authorization': 'Bearer ' + KEY };

(async () => {
  let r = await fetch(`${URL_BASE}/menu_item_allergens?menu_item_id=neq.00000000-0000-0000-0000-000000000000`, { method: 'DELETE', headers: H });
  console.log('allergens deleted, status:', r.status);
  r = await fetch(`${URL_BASE}/menu_items?id=neq.00000000-0000-0000-0000-000000000000`, { method: 'DELETE', headers: H });
  console.log('menu_items deleted, status:', r.status);
  console.log('✅ Xong! Database menu đã sạch hoàn toàn.');
})();
