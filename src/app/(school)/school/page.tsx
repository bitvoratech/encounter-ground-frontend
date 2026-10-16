import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { mandate } from "@/content/ministry";
import { school, schoolClasses } from "@/content/school";
import bethElImage from "../../../../public/images/home/beth-el-institute.jpg";

export const metadata: Metadata = {
  title: { absolute: school.name },
  description: school.summary,
};

export default function SchoolPage() {
  return (
    <>
      <header className="wrap grid gap-10 pb-14 pt-14 md:grid-cols-[3fr_2fr] md:items-center md:pb-20 md:pt-20">
        <div>
          <p className="font-semibold text-amber">The ministry school</p>
          <h1 className="mt-2 text-[length:var(--text-h1)] text-slate-ink">{school.name}</h1>
          <p className="mt-6 max-w-[34rem] text-lede leading-relaxed text-stone-muted">{school.summary}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/school/enrol" className="btn btn-fire">
              Enrol
            </Link>
            <Link href="/school/classes" className="btn btn-quiet text-slate-ink">
              See the classes
            </Link>
          </div>
        </div>
        <Image
          src={bethElImage}
          alt="Beth-El Institute of the Supernatural, an offshoot of Encounter Ground"
          placeholder="blur"
          sizes="(min-width: 768px) 35vw, 90vw"
          className="mx-auto w-full max-w-sm rounded-3xl border border-rule"
        />
      </header>

      <section aria-labelledby="about-heading" className="border-t border-rule">
        <div className="wrap grid gap-10 py-14 md:grid-cols-[1fr_2fr] md:py-20">
          <h2 id="about-heading" className="text-[length:var(--text-h2)] text-slate-ink">
            A house of God
          </h2>
          <div>
            <p className="font-display text-[1.6rem] leading-snug text-slate">{school.meaning}</p>
            <div className="prose-eg measure mt-6 text-[1.125rem] text-slate-ink/90">
              {school.about.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <blockquote className="measure mt-8 border-l-4 border-flame pl-5 font-display text-2xl leading-snug text-slate-ink">
              “{mandate}”
            </blockquote>
          </div>
        </div>
      </section>

      <section aria-labelledby="outcomes-heading" className="bg-chalk">
        <div className="wrap py-16 md:py-24">
          <h2 id="outcomes-heading" className="text-[length:var(--text-h2)] text-slate-ink">
            What you will grow in
          </h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {school.outcomes.map((o, i) => (
              <li key={o.title} className="rounded-3xl border border-rule bg-limestone p-6">
                <span className="font-display text-4xl text-amber-logo" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-h3 text-slate-ink">{o.title}</h3>
                <p className="mt-3 text-stone-muted">{o.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="classes-heading" className="border-t border-rule">
        <div className="wrap grid gap-10 py-16 md:grid-cols-[1fr_2fr] md:items-end md:py-24">
          <div>
            <h2 id="classes-heading" className="text-[length:var(--text-h2)] text-slate-ink">
              {schoolClasses.length} classes, one path
            </h2>
            <Link href="/school/classes" className="link mt-6 inline-block font-semibold text-slate-ink">
              About each class
            </Link>
          </div>
          <ul className="flex flex-wrap gap-x-10 gap-y-3">
            {schoolClasses.map((c) => (
              <li key={c.name} className="font-display text-[length:var(--text-h2)] text-slate">
                {c.name}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
