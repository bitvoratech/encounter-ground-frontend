"use client";

import {
  IconArrowRight,
  IconArrowUpRight,
  IconBook,
  IconBooks,
  IconCircleCheck,
  IconClipboardCheck,
  IconFlag,
  IconListCheck,
  IconMessageCircle,
  IconSchool,
  IconSparkles,
} from "@tabler/icons-react";
import Link from "next/link";
import { card } from "@/components/admin/ui";
import type { Account } from "@/components/layout/useFullScreenMenu";
import { BookCover } from "@/components/store/BookCover";
import { courseLessons, courseProgress } from "@/lib/courses";
import { useLearning } from "@/lib/learning";
import { useLibrary } from "@/lib/library";
import type { Course } from "@/types/school";
import { ProgressBar } from "./ProgressBar";

const sectionTitle = "font-sans text-xl font-bold text-slate-ink";
const sectionLink = "shrink-0 rounded-lg px-2 py-1 text-sm font-semibold text-amber hover:bg-flame/10";

function greeting() {
  const hour = Number(new Date().toLocaleString("en-GB", { hour: "numeric", hour12: false, timeZone: "Africa/Lagos" }));
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
}

/** The same grey placeholder shapes the page settles into, so nothing jumps when it loads. */
function Skeleton() {
  return (
    <div aria-hidden="true" className="grid animate-pulse gap-8">
      <div className="h-16 w-72 max-w-full rounded-xl bg-rule/50" />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-rule/40" />
        ))}
      </div>
      <div className="h-64 rounded-2xl bg-rule/40" />
    </div>
  );
}

/**
 * The member's dashboard, laid out like the admin overview: a greeting, the numbers at a glance,
 * then where to carry on, what is waiting, and their classes and books.
 */
