import { IconArrowLeft, IconCheck, IconClock, IconDeviceLaptop, IconFlag, IconLayoutList } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ClassesUnavailable } from "@/components/school/ClassesUnavailable";
import { CourseOutline } from "@/components/school/CourseOutline";
import { EnrolButton } from "@/components/school/EnrolButton";
import { formatMinutes } from "@/components/school/lessonKinds";
import { courseLessons, loadCourse } from "@/lib/courses";

export async function generateMetadata({ params }: PageProps<"/school/classes/[slug]">): Promise<Metadata> {
  const course = await loadCourse((await params).slug);
  return typeof course === "object" ? { title: course.name, description: course.summary ?? undefined } : {};
}

const steps = [
  { title: "Learn at your own pace", body: "Short video, audio and reading lessons you can take on any device, whenever suits you." },
  { title: "Reflect at each checkpoint", body: "Each module ends with a short written checkpoint. A teacher reads every one." },
  { title: "Follow your progress", body: "Your dashboard shows where you are, and picks up where you left off." },
];

export default async function CoursePage({ params }: PageProps<"/school/classes/[slug]">) {
  // Fetch at request time, so builds never depend on the API being reachable.
  await connection();
  const course = await loadCourse((await params).slug);
  if (course === "unavailable") return <ClassesUnavailable />;
  if (course === "missing") notFound();
  const lessons = courseLessons(course);
  const minutes = lessons.reduce((sum, l) => sum + l.lesson.minutes, 0);

  const facts = [
    { Icon: IconLayoutList, text: `${course.modules.length} modules · ${lessons.length} lessons` },
    { Icon: IconClock, text: `About ${formatMinutes(minutes)} of teaching` },
    { Icon: IconDeviceLaptop, text: "Online, at your own pace" },
    { Icon: IconFlag, text: "A checkpoint after every module" },
  ];

  return (
    <>
      <header className="wrap grid gap-10 pb-14 pt-8 md:grid-cols-[3fr_2fr] md:items-start md:pb-20 md:pt-12">
        <div>
          <Link href="/school/classes" className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-muted hover:text-slate-ink">
            <IconArrowLeft aria-hidden="true" size={16} stroke={2} />
            All classes
          </Link>
          {course.badge && (
            <p className="mt-8 w-fit rounded-full bg-slate px-3 py-1 text-xs font-semibold text-chalk">{course.badge}</p>
          )}
          <h1 className={`${course.badge ? "mt-3" : "mt-8"} text-[length:var(--text-h1)] text-slate-ink`}>{course.name}</h1>
          <p className="mt-2 text-lede font-semibold text-amber">{course.meaning}</p>
          <p className="mt-5 max-w-[34rem] text-lede leading-relaxed text-stone-muted">{course.summary}</p>
          <p className="mt-4 text-sm text-stone-muted">Course fee: to be confirmed by the ministry.</p>

          <div className="mt-8 flex flex-wrap items-start gap-x-6 gap-y-4">
            <EnrolButton course={course} />
            <a href="#outline" className="link mt-3 font-semibold text-slate-ink">
              See the outline
            </a>
          </div>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {facts.map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-slate-ink">
                <Icon aria-hidden="true" size={22} stroke={1.75} className="shrink-0 text-amber" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <aside aria-labelledby="outcomes-heading" className="rounded-3xl bg-slate-deep p-6 text-chalk md:p-8">
          <h2 id="outcomes-heading" className="text-h3">
            In {course.name} you will
          </h2>
          <ul className="mt-5 grid gap-4">
            {course.outcomes.map((o) => (
              <li key={o} className="flex items-start gap-3">
                <IconCheck aria-hidden="true" size={20} stroke={2.5} className="mt-0.5 shrink-0 text-flame" />
                <span className="text-chalk/90">{o}</span>
              </li>
            ))}
          </ul>
        </aside>
      </header>

      <section aria-labelledby="how-heading" className="border-y border-rule bg-chalk">
        <div className="wrap py-14 md:py-20">
          <h2 id="how-heading" className="text-[length:var(--text-h2)] text-slate-ink">
            How you’ll learn
          </h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-3xl border border-rule bg-limestone p-6">
                <span className="font-display text-4xl text-amber-logo" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-h3 text-slate-ink">{s.title}</h3>
                <p className="mt-2 text-stone-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="outline" aria-labelledby="outline-heading" className="scroll-mt-24">
        <div className="wrap py-14 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="outline-heading" className="text-[length:var(--text-h2)] text-slate-ink">
              Class outline
            </h2>
            <p className="text-sm text-stone-muted">Sample outline: the ministry will supply the real lessons.</p>
          </div>
          <div className="mt-8 max-w-3xl">
            <CourseOutline course={course} />
          </div>
        </div>
      </section>
    </>
  );
}
