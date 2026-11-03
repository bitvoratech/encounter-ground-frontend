import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonForm } from "@/components/admin/LessonForm";
import { PageHeader } from "@/components/admin/ui";
import { adminGetOne, getStaff } from "@/lib/admin";
import type { AdminCourse } from "@/types/admin";

export const metadata: Metadata = { title: "Add a lesson" };

export default async function NewLessonPage({ params, searchParams }: PageProps<"/admin/classes/[id]/lessons/new">) {
  const staff = await getStaff();
  if (staff.status !== "staff") return null;
  const [{ id }, { module: moduleId }] = await Promise.all([params, searchParams]);
  const course = await adminGetOne<AdminCourse>(staff.token, `/courses/${encodeURIComponent(id)}`);
  const index = course.modules.findIndex((m) => m.id === moduleId);
  if (index < 0) notFound();

  return (
    <>
      <Link href={`/admin/classes/${course.id}`} className="text-sm font-semibold text-stone-muted hover:text-slate-ink">
        ← {course.title}
      </Link>
      <div className="mt-3">
        <PageHeader title="Add a lesson">
          To module {index + 1}: {course.modules[index]!.title}. It goes at the end of the module.
        </PageHeader>
      </div>
      <LessonForm courseId={course.id} moduleId={course.modules[index]!.id} />
    </>
  );
}
