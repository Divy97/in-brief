import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login");
    const isProtectedRoute =
      req.nextUrl.pathname.startsWith("/dashboard") ||
      req.nextUrl.pathname.startsWith("/profile");

    // If trying to access protected route without auth
    if (isProtectedRoute && !isAuth) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("from", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If trying to access login page while authenticated
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return null;
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const isAuthPage = req.nextUrl.pathname.startsWith("/login");
        const isProtectedRoute =
          req.nextUrl.pathname.startsWith("/dashboard") ||
          req.nextUrl.pathname.startsWith("/profile");

        // Allow public access to non-protected routes
        if (!isProtectedRoute && !isAuthPage) {
          return true;
        }

        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Only protect dashboard and profile routes
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/login"],
};
