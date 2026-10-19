import { IconChevronDown } from "@tabler/icons-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseOutline } from "@/components/school/CourseOutline";
import { LessonView } from "@/components/school/LessonView";
import { courseLessons, courses, findCourse, findLesson } from "@/content/courses";

export function generateStaticParams() {
  return courses.flatMap((c) => courseLessons(c).map(({ lesson }) => ({ slug: c.slug, lesson: lesson.slug })));
}

export async function generateMetadata({ params }: PageProps<"/school/classes/[slug]/[lesson]">): Promise<Metadata> {
  const { slug, lesson } = await params;
  const course = findCourse(slug);
  const found = course && findLesson(course, lesson);
  return found ? { title: `${found.lesson.title} · ${course.name}`, robots: { index: false } } : {};
}

export default async function LessonPage({ params }: PageProps<"/school/classes/[slug]/[lesson]">) {
  const { slug, lesson } = await params;
  const course = findCourse(slug);
  if (!course || !findLesson(course, lesson)) notFound();

  return (
    <div className="wrap grid gap-10 pb-20 pt-8 md:pt-12 lg:grid-cols-[1fr_22rem] lg:items-start">
      {/* On phones the outline folds away above the lesson */}
      <details className="group rounded-2xl border border-rule bg-chalk lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 font-semibold text-slate-ink [&::-webkit-details-marker]:hidden">
          {course.name}: class outline
          <IconChevronDown aria-hidden="true" size={20} stroke={2} className="transition-transform group-open:rotate-180" />
        </summary>
        <div className="border-t border-rule p-3">
          <CourseOutline courseSlug={course.slug} currentLesson={lesson} compact />
        </div>
      </details>

      <LessonView courseSlug={course.slug} lessonSlug={lesson} />

      <aside aria-label="Class outline" className="hidden lg:sticky lg:top-28 lg:block lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
        <p className="mb-3 font-semibold text-slate-ink">{course.name}: class outline</p>
        <CourseOutline courseSlug={course.slug} currentLesson={lesson} compact />
      </aside>
    </div>
  );
}