export function DashboardHome({ account, courses, passwordUpdated }: { account: Account; courses: Course[]; passwordUpdated: boolean }) {
  const learning = useLearning();
  const library = useLibrary();
  const firstName = account.name.includes("@") ? "" : account.name.split(" ")[0];

  if (learning.status === "loading" || learning.status === "signed-out" || library.status === "loading") return <Skeleton />;

  const enrolments = learning.status === "ready" ? learning.enrolments : [];
  const mine = enrolments.flatMap((e) => {
    const course = courses.find((c) => c.slug === e.slug);
    return course ? [{ course, completed: e.completed, replies: e.replies, p: courseProgress(course, e.completed) }] : [];
  });
  const books = library.status === "ready" ? library.books : [];
  const allLessons = mine.flatMap(({ course, completed }) =>
    courseLessons(course).map((l) => ({ ...l, course, done: completed.includes(l.lesson.slug) })),
  );
  const lessonsDone = allLessons.filter((l) => l.done).length;
  const replies = mine
    .flatMap(({ course, replies }) =>
      replies.flatMap((r) => {
        const lesson = courseLessons(course).find((l) => l.lesson.slug === r.lesson)?.lesson;
        return lesson ? [{ ...r, course, lesson }] : [];
      }),
    )
    .sort((a, b) => b.reviewed_at.localeCompare(a.reviewed_at));
  const checkpointsDone = allLessons.filter((l) => l.lesson.kind === "checkpoint" && l.done).length;
  const waiting = allLessons.filter((l) => (l.lesson.kind === "checkpoint" || l.lesson.kind === "quiz") && !l.done);
  // Carry on with the first class that isn't finished.
  const current = mine.find((m) => !m.p.complete);
  const firstClass = courses[0];
  // The book read most recently, to pick up again.
  const reading = [...books]
    .filter((b) => b.pages_ready && b.last_read_at)
    .sort((a, b) => b.last_read_at!.localeCompare(a.last_read_at!))[0];

  const stats = [
    { label: "Classes joined", value: mine.length, href: "/my-courses", Icon: IconSchool },
    { label: "Lessons done", value: lessonsDone, href: "/my-courses", Icon: IconCircleCheck },
    { label: "Checkpoints done", value: checkpointsDone, href: "/my-courses", Icon: IconFlag },
    { label: "E-books", value: books.length, href: "/my-books", Icon: IconBooks },
  ];

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-stone-muted">
          {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "Africa/Lagos" })}
        </p>
        <h1 className="mt-1 font-display text-3xl leading-tight text-slate-ink md:text-[2.125rem]">
          {greeting()}
          {firstName && `, ${firstName}`}
        </h1>
      </header>

      {passwordUpdated && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-xl border border-flame/50 bg-flame/10 px-4 py-3 font-semibold text-slate-ink"
        >
          <IconCircleCheck aria-hidden="true" size={20} stroke={2} className="text-amber" />
          Your password has been updated.
        </p>
      )}
      {learning.status === "error" && (
        <p role="alert" className="rounded-xl border border-flame/50 bg-flame/10 px-4 py-3 font-semibold text-slate-ink">
          Your classes can’t be loaded right now. Please refresh in a moment.
        </p>
      )}

      {/* At a glance */}
      <ul className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map(({ label, value, href, Icon }) => (
          <li key={label}>
            <Link
              href={href}
              className="group block h-full rounded-2xl border border-rule/80 bg-white p-4 shadow-[0_1px_2px_rgb(29_38_48/0.04)] transition-[border-color,box-shadow] hover:border-stone hover:shadow-md md:p-5"
            >
              <span className="flex items-start justify-between gap-2">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-flame/15 text-amber">
                  <Icon aria-hidden="true" size={20} stroke={1.75} />
                </span>
                <IconArrowUpRight
                  aria-hidden="true"
                  size={18}
                  stroke={2}
                  className="text-stone transition-colors group-hover:text-slate-ink"
                />
              </span>
              <span className="mt-5 block text-3xl font-extrabold leading-none text-slate-ink tabular-nums">{value}</span>
              <span className="mt-1.5 block text-sm text-stone-muted">{label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* Continue learning: the most useful thing on the page, so it comes first */}
        <section
          aria-labelledby="continue-heading"
          className="relative flex flex-col overflow-hidden rounded-2xl bg-slate-deep p-6 text-chalk shadow-[0_1px_2px_rgb(29_38_48/0.04)] md:p-8"
        >
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(70%_80%_at_100%_100%,rgb(248_184_8/0.22),transparent)]" />
          <div className="relative flex flex-1 flex-col">
            {current ? (
              <>
                <h2 id="continue-heading" className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-flame">
                  Continue where you left off
                </h2>
                <p className="mt-3 font-display text-[clamp(1.625rem,1.3rem+1.3vw,2.25rem)] leading-tight">{current.p.next.lesson.title}</p>
                <p className="mt-1 text-chalk/75">
                  {current.course.name} · Module {current.p.next.moduleIndex + 1}: {current.p.next.module.title}
                </p>
                <div className="mt-6 max-w-md">
                  <p className="flex justify-between text-sm text-chalk/80">
                    <span>
                      {current.p.finished} of {current.p.total} lessons
                    </span>
                    <span className="tabular-nums">{current.p.percent}%</span>
                  </p>
                  <div aria-hidden="true" className="mt-2 h-2 overflow-hidden rounded-full bg-chalk/15">
                    <div className="h-full rounded-full bg-flame" style={{ width: `${current.p.percent}%` }} />
                  </div>
                </div>
                <div className="min-h-7 flex-1" />
                <Link
                  href={`/school/classes/${current.course.slug}/${current.p.next.lesson.slug}`}
                  className="btn btn-fire self-start"
                >
                  {current.p.finished === 0 ? "Start learning" : "Continue"}
                  <IconArrowRight aria-hidden="true" size={18} stroke={2} />
                </Link>
              </>
            ) : (
              <>
                <h2 id="continue-heading" className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-flame">
                  {mine.length ? "Every class complete" : "Start your first class"}
                </h2>
                <p className="mt-3 font-display text-[clamp(1.625rem,1.3rem+1.3vw,2.25rem)] leading-tight">
                  {mine.length || !firstClass ? "Well done. Ready for the next one?" : `Begin with ${firstClass.name}`}
                </p>
                <p className="mt-2 max-w-lg text-chalk/75">
                  {mine.length || !firstClass
                    ? "Browse the Beth-El classes to keep growing."
                    : `${firstClass.meaning ? `${firstClass.meaning}. ` : ""}The first lesson is a free preview.`}
                </p>
                <div className="min-h-7 flex-1" />
                <Link
                  href={mine.length || !firstClass ? "/school/classes" : `/school/classes/${firstClass.slug}`}
                  className="btn btn-fire self-start"
                >
                  {mine.length || !firstClass ? "Browse the classes" : `Start with ${firstClass.name}`}
                  <IconArrowRight aria-hidden="true" size={18} stroke={2} />
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Quizzes and checkpoints waiting */}
        <section aria-labelledby="waiting-heading" className={card}>
          <div className="flex items-center justify-between gap-4">
            <h2 id="waiting-heading" className={sectionTitle}>
              Waiting for you
            </h2>
            {waiting.length > 0 && (
              <span className="rounded-full bg-flame px-2.5 py-0.5 text-xs font-bold text-slate-ink tabular-nums">{waiting.length}</span>
            )}
          </div>
          {mine.length === 0 ? (
            <p className="mt-4 text-stone-muted">Join a class and its checkpoints and final check appear here.</p>
          ) : waiting.length === 0 ? (
            <p className="mt-4 flex items-center gap-2 text-stone-muted">
              <IconCircleCheck aria-hidden="true" size={20} stroke={1.75} className="text-amber" />
              Nothing waiting. Every checkpoint and final check is done.
            </p>
          ) : (
            <>
              <ul className="mt-2 divide-y divide-rule/80">
                {waiting.slice(0, 4).map((w) => {
                  const Icon = w.lesson.kind === "quiz" ? IconListCheck : IconClipboardCheck;
                  return (
                    <li key={`${w.course.slug}/${w.lesson.slug}`}>
                      <Link href={`/school/classes/${w.course.slug}/${w.lesson.slug}`} className="group flex items-center gap-3 py-3.5">
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate/10 text-slate">
                          <Icon aria-hidden="true" size={18} stroke={1.75} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold text-slate-ink group-hover:text-amber">
                            {w.lesson.kind === "quiz" ? "Final check" : w.lesson.title.replace("Checkpoint: ", "")}
                          </span>
                          <span className="block text-sm text-stone-muted">
                            {w.lesson.kind === "quiz" ? "Quiz" : "Checkpoint"} · {w.course.name}
                          </span>
                        </span>
                        <IconArrowRight
                          aria-hidden="true"
                          size={16}
                          stroke={2}
                          className="shrink-0 text-stone group-hover:text-slate-ink"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
              {waiting.length > 4 && (
                <Link href="/my-courses" className={`${sectionLink} -ml-2 mt-2 inline-block`}>
                  And {waiting.length - 4} more in My courses
                </Link>
              )}
            </>
          )}
        </section>
      </div>

      {/* Teachers' replies to checkpoints */}
      {replies.length > 0 && (
        <section aria-labelledby="replies-heading" className={card}>
          <div className="flex items-center gap-2.5">
            <IconMessageCircle aria-hidden="true" size={22} stroke={1.75} className="text-amber" />
            <h2 id="replies-heading" className={sectionTitle}>
              From your teachers
            </h2>
          </div>
          <ul className={`mt-4 grid gap-3 ${replies.length >= 3 ? "lg:grid-cols-3" : replies.length === 2 ? "lg:grid-cols-2" : "max-w-2xl"}`}>
            {replies.slice(0, 3).map((r) => (
              <li key={`${r.course.slug}/${r.lesson.slug}`} className="flex flex-col rounded-xl border border-flame/40 bg-flame/[0.07] p-4">
                <p className="flex-1 whitespace-pre-line text-slate-ink">{r.feedback}</p>
                <Link
                  href={`/school/classes/${r.course.slug}/${r.lesson.slug}`}
                  className="mt-3 text-sm font-semibold text-amber underline-offset-4 hover:underline"
                >
                  {r.course.name} · {r.lesson.title.replace("Checkpoint: ", "")}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        {/* My courses */}
        <section aria-labelledby="courses-heading" className={card}>
          <div className="flex items-center justify-between gap-4">
            <h2 id="courses-heading" className={sectionTitle}>
              My courses
            </h2>
            <Link href="/my-courses" className={sectionLink}>
              View all
            </Link>
          </div>
          {mine.length === 0 ? (
            <p className="mt-4 text-stone-muted">
              You haven’t joined a class yet.{" "}
              <Link href="/school/classes" className="link font-semibold text-slate-ink">
                Browse the classes
              </Link>
            </p>
          ) : (
            <ul className="mt-2 divide-y divide-rule/80">
              {mine.map(({ course, p }) => (
                <li key={course.slug} className="grid gap-3 py-4 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:items-center sm:gap-6">
                  <Link href={`/school/classes/${course.slug}`} className="min-w-0 hover:text-amber">
                    <span className="block truncate font-display text-xl text-slate-ink">{course.name}</span>
                    {course.meaning && <span className="block truncate text-xs font-semibold text-amber">{course.meaning}</span>}
                  </Link>
                  <ProgressBar finished={p.finished} total={p.total} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* My books */}
        <section aria-labelledby="books-heading" className={card}>
          <div className="flex items-center justify-between gap-4">
            <h2 id="books-heading" className={sectionTitle}>
              My books
            </h2>
            <Link href="/my-books" className={sectionLink}>
              View all
            </Link>
          </div>
          {books.length === 0 ? (
            <p className="mt-4 text-stone-muted">
              E-books you buy appear here.{" "}
              <Link href="/books" className="link font-semibold text-slate-ink">
                Visit the bookstore
              </Link>
            </p>
          ) : (
            <>
              {reading && (
                <Link
                  href={`/read/${reading.slug}`}
                  className="group mt-4 flex items-center gap-4 rounded-xl border border-rule/80 bg-limestone/60 p-3 transition-colors hover:border-stone"
                >
                  <BookCover cover={reading.cover_image_url} sizes="3rem" className="w-12 shrink-0 rounded-md shadow-sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold uppercase tracking-[0.12em] text-stone-muted">Pick up where you stopped</span>
                    <span className="block truncate font-semibold text-slate-ink group-hover:text-amber">{reading.title}</span>
                    {reading.page_count && (
                      <span className="block text-sm text-stone-muted">
                        Page {reading.last_page} of {reading.page_count}
                      </span>
                    )}
                  </span>
                  <IconBook aria-hidden="true" size={20} stroke={1.75} className="shrink-0 text-amber" />
                </Link>
              )}
              <ul className="mt-4 grid grid-cols-4 gap-3">
                {books.slice(0, 4).map((b) => (
                  <li key={b.slug} className="min-w-0">
                    <Link href={`/read/${b.slug}`} title={`Read ${b.title}`} className="block transition-transform hover:-translate-y-0.5">
                      <BookCover
                        cover={b.cover_image_url}
                        alt={b.title}
                        sizes="7rem"
                        className="w-full rounded-lg shadow-[0_10px_24px_-14px_rgb(29_38_48/0.6)]"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>

      {/* Self-tests */}
      <section aria-labelledby="selftest-heading" className={`${card} flex flex-wrap items-center gap-x-6 gap-y-4`}>
        <span className="hidden size-11 shrink-0 place-items-center rounded-xl bg-flame/15 text-amber sm:grid">
          <IconSparkles aria-hidden="true" size={22} stroke={1.75} />
        </span>
        <div className="min-w-0 flex-1 basis-60">
          <h2 id="selftest-heading" className={sectionTitle}>
            Self-tests
          </h2>
          <p className="mt-0.5 text-stone-muted">Reflect on your calling. Results you get while signed in are saved to your account.</p>
        </div>
        <Link href="/self-test" className="btn btn-quiet">
          Take a self-test
          <IconArrowRight aria-hidden="true" size={16} stroke={2} />
        </Link>
      </section>
    </div>
  );
}
