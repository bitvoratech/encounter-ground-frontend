import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Pages that need a signed-in member, and pages a signed-in member doesn't need.
// Add /my-books and /my-courses here (and to the matcher) when those pages ship.
const MEMBERS_ONLY = ["/dashboard", "/reset-password"];
const GUESTS_ONLY = ["/login", "/register", "/forgot-password"];

const matches = (path: string, prefixes: string[]) =>
  prefixes.some((p) => path === p || path.startsWith(`${p}/`));

/** Refreshes the Supabase session cookie and guards the account pages. */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          Object.entries(headers ?? {}).forEach(([key, value]) => response.headers.set(key, value));
        },
      },
    },
  );

  // getUser() validates the token with Supabase, so it can't be spoofed by a forged cookie.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  if (!user && matches(path, MEMBERS_ONLY)) {
    const url = request.nextUrl.clone();
    url.pathname = path === "/reset-password" ? "/forgot-password" : "/login";
    url.search = path === "/reset-password" ? "" : `?next=${encodeURIComponent(path)}`;
    return NextResponse.redirect(url);
  }
  if (user && matches(path, GUESTS_ONLY)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

// Only the account pages; public pages stay static and never wait on Supabase.
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/reset-password",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
