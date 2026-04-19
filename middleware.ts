import { createServerClient } from '@supabase/ssr';
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

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
            headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Get user session
  const { data: { user }, error } = await supabase.auth.getUser();

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
    '/brands',
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
  const isGuestRoute = guestRoutes.some(route => 
    pathname === route || 
    pathname.startsWith(route + '/') ||
    pathname.startsWith('/(public)')
  );

  // Handle API routes separately (they have their own auth)
  if (pathname.startsWith('/api/')) {
    return response;
  }

  // Handle admin routes
  if (isAdminRoute) {
    if (!user) {
      const redirectUrl = new URL('/signin', request.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      redirectUrl.searchParams.set('reason', 'admin_required');
      return NextResponse.redirect(redirectUrl);
    }

    // Check admin role (if user has profile data)
    try {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      // Check if user has admin role in app_metadata or profile
      const isAdmin = user.app_metadata?.role === 'admin' || 
                     user.user_metadata?.role === 'admin' ||
                     profile?.role === 'admin';

      if (!isAdmin) {
        // Redirect non-admin users to home page
        const redirectUrl = new URL('/', request.url);
        redirectUrl.searchParams.set('reason', 'access_denied_admin');
        return NextResponse.redirect(redirectUrl);
      }
    } catch (error) {
      console.error('[Middleware] Error checking admin role:', error);
      // If we can't verify admin status, redirect to home
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Handle protected routes
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/signin', request.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    redirectUrl.searchParams.set('reason', 'auth_required');
    return NextResponse.redirect(redirectUrl);
  }

  // Handle auth page - redirect authenticated users
  if (pathname === '/(public)/auth' || pathname === '/auth') {
    if (user) {
      const redirectTo = request.nextUrl.searchParams.get('redirectTo');
      const redirectUrl = redirectTo && redirectTo !== '/auth' ? redirectTo : '/';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // Age verification check for certain product categories
  if (pathname.startsWith('/products/') || 
      pathname.startsWith('/product/') ||
      pathname.startsWith('/category/') ||
      pathname.startsWith('/pre-rolls') ||
      pathname.startsWith('/pipes') ||
      pathname.startsWith('/bongs') ||
      pathname.startsWith('/dab-rigs') ||
      pathname.startsWith('/bubblers')) {
    
    const ageVerified = request.cookies.get('age_verified')?.value === 'true';
    
    if (!ageVerified) {
      // Allow the request to continue, but the component will show age verification
      // This is handled client-side in the components
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
