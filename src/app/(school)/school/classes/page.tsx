import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { ClassesUnavailable } from "@/components/school/ClassesUnavailable";
import { formatMinutes } from "@/components/school/lessonKinds";
import { getCourses } from "@/lib/courses";
import type { CourseSummary } from "@/types/school";
import { school, schoolClasses } from "@/content/school";

export const metadata: Metadata = {
  title: "Classes",
  description: `The discipleship classes of ${school.name}: ${schoolClasses.map((c) => c.name).join(", ")}.`,
};

export default async function SchoolClassesPage() {
  // Fetch at request time, so builds never depend on the API being reachable.
  await connection();
  let courses: CourseSummary[];
  try {
    courses = await getCourses();
  } catch (err) {
    console.error("Classes unavailable:", err);
    return <ClassesUnavailable />;
  }

  return (
    <>
      <header className="wrap pb-12 pt-14 md:pt-20">
        <p className="font-semibold text-amber">{school.shortName}</p>
        <h1 className="mt-2 text-[length:var(--text-h1)] text-slate-ink">The classes</h1>
        <p className="mt-5 max-w-[34rem] text-lede leading-relaxed text-stone-muted">
          Structured teaching for every stage of the walk, online and at your own pace. The
          first lesson of every class is a free preview.
        </p>
      </header>

      <section aria-label="Classes" className="border-t border-rule bg-chalk">
        <ol className="wrap grid gap-5 py-14 md:grid-cols-2 md:py-20">
          {courses.map((c, i) => (
            <li key={c.slug} className="flex flex-col rounded-3xl border border-rule bg-limestone p-6 md:p-8">
              <div className="flex items-center justify-between gap-3">
                <span className="font-display text-4xl text-amber-logo" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {c.badge && <span className="rounded-full bg-slate px-3 py-1 text-xs font-semibold text-chalk">{c.badge}</span>}
              </div>
              <h2 className="mt-4 text-[length:var(--text-h2)] text-slate-ink">{c.name}</h2>
              <p className="mt-1 font-semibold text-amber">{c.meaning}</p>
              <p className="mt-4 flex-1 text-[1.125rem] text-slate-ink/90">{c.summary}</p>
              <p className="mt-6 text-sm text-stone-muted">
                {c.module_count} modules · {c.lesson_count} lessons · about {formatMinutes(c.minutes)}
              </p>
              <Link href={`/school/classes/${c.slug}`} className="btn btn-fire mt-5 self-start">
                View class<span className="sr-only">: {c.name}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="next-heading">
        <div className="wrap flex flex-col gap-8 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="next-heading" className="text-h3 text-slate-ink md:text-[2rem]">
              Not sure where to start?
            </h2>
            <p className="mt-2 text-stone-muted">Begin with Halak, then follow the path as the Spirit leads.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/school/enrol" className="btn btn-fire">
              Enrol
            </Link>
            <Link href="/my-courses" className="btn btn-quiet text-slate-ink">
              My courses
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
