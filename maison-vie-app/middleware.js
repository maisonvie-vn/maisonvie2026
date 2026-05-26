import { NextResponse } from 'next/server';

// Các trang auth không cần bảo vệ
const PUBLIC_CRM_PATHS = [
  '/crm/login',
  '/crm/verify',
  '/crm/setup-totp',
  '/crm/unauthorized',
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Chỉ xử lý /crm/*
  if (!pathname.startsWith('/crm')) return NextResponse.next();

  // Cho qua các trang auth
  if (PUBLIC_CRM_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  try {
    // Kiểm tra Supabase session cookie (sb-*-auth-token)
    const cookies = request.cookies;
    const hasSession = cookies.getAll().some(
      c => c.name.includes('auth-token') || c.name.includes('supabase')
    );

    if (!hasSession) {
      const url = new URL('/crm/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (e) {
    // Nếu có lỗi bất ngờ → redirect về login thay vì crash
    console.error('CRM middleware error:', e.message);
    const url = new URL('/crm/login', request.url);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/crm/:path*'],
};
