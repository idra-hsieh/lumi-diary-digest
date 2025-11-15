import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });
  console.log("middleware ran");

  //   const supabase = createServerClient(
  //     process.env.SUPABASE_URL!,
  //     process.env.SUPABASE_ANON_KEY!,
  //     {
  //       cookies: {
  //         getAll() {
  //           return request.cookies.getAll();
  //         },
  //         setAll(cookiesToSet) {
  //           cookiesToSet.forEach(({ name, value }) =>
  //             request.cookies.set(name, value),
  //           );
  //           supabaseResponse = NextResponse.next({
  //             request,
  //           });
  //           cookiesToSet.forEach(({ name, value }) =>
  //             supabaseResponse.cookies.set(name, value),
  //           );
  //         },
  //       },
  //     },
  //   );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: Don't remove getClaims()
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  return supabaseResponse;
}
