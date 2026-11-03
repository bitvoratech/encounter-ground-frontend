import type { Metadata } from "next";
import { YadaBand } from "@/components/site/YadaBand";
import Image from "next/image";
import { programmes } from "@/content/ministry";
import { sectionCopy } from "@/content/siteCopy";
import meetingImage from "../../../../public/images/home/revival-meeting.jpg";
import zoeImage from "../../../../public/images/home/zoe-healing-stream.jpg";

export const metadata: Metadata = {
  title: "Gatherings & Events",
  description: sectionCopy.gatherings.short,
};

export default function EventsPage() {
  const regular = programmes.filter((p) => p.when !== "December");

  return (
    <>
      <header className="page-hero wrap pb-12 pt-14 md:pt-20">
        <p className="font-semibold text-amber">Gatherings &amp; Events</p>
        <h1 className="mt-2 max-w-3xl text-[length:var(--text-h1)] text-slate-ink">{sectionCopy.gatherings.headline}</h1>
        <p className="mt-5 max-w-[38rem] text-lede leading-relaxed text-stone-muted">{sectionCopy.gatherings.body}</p>
      </header>

      <YadaBand />

      <section aria-labelledby="regular-heading">
        <div className="wrap py-16 md:py-24">
          <h2 id="regular-heading" className="text-[length:var(--text-h2)] text-slate-ink">
            Regular meetings
          </h2>
          <ul className="mt-8 divide-y divide-rule border-y border-rule">
            {regular.map((p) => (
              <li key={p.slug} className="grid gap-1 py-6 sm:grid-cols-[12rem_1fr_auto] sm:items-baseline sm:gap-6">
                <span className="font-semibold text-amber">{p.detail}</span>
                <h3 className="text-h3 text-slate-ink">{p.name}</h3>
                <span className="text-stone-muted">{p.where ?? ""}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-stone-muted">
            Meeting times are shared on the WhatsApp channel ahead of each programme.
          </p>
        </div>
      </section>

      <section aria-labelledby="zoe-heading" className="border-t border-rule bg-chalk">
        <div className="wrap grid gap-10 py-16 md:grid-cols-[1.2fr_1fr] md:items-center md:py-24">
          <Image
            src={zoeImage}
            alt="Zoe Healing Streams flyer: strictly for people trusting God for healing, every Wednesday from 8:00 to 10:00 am West Central Africa time, hosted by Toyin Bello"
            placeholder="blur"
            sizes="(min-width: 768px) 55vw, 100vw"
            className="w-full rounded-2xl shadow-[0_24px_50px_-28px_rgb(29_38_48/0.6)]"
          />
          <div>
            <p className="eyebrow">Every Wednesday</p>
            <h2 id="zoe-heading" className="mt-4 text-[length:var(--text-h2)] text-slate-ink">
              Zoe <em>Healing</em> Stream
            </h2>
            <p className="mt-5 max-w-md text-[1.125rem] text-slate-ink/90">
              Two hours of prayer for everyone trusting God for healing, hosted by Toyin Bello.
            </p>
            <p className="mt-3 font-semibold text-slate-ink">8:00 to 10:00 am, West Africa time</p>
          </div>
        </div>
      </section>
    </>
  );
}
