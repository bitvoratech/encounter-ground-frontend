import { createBrowserClient } from "@supabase/ssr";

/** Supabase client for Client Components. Sessions live in cookies shared with the server. */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

/** `Authorization` header for API calls when someone is signed in, otherwise empty. */
export async function authHeader(): Promise<Record<string, string>> {
  const { data } = await createClient().auth.getSession();
  return data.session ? { Authorization: `Bearer ${data.session.access_token}` } : {};
}
