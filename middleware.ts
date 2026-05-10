import { NextResponse, type NextRequest } from 'next/server';
import { isRestrictedPath } from './lib/compliance-filters';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const { pathname } = request.nextUrl;

  // STRICT COMPLIANCE: Block all Kratom-related paths
  if (isRestrictedPath(pathname)) {
    // Compliance block logged server-side only
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('reason', 'kratom_blocked');
    return NextResponse.redirect(redirectUrl);
  }

  // The legacy /brands hub is retired. /brands → homepage "Shop By Brand"
  // anchor; /brands/<slug> → brand-filtered search results so we still honor
  // any inbound bookmarks or external links pointing at the old per-brand pages.
  if (pathname === '/brands' || pathname === '/brands/') {
    return NextResponse.redirect(new URL('/#brands', request.url));
  }
  if (pathname.startsWith('/brands/')) {
    const slug = pathname.replace(/^\/brands\//, '').replace(/\/$/, '');
    const brandName = slug
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
    const redirectUrl = new URL('/search', request.url);
    redirectUrl.searchParams.set('brand', brandName);
    return NextResponse.redirect(redirectUrl);
  }

  // Basic check for auth cookie presence
  // Note: We don't use Supabase client here because Edge runtime issues with process.version
  const hasAuthCookie = request.cookies.getAll().some(
    cookie => cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token')
  );

  // Define protected routes
  const protectedRoutes = [
    '/account',
    '/orders',
    '/profile',
    '/wishlist',
    '/payment-methods',
    '/returns'
  ];

  // Define admin routes
  const adminRoutes = [
    '/admin'
  ];

  // Define guest-allowed routes (don't require auth)
  const guestRoutes = [
    '/',
    '/auth',
    '/products',
    '/product',
    '/categories',
    '/search',
    '/about',
    '/contact',
    '/help',
    '/terms',
    '/privacy',
    '/shipping',
    '/returns',
    '/careers',
    '/press',
    '/blog',
    '/wholesale',
    '/affiliate',
    '/age-verification',
    '/compliance',
    '/lab-results',
    '/gift-cards',
    '/rewards',
    '/sitemap-page',
    '/pipes',
    '/bongs',
    '/bubblers',
    '/dab-rigs',
    '/dabsntools',
    '/accessories',
    '/pre-rolls',
    '/new'
  ];

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // Handle API routes separately (they have their own auth)
  if (pathname.startsWith('/api/')) {
    return response;
  }

  // Handle admin routes
  if (isAdminRoute && !hasAuthCookie) {
    const redirectUrl = new URL('/signin', request.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    redirectUrl.searchParams.set('reason', 'admin_required');
    return NextResponse.redirect(redirectUrl);
  }

  // Handle protected routes
  if (isProtectedRoute && !hasAuthCookie) {
    const redirectUrl = new URL('/signin', request.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    redirectUrl.searchParams.set('reason', 'auth_required');
    return NextResponse.redirect(redirectUrl);
  }

  // Handle auth page - redirect authenticated users
  if (pathname === '/(public)/auth' || pathname === '/auth') {
    if (hasAuthCookie) {
      const redirectTo = request.nextUrl.searchParams.get('redirectTo');
      const redirectUrl = redirectTo && redirectTo !== '/auth' ? redirectTo : '/';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
