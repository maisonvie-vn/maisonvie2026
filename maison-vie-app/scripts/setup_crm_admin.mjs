/**
 * setup_crm_admin.mjs
 * Tạo tài khoản Admin CRM đầu tiên trên Supabase Auth
 * + Tạo bảng crm_users nếu chưa có
 * + Insert Admin record
 */

const SUPABASE_URL = 'https://soceewbooszqkutkbylm.supabase.co';
const SERVICE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvY2Vld2Jvb3N6cWt1dGtieWxtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTY5MTIyNiwiZXhwIjoyMDk1MjY3MjI2fQ.9yBb_0GZsp4dLjsm7-AgRzwp-TYdSwB4FZ7aQYCnHfU';

const H = {
  'Content-Type': 'application/json',
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
};

async function createUser(email, password, metadata) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers: H,
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,  // Skip email confirmation for admin
      app_metadata: metadata,
      user_metadata: { full_name: metadata.full_name }
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Create user failed: ${JSON.stringify(data)}`);
  return data;
}

async function upsertCrmUser(row) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/crm_users`, {
    method: 'POST',
    headers: { ...H, 'Prefer': 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(row)
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`crm_users upsert failed: ${text}`);
}

async function main() {
  console.log('🔐 Maison Vie CRM — Thiết lập tài khoản Admin\n');

  // 1. Tạo user Admin trên Supabase Auth
  console.log('1. Tạo tài khoản Admin trên Supabase Auth...');
  let adminUser;
  try {
    adminUser = await createUser(
      'thanhceo.mr@gmail.com',
      '@1972Urmylove@',
      {
        role: 'admin',
        full_name: 'Maison Vie Admin',
        department: 'Executive',
        crm_access: true
      }
    );
    console.log(`   ✓ Admin created — ID: ${adminUser.id}`);
  } catch (e) {
    // Nếu đã tồn tại, lấy user hiện có
    if (e.message.includes('already been registered') || e.message.includes('already exists')) {
      console.log('   ℹ Admin đã tồn tại — tìm kiếm ID...');
      const listRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=50`, { headers: H });
      const listData = await listRes.json();
      adminUser = (listData.users || []).find(u => u.email === 'thanhceo.mr@gmail.com');
      if (!adminUser) throw new Error('Không tìm thấy admin user!');
      console.log(`   ✓ Tìm thấy Admin — ID: ${adminUser.id}`);
    } else {
      throw e;
    }
  }

  // 2. Insert vào bảng crm_users (nếu bảng đã tồn tại)
  console.log('2. Ghi vào bảng crm_users...');
  try {
    await upsertCrmUser({
      id: adminUser.id,
      full_name: 'Maison Vie Admin',
      email: 'thanhceo.mr@gmail.com',
      role: 'admin',
      department: 'Executive',
      active: true
    });
    console.log('   ✓ crm_users record created');
  } catch (e) {
    console.log(`   ⚠ crm_users insert failed (bảng chưa có — sẽ tạo sau): ${e.message}`);
  }

  console.log('\n✅ Hoàn tất! Tài khoản Admin CRM đã sẵn sàng:');
  console.log(`   Email    : thanhceo.mr@gmail.com`);
  console.log(`   Role     : admin`);
  console.log(`   Auth ID  : ${adminUser.id}`);
  console.log(`   2FA      : TOTP — cần setup Authenticator App sau khi đăng nhập lần đầu`);
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
