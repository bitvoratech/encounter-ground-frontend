import type { Metadata } from "next";
import Link from "next/link";
import { mission, story, values, vision } from "@/content/ministry";

export const metadata: Metadata = {
  title: "Who we are",
  description:
    "How Encounter Ground began, and the vision, mission and values that guide the ministry.",
};

export default function AboutPage() {
  return (
    <>
      <header className="wrap pb-12 pt-14 md:pb-16 md:pt-20">
        <h1 className="max-w-3xl text-[length:var(--text-h1)] text-slate-ink">
          Every person has a scroll written by God
        </h1>
        <p className="mt-6 max-w-[34rem] text-lede leading-relaxed text-stone-muted">
          Encounter Ground began with one person’s hunger for God, and a mandate
          to help others seek Him and find Him.
        </p>
      </header>

      <section aria-labelledby="story-heading" className="border-t border-rule">
        <div className="wrap grid gap-10 py-14 md:grid-cols-[1fr_2fr] md:py-20">
          <h2 id="story-heading" className="text-[length:var(--text-h2)] text-slate-ink">
            Our story
          </h2>
          <div className="prose-eg measure text-[1.125rem] text-slate-ink/90">
            {story.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Vision and mission" className="bg-chalk">
        <div className="wrap grid gap-14 py-16 md:grid-cols-2 md:gap-20 md:py-24">
          <div>
            <h2 className="text-[length:var(--text-h2)] text-slate-ink">Our vision</h2>
            <p className="mt-5 font-display text-[1.6rem] leading-snug text-slate">
              {vision}
            </p>
          </div>
          <div>
            <h2 className="text-[length:var(--text-h2)] text-slate-ink">Our mission</h2>
            <div className="prose-eg mt-5 text-[1.125rem] text-slate-ink/90">
              {mission.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="values-heading" className="border-t border-rule">
        <div className="wrap py-16 md:py-24">
          <h2 id="values-heading" className="text-[length:var(--text-h2)] text-slate-ink">
            What we hold to
          </h2>
          <ul className="mt-10 grid gap-x-10 border-t border-rule sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <li key={v} className="border-b border-rule py-4 font-display text-2xl text-slate">
                {v}
              </li>
            ))}
          </ul>
          <div className="mt-14 flex flex-wrap gap-3">
            <Link href="/events" className="btn btn-fire">
              Join a programme
            </Link>
            <Link href="/contact" className="btn btn-quiet text-slate-ink">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
