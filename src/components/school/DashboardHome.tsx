"use client";

import {
  IconArrowRight,
  IconBooks,
  IconCircleCheck,
  IconClipboardCheck,
  IconFlag,
  IconListCheck,
  IconSchool,
  IconSparkles,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import type { Account } from "@/components/layout/useFullScreenMenu";
import { findBook, type Book } from "@/content/books";
import { courseLessons, courses, findCourse, sampleCourses, type Course } from "@/content/courses";
import { courseProgress, useCompleted, useEnrolments } from "@/lib/learning";
import { useLibrary } from "@/lib/library";
import { Avatar } from "./Avatar";
import { ProgressBar } from "./ProgressBar";

const card = "rounded-3xl border border-rule bg-chalk p-6";
const cardTitle = "font-display text-2xl leading-tight text-slate-ink";

/**
 * The student dashboard, in the order learning platforms recommend: carry on where you left
 * off first, then what is waiting (checkpoints and final checks), then courses, books and the
 * rest. Learning data lives in this browser until the backend.
 */
export function DashboardHome({ account, passwordUpdated }: { account: Account; passwordUpdated: boolean }) {
  const enrolments = useEnrolments();
  const done = useCompleted();
  const library = useLibrary();
  const firstName = account.name.split(" ")[0];
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  if (!enrolments || !done || !library) {
    return (
      <div aria-hidden="true" className="grid gap-6">
        <div className="h-24 rounded-3xl bg-chalk/70" />
        <div className="h-64 rounded-3xl bg-chalk/70" />
      </div>
    );
  }

  const myCourses = enrolments.map(findCourse).filter((c): c is Course => !!c);
  const books = library.map(findBook).filter((b): b is Book => !!b);
  const allLessons = myCourses.flatMap((c) => courseLessons(c).map((l) => ({ ...l, course: c })));
  const lessonsDone = allLessons.filter((l) => done.includes(l.id)).length;
  const checkpointsDone = allLessons.filter((l) => l.lesson.kind === "checkpoint" && done.includes(l.id)).length;
  const waiting = allLessons.filter((l) => (l.lesson.kind === "checkpoint" || l.lesson.kind === "quiz") && !done.includes(l.id));
  // Carry on with the first class that isn't finished.
  const current = myCourses.map((c) => ({ course: c, p: courseProgress(c, done) })).find((x) => !x.p.complete);

  const stats = [
    { label: "Classes", value: myCourses.length, Icon: IconSchool },
    { label: "Lessons done", value: lessonsDone, Icon: IconCircleCheck },
    { label: "Checkpoints", value: checkpointsDone, Icon: IconFlag },
    { label: "E-books", value: books.length, Icon: IconBooks },
  ];

  return (
    <div className="grid gap-6">
      {/* Greeting */}
      <header className="flex flex-wrap items-center gap-4">
        <Avatar name={account.name} src={account.avatarUrl} size={56} />
        <div className="min-w-0 flex-1">
          <p className="text-sm text-stone-muted">{today}</p>
          <h1 className="text-[length:var(--text-h2)] leading-tight text-slate-ink">Welcome back, {firstName}</h1>
        </div>
      </header>
      {passwordUpdated && (
        <p role="status" className="rounded-xl bg-flame/15 px-4 py-3 font-semibold text-amber">
          Your password has been updated.
        </p>
      )}
      {sampleCourses && (
        <p className="text-sm text-stone-muted">Test mode: classes, progress and books are saved in this browser only.</p>
      )}

      {/* At a glance */}
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, Icon }) => (
          <li key={label} className="flex items-center gap-3 rounded-2xl border border-rule bg-chalk p-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-flame/20 text-amber">
              <Icon aria-hidden="true" size={22} stroke={1.75} />
            </span>
            <span>
              <span className="block font-display text-3xl leading-none text-slate-ink tabular-nums">{value}</span>
              <span className="block text-sm text-stone-muted">{label}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        {/* Continue learning: the most useful thing on the page, so it comes first */}
        {current ? (
          <section aria-labelledby="continue-heading" className="relative flex flex-col overflow-hidden rounded-3xl bg-slate-deep p-6 text-chalk md:p-8">
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(70%_80%_at_100%_100%,rgb(248_184_8/0.22),transparent)]" />
            <div className="relative flex flex-1 flex-col">
              <h2 id="continue-heading" className="font-sans text-sm font-semibold uppercase tracking-[0.14em] text-flame">
                Continue where you left off
              </h2>
              <p className="mt-3 font-display text-[clamp(1.75rem,1.4rem+1.4vw,2.5rem)] leading-tight">{current.p.next.lesson.title}</p>
              <p className="mt-1 text-chalk/75">
                {current.course.name} · Module {current.p.next.moduleIndex + 1}: {current.p.next.module.title}
              </p>
              <div className="mt-6 max-w-md">
                <p className="flex justify-between text-sm text-chalk/80">
                  <span>
                    {current.p.finished} of {current.p.total} lessons
                  </span>
                  <span>{current.p.percent}%</span>
                </p>
                <div aria-hidden="true" className="mt-2 h-2 overflow-hidden rounded-full bg-chalk/15">
                  <div className="h-full rounded-full bg-flame" style={{ width: `${current.p.percent}%` }} />
                </div>
              </div>
              <Link href={`/school/classes/${current.course.slug}/${current.p.next.lesson.slug}`} className="btn btn-fire mt-6 self-start xl:mt-auto">
                {current.p.finished === 0 ? "Start learning" : "Continue"}
                <IconArrowRight aria-hidden="true" size={18} stroke={2} />
              </Link>
            </div>
          </section>
        ) : (
          <section aria-labelledby="start-heading" className="rounded-3xl bg-slate-deep p-6 text-chalk md:p-8">
            <h2 id="start-heading" className="font-sans text-sm font-semibold uppercase tracking-[0.14em] text-flame">
              {myCourses.length ? "Every class complete" : "Start your first class"}
            </h2>
            <p className="mt-3 font-display text-[clamp(1.75rem,1.4rem+1.4vw,2.5rem)] leading-tight">
              {myCourses.length ? "Well done. Ready for the next one?" : `${courses[0]!.name}: ${courses[0]!.summary.split(":")[0]}`}
            </p>
            <p className="mt-2 max-w-lg text-chalk/75">
              {myCourses.length ? "Browse the classes to keep growing." : "New to the school? Begin with Halak. The first lesson is a free preview."}
            </p>
            <Link href={myCourses.length ? "/school/classes" : `/school/classes/${courses[0]!.slug}`} className="btn btn-fire mt-6">
              {myCourses.length ? "Browse the classes" : "Start with Halak"}
              <IconArrowRight aria-hidden="true" size={18} stroke={2} />
            </Link>
          </section>
        )}

        {/* Quizzes and checkpoints waiting */}
        <section aria-labelledby="waiting-heading" className={card}>
          <div className="flex items-center gap-2">
            <IconClipboardCheck aria-hidden="true" size={22} stroke={1.75} className="text-amber" />
            <h2 id="waiting-heading" className={cardTitle}>
              Quizzes &amp; checkpoints
            </h2>
          </div>
          {myCourses.length === 0 ? (
            <p className="mt-4 text-stone-muted">Enrol in a class and its checkpoints and final check appear here.</p>
          ) : waiting.length === 0 ? (
            <p className="mt-4 text-stone-muted">Nothing waiting. Every checkpoint and final check is done.</p>
          ) : (
            <>
              <p className="mt-1 text-sm text-stone-muted">{waiting.length} waiting</p>
              <ul className="mt-4 grid gap-2">
                {waiting.slice(0, 4).map((w) => {
                  const Icon = w.lesson.kind === "quiz" ? IconListCheck : IconFlag;
                  return (
                    <li key={w.id}>
                      <Link
                        href={`/school/classes/${w.course.slug}/${w.lesson.slug}`}
                        className="flex items-center gap-3 rounded-2xl border border-rule bg-limestone p-3 transition-colors hover:border-slate"
                      >
                        <Icon aria-hidden="true" size={20} stroke={1.75} className="shrink-0 text-amber" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold text-slate-ink">
                            {w.lesson.kind === "quiz" ? `${w.course.name}: final check` : w.lesson.title.replace("Checkpoint: ", "")}
                          </span>
                          <span className="block text-xs text-stone-muted">
                            {w.lesson.kind === "quiz" ? "Final check" : "Checkpoint"} · {w.course.name}
                          </span>
                        </span>
                        <IconArrowRight aria-hidden="true" size={16} stroke={2} className="shrink-0 text-stone-muted" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
              {waiting.length > 4 && <p className="mt-3 text-sm text-stone-muted">And {waiting.length - 4} more in My courses.</p>}
            </>
          )}
        </section>

        {/* My courses */}
        <section aria-labelledby="courses-heading" className={card}>
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="courses-heading" className={cardTitle}>
              My courses
            </h2>
            <Link href="/my-courses" className="link text-sm font-semibold text-slate-ink">
              View all
            </Link>
          </div>
          {myCourses.length === 0 ? (
            <p className="mt-4 text-stone-muted">
              You haven’t joined a class yet.{" "}
              <Link href="/school/classes" className="link font-semibold text-slate-ink">
                Browse the classes
              </Link>
            </p>
          ) : (
            <ul className="mt-5 grid gap-5">
              {myCourses.map((c) => {
                const p = courseProgress(c, done);
                return (
                  <li key={c.slug} className="grid gap-3 sm:grid-cols-[10rem_1fr] sm:items-center">
                    <Link href={`/school/classes/${c.slug}`} className="font-display text-xl text-slate-ink hover:underline hover:decoration-flame hover:underline-offset-4">
                      {c.name}
                      <span className="block font-sans text-xs font-semibold text-amber">{c.meaning}</span>
                    </Link>
                    <ProgressBar finished={p.finished} total={p.total} />
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* My books */}
        <section aria-labelledby="books-heading" className={card}>
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="books-heading" className={cardTitle}>
              My books
            </h2>
            <Link href="/my-books" className="link text-sm font-semibold text-slate-ink">
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
            <ul className="mt-5 flex gap-3">
              {books.slice(0, 4).map((b) => (
                <li key={b.slug} className="w-1/4 min-w-0 max-w-24">
                  <Link href="/my-books" title={b.title}>
                    <Image
                      src={b.cover}
                      alt={b.title}
                      width={683}
                      height={1024}
                      sizes="6rem"
                      className="aspect-[2/3] w-full rounded-lg bg-limestone object-cover shadow-[0_10px_24px_-14px_rgb(29_38_48/0.6)]"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Self-tests */}
        <section aria-labelledby="selftest-heading" className={card}>
          <div className="flex items-center gap-2">
            <IconSparkles aria-hidden="true" size={22} stroke={1.75} className="text-amber" />
            <h2 id="selftest-heading" className={cardTitle}>
              Self-tests
            </h2>
          </div>
          <p className="mt-3 text-stone-muted">Reflect on your calling. Results you get while signed in are saved to your account.</p>
          <Link href="/self-test" className="btn btn-quiet mt-5 text-slate-ink">
            Take a self-test
          </Link>
        </section>

        {/* Account */}
        <section aria-labelledby="account-heading" className={card}>
          <h2 id="account-heading" className={cardTitle}>
            Your details
          </h2>
          <dl className="mt-4 grid gap-3">
            <div>
              <dt className="text-sm text-stone-muted">Name</dt>
              <dd className="text-slate-ink">{account.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-stone-muted">Email</dt>
              <dd className="break-all text-slate-ink">{account.email}</dd>
            </div>
          </dl>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link href="/reset-password" className="link text-sm font-semibold text-slate-ink">
              Change password
            </Link>
            <form action="/auth/signout" method="post">
              <button type="submit" className="text-sm font-semibold text-stone-muted hover:text-slate-ink">
                Sign out
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
