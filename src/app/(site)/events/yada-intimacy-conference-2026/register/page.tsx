import type { Metadata } from "next";
import Link from "next/link";
import { YadaRegisterForm } from "@/components/site/YadaRegisterForm";
import { api } from "@/lib/api";
import { getSiteContent, whatsappOf } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Register for YADA 2026",
  description: "Save your seat for the YADA Intimacy Conference, Dec. 18th – 20th, 2026, in Lekki, Lagos.",
};

// Re-check every minute whether registration is still open.
export const revalidate = 60;

/** Whether the team has registration switched on. If the API can't be reached the form still shows; the API refuses sign-ups itself when registration is closed. */
async function registrationOpen(slug: string) {
  try {
    const event = await api<{ registration_open: boolean }>(`/events/${slug}`, { next: { revalidate: 60 } });
    return event.registration_open;
  } catch {
    return true;
  }
}

export default async function YadaRegisterPage() {
  const { contact, yada } = await getSiteContent();
  const whatsapp = whatsappOf(contact);
  const eventPath = `/events/${yada.slug}`;
  const open = await registrationOpen(yada.slug);

  return (
    <>
      <header className="page-hero wrap pb-10 pt-14 md:pt-20">
        <Link href={eventPath} className="link text-stone-muted">
          ← YADA Intimacy Conference
        </Link>
        <p className="mt-6 font-semibold text-amber">{yada.when}</p>
        <h1 className="mt-2 max-w-3xl text-[length:var(--text-h1)] text-slate-ink">Register for YADA 2026</h1>
        <p className="mt-5 max-w-[38rem] text-lede leading-relaxed text-stone-muted">
          Save your seat. It takes about two minutes, and you can ask for transport from your area while you’re at it.
        </p>
      </header>

      <section aria-label="Registration" className="border-t border-rule">
        <div className="wrap grid gap-14 py-12 md:grid-cols-[3fr_2fr] md:gap-20 md:py-16">
          <div>
            {open ? (
              <YadaRegisterForm
                eventSlug={yada.slug}
                eventPath={eventPath}
                when={yada.when}
                time={yada.time}
                venue={yada.venue}
                where={yada.where}
                whatsappHref={whatsapp.href}
              />
            ) : (
              <div role="status" className="rounded-3xl border border-rule bg-chalk p-8">
                <h2 className="text-h3 text-slate-ink">Registration is closed</h2>
                <p className="mt-3 text-stone-muted">
                  We’re no longer taking registrations for YADA 2026. Follow the WhatsApp channel for updates, or write to us if you have a question.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={whatsapp.href} target="_blank" rel="noopener noreferrer" className="btn btn-fire">
                    Follow on WhatsApp
                  </a>
                  <Link href="/contact" className="btn btn-quiet text-slate-ink">
                    Contact us
                  </Link>
                </div>
              </div>
            )}
          </div>

          <aside aria-label="Event details" className="grid content-start gap-8">
            <div>
              <h2 className="font-sans text-base text-stone-muted">When</h2>
              <p className="mt-1 font-display text-2xl text-slate-ink">{yada.when}</p>
              <p className="text-stone-muted">{yada.time}</p>
            </div>
            <div>
              <h2 className="font-sans text-base text-stone-muted">Where</h2>
              <p className="mt-1 font-display text-2xl text-slate-ink">{yada.venue}</p>
              <p className="text-stone-muted">{yada.where}</p>
            </div>
            <div>
              <h2 className="font-sans text-base text-stone-muted">What to wear</h2>
              <p className="mt-1 text-slate-ink/90">{yada.dress[0]}</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
