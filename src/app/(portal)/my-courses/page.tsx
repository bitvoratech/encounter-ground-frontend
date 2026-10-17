import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MyCourses } from "@/components/school/MyCourses";
import { sampleCourses } from "@/content/courses";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "My courses", robots: { index: false } };

export default async function MyCoursesPage() {
  // The proxy already sends signed-out visitors to sign in; this is the backstop.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/my-courses");

  return (
    <div className="wrap pb-24 pt-14 md:pt-20">
      <Link href="/dashboard" className="text-sm font-semibold text-stone-muted hover:text-slate-ink">
        ← My dashboard
      </Link>
      <h1 className="mt-4 text-[length:var(--text-h1)] text-slate-ink">My courses</h1>
      <p className="mt-3 max-w-xl text-stone-muted">Your Beth-El Institute classes, and where you left off.</p>
      {sampleCourses && (
        <p className="mt-6 rounded-2xl bg-flame/15 px-4 py-3 text-sm font-semibold text-amber">
          Test mode: enrolments and progress are saved in this browser only.
        </p>
      )}
      <MyCourses />
    </div>
  );
}
