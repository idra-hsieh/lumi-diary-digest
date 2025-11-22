import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // 1. Initialize the response
  let supabaseResponse = NextResponse.next({
    request,
  });

  // 2. Create Supabase client
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value }) =>
            supabaseResponse.cookies.set(name, value),
          );
        },
      },
    },
  );

  // 3. Get User FIRST so the variable is available for the check below
  // We rename 'data.user' to just 'user' for convenience
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 4. Define which routes are authentication routes
  const isAuthRoute =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/signup";

  // 5. Redirect logic
  if (isAuthRoute && user) {
    // The fallback 'request.url' prevents a crash if the .env file is missing or empty.
    const redirectBase = process.env.NEXT_PUBLIC_BASE_URL || request.url;

    return NextResponse.redirect(new URL("/", redirectBase));
  }

  return supabaseResponse;
}
