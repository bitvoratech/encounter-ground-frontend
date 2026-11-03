import type { Metadata } from "next";
import { CourseForm } from "@/components/admin/CourseForm";
import { CourseOutline } from "@/components/admin/CourseOutline";
import { QuizEditor } from "@/components/admin/QuizEditor";
import { PageHeader } from "@/components/admin/ui";
import { adminGetOne, getStaff } from "@/lib/admin";
import type { AdminCourse } from "@/types/admin";

export const metadata: Metadata = { title: "Edit class" };

export default async function EditClassPage({ params }: PageProps<"/admin/classes/[id]">) {
  const staff = await getStaff();
  if (staff.status !== "staff") return null;
  const { id } = await params;
  const course = await adminGetOne<AdminCourse>(staff.token, `/courses/${encodeURIComponent(id)}`);
  const hasQuizLesson = course.modules.some((m) => m.lessons.some((l) => l.kind === "quiz"));

  return (
    <>
      <PageHeader title={course.title} back={{ href: "/admin/classes", label: "Classes" }}>
        {course.status === "published" ? (
          <>
            On the website at{" "}
            <a href={`/school/classes/${course.slug}`} className="link text-slate-ink">
              /school/classes/{course.slug}
            </a>
            . {course.enrolments === 1 ? "1 student has" : `${course.enrolments} students have`} enrolled.
          </>
        ) : (
          "Hidden from the website until you publish it."
        )}
      </PageHeader>
      <div className="grid gap-10">
        <CourseForm course={course} />
        <CourseOutline course={course} />
        <QuizEditor courseId={course.id} quiz={course.quiz} hasQuizLesson={hasQuizLesson} />
      </div>
    </>
  );
}
