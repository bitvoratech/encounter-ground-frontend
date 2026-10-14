import type { Metadata } from "next";
import Link from "next/link";
import { school, schoolClasses } from "@/content/school";

export const metadata: Metadata = {
  title: `Classes · ${school.shortName}`,
  description: `The discipleship classes of ${school.name}: ${schoolClasses.map((c) => c.name).join(", ")}.`,
};

export default function SchoolClassesPage() {
  return (
    <>
      <header className="wrap pb-12 pt-14 md:pt-20">
        <p className="font-semibold text-amber">{school.shortName}</p>
        <h1 className="mt-2 text-[length:var(--text-h1)] text-slate-ink">The classes</h1>
        <p className="mt-5 max-w-[34rem] text-lede leading-relaxed text-stone-muted">
          Structured teaching for every stage of the walk. Classes open online here, and the
          ones you join appear on your dashboard.
        </p>
      </header>

      <section aria-label="Classes" className="border-t border-rule bg-chalk">
        <ol className="wrap grid gap-5 py-14 md:grid-cols-2 md:py-20">
          {schoolClasses.map((c, i) => (
            <li key={c.name} className="flex flex-col rounded-3xl border border-rule bg-limestone p-6 md:p-8">
              <span className="font-display text-4xl text-amber-logo" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-4 text-[length:var(--text-h2)] text-slate-ink">{c.name}</h2>
              <p className="mt-1 font-semibold text-amber">{c.meaning}</p>
              <p className="mt-4 flex-1 text-[1.125rem] text-slate-ink/90">{c.body}</p>
              <p className="mt-6 text-sm font-semibold text-stone-muted">Opening online soon</p>
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
            <Link href="/dashboard" className="btn btn-quiet text-slate-ink">
              Go to my dashboard
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
