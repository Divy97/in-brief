import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - this will update the session cookie if needed
  const { data: { session } } = await supabase.auth.getSession();

  // Protected routes that require authentication
  const protectedRoutes = ['/protected', '/profile', '/settings'];
  const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route));

  // Auth routes that should redirect if user is already authenticated
  const authRoutes = ['/sign-in', '/sign-up', '/forgot-password'];
  const isAuthRoute = authRoutes.some(route => req.nextUrl.pathname.startsWith(route));

  // Handle protected routes
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/sign-in', req.url);
    redirectUrl.searchParams.set('redirect_to', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Handle auth routes (redirect to home if already authenticated)
  if (isAuthRoute && session) {
    const redirectTo = req.nextUrl.searchParams.get('redirect_to') || '/';
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  return res;
}

export const config = {
  matcher: [
    // Protected routes
    '/protected/:path*',
    '/profile/:path*',
    '/settings/:path*',
    // Auth routes
    '/sign-in',
    '/sign-up',
    '/forgot-password',
  ],
};
