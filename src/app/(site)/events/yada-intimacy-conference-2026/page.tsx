import type { Metadata } from "next";
import { contact, yada } from "@/content/ministry";

export const metadata: Metadata = {
  title: "YADA Intimacy Conference 2026",
  description: yada.about[0],
};

export default function YadaPage() {
  const whatsapp = contact.socials.find((s) => s.name === "WhatsApp channel")!;

  return (
    <>
      <header className="ember">
        <div className="wrap pb-20 pt-16 md:pb-32 md:pt-24">
          <p className="text-lg text-flame">{yada.when}</p>
          <h1 className="mt-3 text-[length:var(--text-display)] leading-[0.95] text-chalk">
            YADA
            <span className="block text-[0.5em] md:text-[0.42em] leading-tight text-chalk/90">
              Intimacy Conference
            </span>
          </h1>
          <p className="mt-10 text-chalk/70">Theme</p>
          <p className="font-display text-3xl text-flame-hot md:text-5xl">{yada.theme}</p>
          <a href={yada.registerUrl} target="_blank" rel="noopener noreferrer" className="btn btn-fire mt-10">
            Register now
          </a>
        </div>
      </header>

      {/* The write-up comes first, as the ministry asked */}
      <section aria-labelledby="about-heading">
        <div className="wrap grid gap-10 py-16 md:grid-cols-[1fr_2fr] md:py-24">
          <h2 id="about-heading" className="text-[length:var(--text-h2)] text-slate-ink">
            What YADA means
          </h2>
          <div className="prose-eg measure text-[1.2rem] text-slate-ink/90">
            {yada.about.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Event details" className="border-t border-rule bg-chalk">
        <dl className="wrap grid gap-10 py-16 md:grid-cols-3 md:py-20">
          <div>
            <dt className="text-stone-muted">When</dt>
            <dd className="mt-1 font-display text-2xl text-slate-ink">{yada.when}</dd>
            <dd className="mt-1 text-stone-muted">Exact dates and times will be announced.</dd>
          </div>
          <div>
            <dt className="text-stone-muted">Where</dt>
            <dd className="mt-1 font-display text-2xl text-slate-ink">Lagos</dd>
            <dd className="mt-1 text-stone-muted">Venue to be announced.</dd>
          </div>
          <div>
            <dt className="text-stone-muted">What to wear</dt>
            {yada.dress.map((d) => (
              <dd key={d} className="mt-1 text-slate-ink/90">
                {d}
              </dd>
            ))}
          </div>
        </dl>
      </section>

      <section aria-labelledby="register-heading" className="border-t border-rule">
        <div className="wrap flex flex-col gap-6 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="register-heading" className="text-h3 md:text-[2rem] text-slate-ink">
              Registration is open
            </h2>
            <p className="mt-2 max-w-lg text-stone-muted">
              Save your seat for {yada.when}. You can request transport from your area
              when you register, and follow the WhatsApp channel for updates.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 self-start md:self-auto">
            <a href={yada.registerUrl} target="_blank" rel="noopener noreferrer" className="btn btn-fire">
              Register for YADA 2026
            </a>
            <a href={whatsapp.href} target="_blank" rel="noopener noreferrer" className="btn btn-quiet text-slate-ink">
              Follow on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
