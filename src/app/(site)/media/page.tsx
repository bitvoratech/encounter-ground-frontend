import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { contact, home, programmes } from "@/content/ministry";
import streamsImage from "../../../../public/images/home/streams-gates.jpg";

export const metadata: Metadata = {
  title: "Media",
  description: "Watch replays on YouTube, listen on Mixlr, or join the live meeting on Zoom.",
};

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export default function MediaPage() {
  const live = programmes.filter((p) => p.when !== "December");

  return (
    <>
      <header className="relative isolate overflow-hidden bg-slate-deep text-chalk">
        <Image
          src={streamsImage}
          alt=""
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-deep/70 via-slate-deep/45 to-slate-deep/80"
        />
        <div className="wrap pb-20 pt-16 md:pb-28 md:pt-24">
          <p className="font-semibold text-flame">Media</p>
          <h1 className="mt-2 max-w-3xl text-[length:var(--text-h1)]">Catch up on our replays</h1>
          <p className="mt-5 max-w-[34rem] text-lede leading-relaxed text-chalk/90">
            Every stream is recorded. Watch again on YouTube, listen on Mixlr, or join
            the next meeting live on Zoom.
          </p>
        </div>
      </header>

      <section aria-label="Where to watch and listen">
        <ul className="wrap grid gap-5 py-14 md:grid-cols-3 md:py-20">
          {home.streams.map((s) => (
            <li key={s.name}>
              <a
                href={s.href}
                {...external}
                className="group flex h-full flex-col rounded-3xl border border-rule bg-chalk p-7 transition-colors hover:border-slate"
              >
                <span className="font-display text-[2rem] leading-tight text-slate-ink">{s.name}</span>
                <span className="mt-2 text-stone-muted">{s.detail}</span>
                <span className="mt-8 font-semibold text-amber group-hover:underline">
                  Open {s.name.split(" ")[0]}
                  <span aria-hidden="true"> →</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="schedule-heading" className="border-t border-rule bg-chalk">
        <div className="wrap grid gap-10 py-14 md:grid-cols-[1fr_2fr] md:py-20">
          <div>
            <h2 id="schedule-heading" className="text-[length:var(--text-h2)] text-slate-ink">
              When we go live
            </h2>
            <p className="mt-4 max-w-xs text-stone-muted">
              Times are shared on the{" "}
              <a
                href={contact.socials.find((s) => s.name === "WhatsApp channel")!.href}
                {...external}
                className="link"
              >
                WhatsApp channel
              </a>{" "}
              ahead of each programme.
            </p>
          </div>
          <ul className="divide-y divide-rule border-y border-rule">
            {live.map((p) => (
              <li key={p.slug} className="grid grid-cols-[7.5rem_1fr] gap-4 py-5 sm:grid-cols-[10rem_1fr]">
                <span className="pt-1 font-semibold text-amber">{p.when}</span>
                <div>
                  <h3 className="text-h3 text-slate-ink">{p.name}</h3>
                  <p className="mt-1 text-stone-muted">{p.where ?? p.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="library-heading">
        <div className="wrap flex flex-col gap-6 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="library-heading" className="text-h3 text-slate-ink md:text-[2rem]">
              A teaching library is on its way
            </h2>
            <p className="mt-2 max-w-xl text-stone-muted">
              Teachings and series will soon be watchable right here, organised and
              searchable.
            </p>
          </div>
          <Link href="/register" className="btn btn-quiet self-start text-slate-ink md:self-auto">
            Create an account
          </Link>
        </div>
      </section>
    </>
  );
}
