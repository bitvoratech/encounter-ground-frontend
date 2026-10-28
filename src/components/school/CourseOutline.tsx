"use client";

import { IconChevronDown, IconCircleCheckFilled, IconLock } from "@tabler/icons-react";
import Link from "next/link";
import { enrolmentFor, useLearning } from "@/lib/learning";
import type { Course } from "@/types/school";
import { formatMinutes, lessonKinds } from "./lessonKinds";

/**
 * The course outline, module by module (after GOMYCODE's curriculum accordion). Lessons open
 * when the student is enrolled or the lesson is a free preview.
 */
export function CourseOutline({
  course,
  currentLesson,
  compact = false,
}: {
  course: Course;
  /** On a lesson page: highlight it and open its module. */
  currentLesson?: string;
  compact?: boolean;
}) {
  const courseSlug = course.slug;
  const enrolment = enrolmentFor(useLearning(), courseSlug);
  const enrolled = !!enrolment;
  const done = enrolment?.completed ?? [];

  return (
    <ol className={compact ? "grid gap-2" : "grid gap-3"}>
      {course.modules.map((module, m) => {
        const finished = module.lessons.filter((l) => done.includes(l.slug)).length;
        const minutes = module.lessons.reduce((sum, l) => sum + l.minutes, 0);
        const open = currentLesson ? module.lessons.some((l) => l.slug === currentLesson) : m === 0;

        return (
          <li key={module.title}>
            <details open={open} className="group rounded-2xl border border-rule bg-chalk">
              <summary className="flex cursor-pointer list-none items-start gap-3 p-4 md:p-5 [&::-webkit-details-marker]:hidden">
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-amber">Module {m + 1}</span>
                  <span className={`mt-1 block font-display leading-snug text-slate-ink ${compact ? "text-lg" : "text-xl md:text-2xl"}`}>
                    {module.title}
                  </span>
                  {!compact && <span className="mt-1 block text-stone-muted">{module.summary}</span>}
                  <span className="mt-2 block text-sm text-stone-muted">
                    {module.lessons.length} lessons · {formatMinutes(minutes)}
                    {enrolled && ` · ${finished} done`}
                  </span>
                </span>
                <IconChevronDown
                  aria-hidden="true"
                  size={20}
                  stroke={2}
                  className="mt-1 shrink-0 text-slate transition-transform group-open:rotate-180"
                />
              </summary>
              <ul className="border-t border-rule">
                {module.lessons.map((lesson) => {
                  const isDone = done.includes(lesson.slug);
                  const open = enrolled || lesson.preview;
                  const current = lesson.slug === currentLesson;
                  const { Icon, label } = lessonKinds[lesson.kind];
                  const row = (
                    <>
                      {isDone ? (
                        <IconCircleCheckFilled aria-hidden="true" size={20} className="shrink-0 text-amber-logo" />
                      ) : (
                        <Icon aria-hidden="true" size={20} stroke={1.75} className="shrink-0 text-slate" />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className={`block leading-snug ${current ? "font-semibold text-slate-ink" : "text-slate-ink"}`}>{lesson.title}</span>
                        <span className="block text-xs text-stone-muted">
                          {label}
                          {lesson.minutes ? ` · ${formatMinutes(lesson.minutes)}` : ""}
                          {isDone ? " · Done" : ""}
                        </span>
                      </span>
                      {lesson.preview && !enrolled && (
                        <span className="shrink-0 rounded-full bg-flame/20 px-2 py-0.5 text-xs font-semibold text-amber">Preview</span>
                      )}
                      {!open && <IconLock aria-label="Locked: enrol to open" size={18} stroke={1.75} className="shrink-0 text-stone-muted" />}
                    </>
                  );
                  return (
                    <li key={lesson.slug} className="border-b border-rule last:border-b-0">
                      {open ? (
                        <Link
                          href={`/school/classes/${courseSlug}/${lesson.slug}`}
                          aria-current={current ? "page" : undefined}
                          className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-limestone aria-[current=page]:bg-flame/10 md:px-5"
                        >
                          {row}
                        </Link>
                      ) : (
                        <div className="flex items-center gap-3 px-4 py-3 opacity-75 md:px-5">{row}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </details>
          </li>
        );
      })}
    </ol>
  );
}
