import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountForm } from "@/components/account/AccountForm";
import { api } from "@/lib/api";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/admin";

export const metadata: Metadata = { title: "My account", robots: { index: false } };

export default async function AccountPage() {
  // The proxy already sends signed-out visitors to sign in; this is the backstop.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!user || !session) redirect("/login?next=/account");

  // The saved profile, falling back to what the sign-up form stored if the API is unreachable.
  const profile = await api<Profile>("/me", { headers: { Authorization: `Bearer ${session.access_token}` }, cache: "no-store" }).catch(
    () => null,
  );
  const meta = user.user_metadata ?? {};

  return (
    <div>
      <h1 className="text-[length:var(--text-h2)] text-slate-ink">My account</h1>
      <p className="mt-3 max-w-xl text-stone-muted">Your name and phone number, as the ministry team sees them.</p>
      <AccountForm
        email={profile?.email ?? user.email ?? ""}
        fullName={profile?.full_name ?? (meta.full_name as string | undefined) ?? ""}
        phone={profile?.phone ?? (meta.phone as string | undefined) ?? ""}
        offline={!profile}
      />
    </div>
  );
}
