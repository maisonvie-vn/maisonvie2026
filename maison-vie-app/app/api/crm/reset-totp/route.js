/**
 * API Route: /api/crm/reset-totp
 * Xóa tất cả TOTP factor unverified của user hiện tại (server-side)
 * Chỉ dùng nội bộ trong luồng setup-totp
 */
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { userId } = await request.json();
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    // List all factors for this user
    const { data: factors, error: listErr } = await adminClient.auth.admin.mfa.listFactors({ userId });
    if (listErr) throw listErr;

    // Delete only unverified TOTP factors
    const unverified = (factors || []).filter(
      f => f.factor_type === 'totp' && f.status === 'unverified'
    );

    for (const f of unverified) {
      await adminClient.auth.admin.mfa.deleteFactor({ userId, id: f.id });
    }

    const verified = (factors || []).filter(
      f => f.factor_type === 'totp' && f.status === 'verified'
    );

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
