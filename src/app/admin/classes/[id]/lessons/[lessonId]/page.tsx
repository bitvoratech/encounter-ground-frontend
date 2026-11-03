import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonForm } from "@/components/admin/LessonForm";
import { PageHeader } from "@/components/admin/ui";
import { adminGetOne, getStaff } from "@/lib/admin";
import type { AdminCourse } from "@/types/admin";

export const metadata: Metadata = { title: "Edit lesson" };

export default async function EditLessonPage({ params }: PageProps<"/admin/classes/[id]/lessons/[lessonId]">) {
  const staff = await getStaff();
  if (staff.status !== "staff") return null;
  const { id, lessonId } = await params;
  const course = await adminGetOne<AdminCourse>(staff.token, `/courses/${encodeURIComponent(id)}`);
  const index = course.modules.findIndex((m) => m.lessons.some((l) => l.id === lessonId));
  if (index < 0) notFound();
  const lesson = course.modules[index]!.lessons.find((l) => l.id === lessonId)!;

  return (
    <>
      <PageHeader title={lesson.title} back={{ href: `/admin/classes/${course.id}`, label: course.title }}>
        Module {index + 1}: {course.modules[index]!.title}.{" "}
        {course.status === "published" && (
          <a href={`/school/classes/${course.slug}/${lesson.slug}`} className="link text-slate-ink">
            Open the lesson on the website
          </a>
        )}
      </PageHeader>
      <LessonForm courseId={course.id} lesson={lesson} />
    </>
  );
}
