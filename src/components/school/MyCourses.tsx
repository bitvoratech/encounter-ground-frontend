"use client";

import { IconArrowRight, IconSchool } from "@tabler/icons-react";
import Link from "next/link";
import { courseProgress } from "@/lib/courses";
import { useLearning } from "@/lib/learning";
import type { Course } from "@/types/school";
import { ProgressBar } from "./ProgressBar";

/** The classes this member is enrolled in, with progress and the lesson to continue from. */
export function MyCourses({ courses }: { courses: Course[] }) {
  const learning = useLearning();

  if (learning.status === "error") {
    return <p className="mt-10 font-semibold text-amber">Your classes can’t be loaded right now. Please refresh in a moment.</p>;
  }
  if (learning.status !== "ready") {
    return <div className="mt-10 h-48 rounded-3xl border border-rule bg-chalk/60" aria-hidden="true" />;
  }

  const enrolled = learning.enrolments.flatMap((e) => {
    const course = courses.find((c) => c.slug === e.slug);
    return course ? [{ course, completed: e.completed }] : [];
  });

  if (enrolled.length === 0) {
    return (
      <div className="mt-10 flex flex-col items-start gap-6 rounded-3xl border border-rule bg-chalk p-8 md:p-12">
        <span className="grid size-14 place-items-center rounded-full bg-flame/20 text-amber">
          <IconSchool aria-hidden="true" size={28} stroke={1.75} />
        </span>
        <div>
          <h2 className="text-h3 text-slate-ink">You haven’t joined a class yet</h2>
          <p className="mt-2 max-w-md text-stone-muted">New to the school? Start with Halak, the foundations of walking with God.</p>
        </div>
        <Link href="/school/classes" className="btn btn-fire">
          Browse the classes
        </Link>
      </div>
    );
  }

  return (
    <ul className="mt-10 grid gap-5 md:grid-cols-2">
      {enrolled.map(({ course, completed }) => {
        const p = courseProgress(course, completed);
        return (
          <li key={course.slug} className="flex flex-col rounded-3xl border border-rule bg-chalk p-6 md:p-8">
            <p className="text-sm font-semibold text-amber">{course.meaning}</p>
            <h2 className="mt-1 text-[length:var(--text-h2)] text-slate-ink">
              <Link href={`/school/classes/${course.slug}`} className="hover:underline hover:decoration-flame hover:underline-offset-4">
                {course.name}
              </Link>
            </h2>
            <ProgressBar finished={p.finished} total={p.total} className="mt-6" />
            <p className="mt-4 flex-1 text-sm text-stone-muted">
              {p.complete ? "Class complete. Well done." : `Next: ${p.next.lesson.title}`}
            </p>
            <Link href={`/school/classes/${course.slug}/${p.next.lesson.slug}`} className="btn btn-fire mt-6 self-start">
              {p.complete ? "Review the class" : p.finished === 0 ? "Start the first lesson" : "Continue"}
              <IconArrowRight aria-hidden="true" size={18} stroke={2} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
