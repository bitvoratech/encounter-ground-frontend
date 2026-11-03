import { IconChevronDown } from "@tabler/icons-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ClassesUnavailable } from "@/components/school/ClassesUnavailable";
import { CourseOutline } from "@/components/school/CourseOutline";
import { LessonView } from "@/components/school/LessonView";
import { findLesson, loadCourse } from "@/lib/courses";

export async function generateMetadata({ params }: PageProps<"/school/classes/[slug]/[lesson]">): Promise<Metadata> {
  const { slug, lesson } = await params;
  const course = await loadCourse(slug);
  const found = typeof course === "object" && findLesson(course, lesson);
  return found ? { title: `${found.lesson.title} · ${course.name}`, robots: { index: false } } : {};
}

export default async function LessonPage({ params }: PageProps<"/school/classes/[slug]/[lesson]">) {
  // Fetch at request time, so builds never depend on the API being reachable.
  await connection();
  const { slug, lesson } = await params;
  const course = await loadCourse(slug);
  if (course === "unavailable") return <ClassesUnavailable />;
  if (course === "missing" || !findLesson(course, lesson)) notFound();

  return (
    <div className="wrap grid gap-10 pb-20 pt-8 md:pt-12 lg:grid-cols-[1fr_22rem] lg:items-start">
      {/* On phones the outline folds away above the lesson */}
      <details className="group rounded-2xl border border-rule bg-chalk lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 font-semibold text-slate-ink [&::-webkit-details-marker]:hidden">
          {course.name}: class outline
          <IconChevronDown aria-hidden="true" size={20} stroke={2} className="transition-transform group-open:rotate-180" />
        </summary>
        <div className="border-t border-rule p-3">
          <CourseOutline course={course} currentLesson={lesson} compact />
        </div>
      </details>

      <LessonView course={course} lessonSlug={lesson} />

      <aside aria-label="Class outline" className="hidden lg:sticky lg:top-28 lg:block lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
        <p className="mb-3 font-semibold text-slate-ink">{course.name}: class outline</p>
        <CourseOutline course={course} currentLesson={lesson} compact />
      </aside>
    </div>
  );
}
