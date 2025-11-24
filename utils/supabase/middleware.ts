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

  // 3. Get User
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 4. Define which routes are authentication routes
  const isAuthRoute =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/signup";

  // 5. Redirect logic

  // Redirect logged in users to home page from /signup and /login
  if (isAuthRoute && user) {
    const redirectBase = process.env.NEXT_PUBLIC_URL || request.nextUrl.origin;
    return NextResponse.redirect(new URL("/", redirectBase));
  }

  // Check params
  const { searchParams, pathname } = new URL(request.url);

  // FIX: Only run this logic if we are on the homepage ("/") AND not already selecting a diary.
  // This prevents the middleware from running on the /api/ call itself.
  if (user && pathname === "/" && !searchParams.get("diaryId")) {
    // Use request.nextUrl.origin as a fallback if NEXT_PUBLIC_URL is not set
    const baseUrl = process.env.NEXT_PUBLIC_URL || request.nextUrl.origin;

    try {
      const fetchResponse = await fetch(
        `${baseUrl}/api/fetch-newest-diary?userId=${user.id}`,
      );

      if (!fetchResponse.ok) {
        throw new Error(
          `Failed to fetch newest diary: ${fetchResponse.status}`,
        );
      }

      const text = await fetchResponse.text();
      if (!text) {
        throw new Error("Empty response from fetch-newest-diary");
      }

      const { newestDiaryId } = JSON.parse(text);

      if (newestDiaryId) {
        const url = request.nextUrl.clone();
        url.searchParams.set("diaryId", newestDiaryId);
        return NextResponse.redirect(url);
      } else {
        const createResponse = await fetch(
          `${baseUrl}/api/create-new-diary?userId=${user.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!createResponse.ok) {
          throw new Error(
            `Failed to create new diary: ${createResponse.status}`,
          );
        }

        const createText = await createResponse.text();
        if (!createText) {
          throw new Error("Empty response from create-new-diary");
        }

        const { diaryId } = JSON.parse(createText);

        const url = request.nextUrl.clone();
        url.searchParams.set("diaryId", diaryId);
        return NextResponse.redirect(url);
      }
    } catch (error) {
      // Log error but don't block the request - let the user through
      console.error("Error in middleware:", error);
      // Return the response without redirecting
      return supabaseResponse;
    }
  }

  return supabaseResponse;
}
