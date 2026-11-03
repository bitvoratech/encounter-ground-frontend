import type { Metadata } from "next";
import { YadaBand } from "@/components/site/YadaBand";
import { programmes } from "@/content/ministry";
import { sectionCopy } from "@/content/siteCopy";

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
    </>
  );
}
