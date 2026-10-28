import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { mission, story, values, vision } from "@/content/ministry";
import denimImage from "../../../../public/images/home/founder-denim.jpg";
import creamImage from "../../../../public/images/home/founder-cream.jpg";

export const metadata: Metadata = {
  title: "Who we are",
  description:
    "How Encounter Ground began, and the vision, mission and values that guide the ministry.",
};

export default function AboutPage() {
  return (
    <>
      <header className="page-hero wrap grid gap-12 pb-14 pt-14 md:grid-cols-[3fr_2fr] md:items-center md:pb-20 md:pt-20">
        <div>
          <p className="eyebrow">Who we are</p>
          <h1 className="mt-4 max-w-3xl text-[length:var(--text-h1)] text-slate-ink">
            Every person has a scroll <em>written by God</em>
          </h1>
          <p className="mt-6 max-w-[34rem] text-lede leading-relaxed text-stone-muted">
            Encounter Ground began with one person’s hunger for God, and a mandate
            to help others seek Him and find Him.
          </p>
        </div>
        <div className="photo-frame mx-auto w-full max-w-[17rem] sm:max-w-xs md:max-w-sm">
          <Image
            src={denimImage}
            alt="Toyin Bello of Encounter Ground"
            placeholder="blur"
            priority
            sizes="(min-width: 768px) 24rem, 17rem"
            className="aspect-[4/5] w-full rounded-2xl object-cover object-top"
          />
        </div>
      </header>

      <section aria-labelledby="story-heading" className="border-t border-rule">
        <div className="wrap grid gap-10 py-14 md:grid-cols-[1fr_2fr] md:py-20">
          <div>
            <p className="eyebrow">How it began</p>
            <h2 id="story-heading" className="mt-4 text-[length:var(--text-h2)] text-slate-ink">
              Our <em>story</em>
            </h2>
            <Image
              src={creamImage}
              alt="Toyin Bello in a long cream dress"
              placeholder="blur"
              sizes="(min-width: 768px) 28vw, 0px"
              className="mt-10 hidden aspect-[3/4] w-full max-w-xs rounded-2xl object-cover object-top md:block"
            />
          </div>
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
          <ul className="mt-10 grid grid-cols-2 gap-x-6 border-t border-rule sm:gap-x-10 lg:grid-cols-3">
            {values.map((v) => (
              <li key={v} className="border-b border-rule py-3.5 font-display text-xl leading-snug text-slate sm:py-4 sm:text-2xl">
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
