import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Get the intended destination from the URL if it exists
    const redirectTo = request.nextUrl.searchParams.get("redirect_to");

    // Protected routes handling
    if (request.nextUrl.pathname.startsWith("/protected")) {
      // Only allow registered (non-anonymous) users to access protected routes
      if (!user || !user.email) {
        const signInUrl = new URL("/sign-in", request.url);
        if (request.nextUrl.pathname !== "/protected") {
          signInUrl.searchParams.set("redirect_to", request.nextUrl.pathname);
        }
        return NextResponse.redirect(signInUrl);
      }
    }

    // Auth routes handling (sign-in, sign-up)
    if (["/sign-in", "/sign-up"].includes(request.nextUrl.pathname)) {
      // If user is already registered (not anonymous), redirect appropriately
      if (user?.email) {
        const destination = redirectTo || "/quiz";
        return NextResponse.redirect(new URL(destination, request.url));
      }
    }

    return response;
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
