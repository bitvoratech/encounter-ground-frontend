import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MemberShell } from "@/components/member/MemberShell";
import { getStaff } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: { default: "My dashboard", template: "%s | Encounter Ground" },
  robots: { index: false },
};

/**
 * The member area: dashboard, My courses, My books and My account, in a frame built like the
 * admin dashboard. The ministry team has its own.
 */
export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  if ((await getStaff()).status === "staff") redirect("/admin");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");
  const meta = user.user_metadata ?? {};
  const account = {
    name: (meta.full_name as string | undefined) || user.email || "Member",
    email: user.email ?? "",
    avatarUrl: (meta.avatar_url as string | undefined) ?? null,
  };

  return <MemberShell account={account}>{children}</MemberShell>;
}
