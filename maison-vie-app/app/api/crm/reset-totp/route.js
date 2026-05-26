/**
 * API Route: /api/crm/reset-totp
 * Xóa tất cả TOTP factor unverified của user (dùng Supabase Admin REST API trực tiếp)
 */
import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request) {
  try {
    const { userId } = await request.json();
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const H = {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
    };

    // 1. List all factors for this user
    const listRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}/factors`, { headers: H });
    const factors = await listRes.json();

    if (!Array.isArray(factors)) {
      return NextResponse.json({ error: 'Cannot list factors', raw: factors }, { status: 500 });
    }

    const totpFactors = factors.filter(f => f.factor_type === 'totp');
    const verified   = totpFactors.filter(f => f.status === 'verified');
    const unverified = totpFactors.filter(f => f.status !== 'verified');

    // 2. Delete all unverified TOTP factors
    for (const f of unverified) {
      await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}/factors/${f.id}`, {
        method: 'DELETE',
        headers: H,
      });
    }

    return NextResponse.json({
      deleted: unverified.length,
      hasVerified: verified.length > 0,
      verifiedFactorId: verified[0]?.id || null,
    });

  } catch (e) {
    console.error('reset-totp error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
