import type { Metadata } from "next";
import { redirect } from "next/navigation";
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
      <h1 className="text-[length:var(--text-h2)] text-slate-ink">My courses</h1>
      <p className="mt-3 max-w-xl text-stone-muted">Your Beth-El Institute classes, and where you left off.</p>
      {courses ? (
        <MyCourses courses={courses} />
      ) : (
        <p role="status" className="mt-10 font-semibold text-amber">
          Your classes can’t be loaded right now. Please try again in a little while.
        </p>
      )}
    </div>
  );
}
