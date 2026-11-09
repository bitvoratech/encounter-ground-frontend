"use client";

import { IconArrowRight, IconCircleCheck, IconPlus, IconSchool } from "@tabler/icons-react";
import Link from "next/link";
import { card, panel } from "@/components/admin/ui";
import { courseProgress } from "@/lib/courses";
import { useLearning } from "@/lib/learning";
import type { Course } from "@/types/school";
import { ProgressBar } from "./ProgressBar";

/** The classes this member is enrolled in, with progress and the lesson to continue from. */
export function MyCourses({ courses }: { courses: Course[] }) {
  const learning = useLearning();

  if (learning.status === "error") {
    return (
      <p role="alert" className="rounded-xl border border-flame/50 bg-flame/10 px-4 py-3 font-semibold text-slate-ink">
        Your classes can’t be loaded right now. Please refresh in a moment.
      </p>
    );
  }
  if (learning.status !== "ready") {
    return (
      <div aria-hidden="true" className="grid animate-pulse gap-5 md:grid-cols-2">
        <div className="h-64 rounded-2xl bg-rule/40" />
        <div className="h-64 rounded-2xl bg-rule/40" />
      </div>
    );
  }

  const enrolled = learning.enrolments.flatMap((e) => {
    const course = courses.find((c) => c.slug === e.slug);
    return course ? [{ course, p: courseProgress(course, e.completed) }] : [];
  });
  const others = courses.filter((c) => !enrolled.some((e) => e.course.slug === c.slug));

  if (enrolled.length === 0) {
    return (
      <div className={`${card} flex flex-col items-center border-dashed py-12 text-center md:py-14`}>
        <span className="grid size-14 place-items-center rounded-2xl bg-flame/15 text-amber">
          <IconSchool aria-hidden="true" size={28} stroke={1.75} />
        </span>
        <h2 className="mt-5 font-display text-2xl text-slate-ink">You haven’t joined a class yet</h2>
        <p className="mx-auto mt-2 max-w-md text-stone-muted">
          {courses[0]
            ? `New to the school? Start with ${courses[0].name}. The first lesson is a free preview.`
            : "Browse the Beth-El classes to begin."}
        </p>
        <Link href="/school/classes" className="btn btn-fire mt-6">
          Browse the classes
          <IconArrowRight aria-hidden="true" size={18} stroke={2} />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      <ul className="grid gap-5 md:grid-cols-2">
        {enrolled.map(({ course, p }) => (
          <li key={course.slug} className={`${panel} flex flex-col overflow-hidden`}>
            <div className="flex flex-1 flex-col p-5 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  {course.meaning && <p className="text-sm font-semibold text-amber">{course.meaning}</p>}
                  <h2 className="mt-0.5 font-display text-[1.75rem] leading-tight text-slate-ink">
                    <Link href={`/school/classes/${course.slug}`} className="hover:text-amber">
                      {course.name}
                    </Link>
                  </h2>
                </div>
                {p.complete && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-flame/15 px-2.5 py-1 text-xs font-bold text-amber">
                    <IconCircleCheck aria-hidden="true" size={14} stroke={2} />
                    Complete
                  </span>
                )}
              </div>
              <ProgressBar finished={p.finished} total={p.total} className="mt-6" />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-rule/80 bg-limestone/40 px-5 py-4 md:px-6">
              <p className="min-w-0 flex-1 basis-48 text-sm text-stone-muted">
                {p.complete ? (
                  "Class complete. Well done."
                ) : (
                  <>
                    <span className="block text-xs font-bold uppercase tracking-[0.12em]">Up next</span>
                    <span className="block truncate font-semibold text-slate-ink">{p.next.lesson.title}</span>
                  </>
                )}
              </p>
              <Link
                href={`/school/classes/${course.slug}/${p.next.lesson.slug}`}
                className={`btn ${p.complete ? "btn-quiet" : "btn-fire"} shrink-0`}
              >
                {p.complete ? "Review the class" : p.finished === 0 ? "Start" : "Continue"}
                <IconArrowRight aria-hidden="true" size={18} stroke={2} />
                <span className="sr-only">: {course.name}</span>
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {others.length > 0 && (
        <section aria-labelledby="more-heading" className={`${card} flex flex-wrap items-center gap-x-6 gap-y-4`}>
          <span className="hidden size-11 shrink-0 place-items-center rounded-xl bg-slate/10 text-slate sm:grid">
            <IconPlus aria-hidden="true" size={22} stroke={1.75} />
          </span>
          <div className="min-w-0 flex-1 basis-60">
            <h2 id="more-heading" className="font-sans text-xl font-bold text-slate-ink">
              Keep growing
            </h2>
            <p className="mt-0.5 text-stone-muted">
              {others.length === 1 ? `${others[0]!.name} is` : `${others.length} more classes are`} waiting for you at Beth-El Institute.
            </p>
          </div>
          <Link href="/school/classes" className="btn btn-quiet">
            Browse the classes
          </Link>
        </section>
      )}
    </div>
  );
}
