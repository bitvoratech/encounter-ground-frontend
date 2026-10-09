import type { Metadata } from "next";
import { contact } from "@/content/ministry";

export const metadata: Metadata = {
  title: "Contact",
  description: "Email, call or follow Encounter Ground.",
};

export default function ContactPage() {
  return (
    <>
      <header className="wrap pb-12 pt-14 md:pt-20">
        <h1 className="text-[length:var(--text-h1)] text-slate-ink">Contact us</h1>
        <p className="mt-5 max-w-[34rem] text-lede leading-relaxed text-stone-muted">
          For prayer requests, programme questions or anything else, send an email
          or give us a call.
        </p>
      </header>

      <section aria-label="Email and phone" className="border-t border-rule">
        <div className="wrap grid gap-12 py-14 md:grid-cols-2 md:py-20">
          <div>
            <h2 className="text-stone-muted font-sans text-base">Email</h2>
            <a href={`mailto:${contact.email}`} className="link mt-2 inline-block break-all font-display text-[1.75rem] text-slate-ink md:text-4xl">
              {contact.email}
            </a>
          </div>
          <div>
            <h2 className="text-stone-muted font-sans text-base">Phone</h2>
            <a href={contact.phoneHref} className="link mt-2 inline-block font-display text-[1.75rem] text-slate-ink md:text-4xl">
              {contact.phoneDisplay}
            </a>
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
                  className="group flex flex-wrap items-baseline justify-between gap-2 py-5"
                >
                  <span className="font-display text-2xl text-slate-ink group-hover:text-amber">
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
