import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

// Quyền truy cập theo từng route và role
const ROUTE_PERMISSIONS = {
  '/crm':          ['admin', 'manager', 'accountant', 'chef', 'runner'],
  '/crm/tables':   ['admin', 'manager', 'runner'],
  '/crm/kds':      ['admin', 'manager', 'chef'],
  '/crm/bds':      ['admin', 'manager', 'runner'],
  '/crm/pos':      ['admin', 'manager', 'accountant'],
  '/crm/ai':       ['admin', 'manager'],
  '/crm/training': ['admin', 'manager', 'chef', 'runner'],
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Chỉ áp dụng cho /crm/* (bỏ qua /crm/login và /crm/verify)
  if (!pathname.startsWith('/crm')) return NextResponse.next();
  if (pathname === '/crm/login' || pathname === '/crm/verify' || pathname === '/crm/setup-totp') {
    return NextResponse.next();
  }

  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Kiểm tra session
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    const loginUrl = new URL('/crm/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Kiểm tra MFA
  const { data: { currentLevel } } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (currentLevel !== 'aal2') {
    // User chưa qua 2FA
    const verifyUrl = new URL('/crm/verify', request.url);
    verifyUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(verifyUrl);
  }

  // Kiểm tra role
  const role = user.app_metadata?.role;
  if (!role) {
    return NextResponse.redirect(new URL('/crm/login?error=no_role', request.url));
  }

  // Kiểm tra quyền truy cập route
  const requiredRoles = ROUTE_PERMISSIONS[pathname] || ROUTE_PERMISSIONS['/crm'];
  if (!requiredRoles.includes(role)) {
    return NextResponse.redirect(new URL('/crm/unauthorized', request.url));
  }

  // Inject role vào header để Client Component đọc
  response.headers.set('x-crm-role', role);
  response.headers.set('x-crm-user', user.email || '');

  return response;
}

export const config = {
  matcher: ['/crm/:path*'],
};
