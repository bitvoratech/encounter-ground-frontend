import type { Metadata } from "next";
import { ContactForm } from "@/components/site/ContactForm";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { contact } from "@/content/ministry";
import { sectionCopy } from "@/content/siteCopy";

export const metadata: Metadata = {
  title: "Contact & Connect",
  description: sectionCopy.contact.short,
};

export default function ContactPage() {
  return (
    <>
      <header className="page-hero wrap pb-12 pt-14 md:pt-20">
        <p className="font-semibold text-amber">Contact &amp; Connect</p>
        <h1 className="mt-2 max-w-3xl text-[length:var(--text-h1)] text-slate-ink">{sectionCopy.contact.headline}</h1>
        <p className="mt-5 max-w-[38rem] text-lede leading-relaxed text-stone-muted">{sectionCopy.contact.body}</p>
      </header>

      <section aria-labelledby="message-heading" className="border-t border-rule">
        <div className="wrap grid gap-14 py-14 md:grid-cols-[3fr_2fr] md:gap-20 md:py-20">
          <div>
            <h2 id="message-heading" className="text-[length:var(--text-h2)] text-slate-ink">
              Send a message
            </h2>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <div className="grid content-start gap-10">
            <div>
              <h2 className="font-sans text-base text-stone-muted">Email</h2>
              <a href={`mailto:${contact.email}`} className="link mt-2 inline-block font-display text-[1.375rem] text-slate-ink [overflow-wrap:anywhere] sm:text-[1.75rem]">
                {contact.email}
              </a>
            </div>
            <div>
              <h2 className="font-sans text-base text-stone-muted">Phone</h2>
              <a href={contact.phoneHref} className="link mt-2 inline-block font-display text-[1.75rem] text-slate-ink">
                {contact.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="social-heading" className="bg-chalk">
        <div className="wrap py-14 md:py-20">
          <h2 id="social-heading" className="text-[length:var(--text-h2)] text-slate-ink">
            Follow along
          </h2>
          <ul className="mt-8 divide-y divide-rule border-y border-rule">
            {contact.socials.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-wrap items-center justify-between gap-2 py-5"
                >
                  <span className="inline-flex items-center gap-3 font-display text-2xl text-slate-ink group-hover:text-amber">
                    <SocialIcon name={s.name} size={26} className="text-amber" />
                    {s.name}
                  </span>
                  <span className="text-stone-muted">{s.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
