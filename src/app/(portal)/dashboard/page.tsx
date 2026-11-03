import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { DashboardHome } from "@/components/school/DashboardHome";
import { getAllCourses } from "@/lib/courses";
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

  // If the classes can't be loaded the dashboard still shows, without them.
  await connection();
  const courses = await getAllCourses().catch((err) => {
    console.error("Classes unavailable:", err);
    return [];
  });

  return <DashboardHome account={account} courses={courses} passwordUpdated={password === "updated"} />;
}
