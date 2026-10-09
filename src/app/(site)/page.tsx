import Image from "next/image";
import Link from "next/link";
import { YadaBand } from "@/components/site/YadaBand";
import { contact, discipleshipClasses, mandate, programmes } from "@/content/ministry";

export default function HomePage() {
  return (
    <>
      {/* Hero: the mandate the ministry was born from */}
      <section className="overflow-hidden">
        <div className="wrap grid items-center gap-10 pb-16 pt-12 md:grid-cols-[1.5fr_1fr] md:pb-24 md:pt-20">
          <div>
            <h1 className="text-[length:var(--text-h1)] text-slate-ink">
              “{mandate.split(",")[0]}.”
            </h1>
            <p className="mt-6 max-w-[34rem] text-lede leading-relaxed text-stone-muted">
              That was the assignment. Encounter Ground exists to awaken hearts and
              guide people, young and old, into the scroll God has written for each
              of them: a life of purpose, power and intimacy with Him.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/about" className="btn btn-fire">
                Read our story
              </Link>
              <Link href="/events" className="btn btn-quiet text-slate-ink">
                See our programmes
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-36 sm:w-56 md:w-full md:max-w-sm" aria-hidden="true">
            <Image src="/brand/mark.png" alt="" width={371} height={390} priority className="h-auto w-full" />
          </div>
        </div>
      </section>

      {/* Regular meetings: a real weekly/quarterly rhythm, so it reads as a schedule */}
      <section aria-labelledby="rhythm-heading" className="border-t border-rule bg-chalk">
        <div className="wrap py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
            <div>
              <h2 id="rhythm-heading" className="text-[length:var(--text-h2)] text-slate-ink">
                Where to meet us
              </h2>
              <p className="mt-4 max-w-xs text-stone-muted">
                Prayer, healing and teaching run all year. Join any of them.
              </p>
            </div>
            <ul className="divide-y divide-rule border-y border-rule">
              {programmes.map((p) => (
                <li key={p.slug} className="grid grid-cols-[7.5rem_1fr] gap-4 py-5 sm:grid-cols-[10rem_1fr]">
                  <span className="pt-1 font-semibold text-amber">{p.when}</span>
                  <div>
                    <h3 className="text-h3 text-slate-ink">{p.name}</h3>
                    <p className="mt-1 text-stone-muted">
                      {p.detail}
                      {p.where ? `, ${p.where.charAt(0).toLowerCase()}${p.where.slice(1)}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <YadaBand />

      {/* Discipleship classes */}
      <section aria-labelledby="classes-heading">
        <div className="wrap py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:items-end">
            <div>
              <h2 id="classes-heading" className="text-[length:var(--text-h2)] text-slate-ink">
                Discipleship classes
              </h2>
              <p className="mt-4 max-w-sm text-stone-muted">
                Structured teaching for every stage of the walk. Classes move online
                when the Ministry School opens on this site.
              </p>
            </div>
            <ul className="flex flex-wrap gap-x-10 gap-y-3">
              {discipleshipClasses.map((c) => (
                <li key={c} className="font-display text-[length:var(--text-h2)] text-slate">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Stay connected */}
      <section aria-labelledby="connect-heading" className="border-t border-rule bg-chalk">
        <div className="wrap flex flex-col gap-8 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="connect-heading" className="text-h3 md:text-[2rem] text-slate-ink">
              Get updates on WhatsApp
            </h2>
            <p className="mt-2 text-stone-muted">
              Programme reminders and teachings, straight to your phone.
            </p>
          </div>
          <a
            href={contact.socials.find((s) => s.name === "WhatsApp channel")!.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-quiet self-start text-slate-ink md:self-auto"
          >
            Follow the channel
          </a>
        </div>
      </section>
    </>
  );
}
