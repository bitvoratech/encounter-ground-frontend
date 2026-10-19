"use client";

import { IconArrowLeft, IconArrowRight, IconCircleCheck, IconDownload, IconFileText, IconHeadphones, IconLock, IconPlayerPlay } from "@tabler/icons-react";
import Link from "next/link";
import { findCourse, findLesson, sampleCourses } from "@/content/courses";
import { setLessonComplete, useCompleted, useEnrolments } from "@/lib/learning";
import { Checkpoint } from "./Checkpoint";
import { EnrolButton } from "./EnrolButton";
import { formatMinutes, lessonKinds } from "./lessonKinds";
import { Quiz } from "./Quiz";

const SAMPLE = "Sample lesson: the ministry will add the teaching here.";

export function LessonView({ courseSlug, lessonSlug }: { courseSlug: string; lessonSlug: string }) {
  const course = findCourse(courseSlug)!;
  const found = findLesson(course, lessonSlug)!;
  const { lesson, module, moduleIndex, id, prev, next, index, total } = found;
  const enrolments = useEnrolments();
  const completed = useCompleted();
  const enrolled = enrolments?.includes(courseSlug) ?? false;
  const isDone = completed?.includes(id) ?? false;
  const { label, Icon } = lessonKinds[lesson.kind];
  const href = (slug: string) => `/school/classes/${courseSlug}/${slug}`;
  const loading = enrolments === null || completed === null;
  const locked = !loading && !enrolled && !lesson.preview;

  return (
    <article>
      <p className="text-sm text-stone-muted">
        <Link href={`/school/classes/${courseSlug}`} className="font-semibold hover:text-slate-ink">
          {course.name}
        </Link>
        {" · "}Module {moduleIndex + 1}: {module.title}
      </p>
      <h1 className="mt-3 text-[length:var(--text-h2)] text-slate-ink">{lesson.title}</h1>
      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-muted">
        <span className="inline-flex items-center gap-1.5">
          <Icon aria-hidden="true" size={18} stroke={1.75} className="text-amber" />
          {label}
        </span>
        {lesson.minutes && <span>{formatMinutes(lesson.minutes)}</span>}
        <span>
          Lesson {index + 1} of {total}
        </span>
        {lesson.preview && !enrolled && <span className="rounded-full bg-flame/20 px-2 py-0.5 font-semibold text-amber">Free preview</span>}
      </p>

      <div className="mt-8">
        {loading ? (
          <div className="aspect-video rounded-3xl bg-chalk/70" aria-hidden="true" />
        ) : locked ? (
          <div className="flex flex-col items-start gap-5 rounded-3xl border border-rule bg-chalk p-8">
            <span className="grid size-12 place-items-center rounded-full bg-limestone text-slate">
              <IconLock aria-hidden="true" size={24} stroke={1.75} />
            </span>
            <div>
              <h2 className="text-h3 text-slate-ink">Enrol to open this lesson</h2>
              <p className="mt-2 max-w-md text-stone-muted">
                The first lesson of every class is a free preview. Enrol in {course.name} to open the rest.
              </p>
            </div>
            <EnrolButton courseSlug={courseSlug} />
          </div>
        ) : lesson.kind === "video" ? (
          <figure>
            <div className="relative grid aspect-video place-items-center overflow-hidden rounded-3xl bg-slate-deep text-chalk">
              <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_45%,rgb(248_184_8/0.25),transparent)]" />
              <span className="relative grid size-20 place-items-center rounded-full bg-flame text-slate-ink">
                <IconPlayerPlay aria-hidden="true" size={36} stroke={1.75} />
              </span>
            </div>
            <figcaption className="mt-3 text-sm text-stone-muted">
              {SAMPLE} Videos play here, protected so they can’t be downloaded.
            </figcaption>
          </figure>
        ) : lesson.kind === "audio" ? (
          <figure className="rounded-3xl border border-rule bg-chalk p-6">
            <div className="flex items-center gap-4">
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-flame text-slate-ink">
                <IconHeadphones aria-hidden="true" size={26} stroke={1.75} />
              </span>
              <div aria-hidden="true" className="h-2 flex-1 overflow-hidden rounded-full bg-rule">
                <div className="h-full w-0 bg-flame" />
              </div>
              <span className="text-sm tabular-nums text-stone-muted">0:00 / {lesson.minutes}:00</span>
            </div>
            <figcaption className="mt-4 text-sm text-stone-muted">{SAMPLE}</figcaption>
          </figure>
        ) : lesson.kind === "pdf" ? (
          <div className="flex flex-wrap items-center gap-5 rounded-3xl border border-rule bg-chalk p-6">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-flame/20 text-amber">
              <IconFileText aria-hidden="true" size={28} stroke={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-ink">{lesson.title}</p>
              <p className="text-sm text-stone-muted">PDF · {SAMPLE}</p>
            </div>
            <span className="btn btn-quiet pointer-events-none text-stone-muted opacity-70" aria-disabled="true">
              <IconDownload aria-hidden="true" size={18} stroke={1.75} />
              Download
            </span>
          </div>
        ) : lesson.kind === "text" ? (
          <div className="prose-eg measure rounded-3xl border border-rule bg-chalk p-6 text-slate-ink/90 md:p-8">
            <p>{SAMPLE}</p>
            <p>
              Reading lessons hold the written teaching for this part of the class: Scripture, notes and
              short exercises to work through at your own pace.
            </p>
          </div>
        ) : lesson.kind === "checkpoint" ? (
          <Checkpoint lessonId={id} prompt={lesson.prompt ?? "What has God been showing you in this module?"} />
        ) : (
          <Quiz lessonId={id} questions={course.quiz} />
        )}
      </div>

      {!loading && !locked && (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-6">
          {enrolled && (lesson.kind === "video" || lesson.kind === "audio" || lesson.kind === "text" || lesson.kind === "pdf") ? (
            <button
              type="button"
              aria-pressed={isDone}
              onClick={() => setLessonComplete(id, !isDone)}
              className={isDone ? "btn btn-quiet text-slate-ink" : "btn btn-fire"}
            >
              <IconCircleCheck aria-hidden="true" size={20} stroke={1.75} />
              {isDone ? "Completed" : "Mark as complete"}
            </button>
          ) : (
            <span />
          )}
          <nav aria-label="Lessons" className="flex flex-wrap gap-3">
            {prev && (
              <Link href={href(prev.lesson.slug)} className="btn btn-quiet text-slate-ink">
                <IconArrowLeft aria-hidden="true" size={18} stroke={2} />
                Previous
              </Link>
            )}
            {next && (
              <Link href={href(next.lesson.slug)} className="btn btn-quiet text-slate-ink">
                Next
                <IconArrowRight aria-hidden="true" size={18} stroke={2} />
              </Link>
            )}
          </nav>
        </div>
      )}
      {sampleCourses && <p className="mt-8 text-sm text-stone-muted">Sample class outline: the ministry will supply the real lessons.</p>}
    </article>
  );
}
