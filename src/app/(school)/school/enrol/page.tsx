import type { Metadata } from "next";
import Link from "next/link";
import { contact } from "@/content/ministry";
import { enrolSteps, school } from "@/content/school";

export const metadata: Metadata = {
  title: `Enrol · ${school.shortName}`,
  description: `How to join ${school.name} and follow your classes from your Encounter Ground dashboard.`,
};

export default function SchoolEnrolPage() {
  return (
    <>
      <header className="wrap pb-12 pt-14 md:pt-20">
        <p className="font-semibold text-amber">{school.shortName}</p>
        <h1 className="mt-2 text-[length:var(--text-h1)] text-slate-ink">Enrol in the school</h1>
        <p className="mt-5 max-w-[34rem] text-lede leading-relaxed text-stone-muted">
          The school runs on your Encounter Ground account. Sign up once, and your classes live
          on your dashboard.
        </p>
      </header>

      <section aria-labelledby="steps-heading" className="border-t border-rule bg-chalk">
        <div className="wrap py-14 md:py-20">
          <h2 id="steps-heading" className="text-[length:var(--text-h2)] text-slate-ink">
            Three steps
          </h2>
          <ol className="mt-8 divide-y divide-rule border-y border-rule">
            {enrolSteps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[3.5rem_1fr] gap-4 py-6 sm:grid-cols-[5rem_1fr]">
                <span className="font-display text-4xl text-amber-logo" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-h3 text-slate-ink">{s.title}</h3>
                  <p className="mt-1 text-stone-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/register" className="btn btn-fire">
              Create an account
            </Link>
            <Link href="/dashboard" className="btn btn-quiet text-slate-ink">
              I have an account: go to my dashboard
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="questions-heading">
        <div className="wrap py-14">
          <h2 id="questions-heading" className="text-h3 text-slate-ink md:text-[2rem]">
            Questions about the school?
          </h2>
          <p className="mt-2 max-w-xl text-stone-muted">
            Email{" "}
            <a href={`mailto:${contact.email}`} className="link font-semibold text-slate-ink">
              {contact.email}
            </a>{" "}
            or{" "}
            <Link href="/contact" className="link font-semibold text-slate-ink">
              send us a message
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
