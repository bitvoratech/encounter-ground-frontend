import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardHome } from "@/components/school/DashboardHome";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "My dashboard", robots: { index: false } };

export default async function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const { password } = await searchParams;
  const meta = user.user_metadata ?? {};
  const account = {
    name: (meta.full_name as string | undefined) || user.email || "Member",
    email: user.email ?? "",
    avatarUrl: (meta.avatar_url as string | undefined) ?? null,
  };

  return <DashboardHome account={account} passwordUpdated={password === "updated"} />;
}
