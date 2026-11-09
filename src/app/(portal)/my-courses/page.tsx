import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/admin/ui";
import { MyCourses } from "@/components/school/MyCourses";
import { connection } from "next/server";
import { getAllCourses } from "@/lib/courses";
import type { Course } from "@/types/school";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "My courses", robots: { index: false } };

export default async function MyCoursesPage() {
  // The proxy already sends signed-out visitors to sign in; this is the backstop.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/my-courses");

  await connection();
  let courses: Course[] | null = null;
  try {
    courses = await getAllCourses();
  } catch (err) {
    console.error("Classes unavailable:", err);
  }

  return (
    <div>
      <PageHeader title="My courses">Your Beth-El Institute classes, and where you left off.</PageHeader>
      {courses ? (
        <MyCourses courses={courses} />
      ) : (
        <p role="alert" className="rounded-xl border border-flame/50 bg-flame/10 px-4 py-3 font-semibold text-slate-ink">
          Your classes can’t be loaded right now. Please try again in a little while.
        </p>
      )}
    </div>
  );
}
