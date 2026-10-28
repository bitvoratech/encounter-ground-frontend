import { redirect } from "next/navigation";
import { cache } from "react";
import type { Overview, Profile } from "@/types/admin";
import { api } from "./api";
import { createClient } from "./supabase/server";

// The admin dashboard, server side. The proxy has already refreshed the session cookie; the
// API checks the token and the role on every call, so these checks only decide what to show.

export type StaffCheck =
  | { status: "staff"; profile: Profile; token: string }
  | { status: "forbidden" }
  | { status: "unavailable" };

/** Who is looking at the admin pages. Signed-out visitors are sent to sign in. */
export const getStaff = cache(async (): Promise<StaffCheck> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect("/login?next=/admin");

  try {
    const profile = await api<Profile>("/me", { headers: { Authorization: `Bearer ${session.access_token}` } });
    return profile.role === "member" ? { status: "forbidden" } : { status: "staff", profile, token: session.access_token };
  } catch (err) {
    console.error("Admin: profile unavailable:", err);
    return { status: "unavailable" };
  }
});

/** GET an /admin endpoint as the signed-in staff member. Errors reach the admin error page. */
export function adminGet<T>(token: string, path: string) {
  return api<T>(`/admin${path}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
}

/** The overview, shared by the sidebar's counts and the overview page within one request. */
export const getOverview = cache((token: string) => adminGet<Overview>(token, "/overview"));
