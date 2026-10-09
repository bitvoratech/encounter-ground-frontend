import type { Metadata } from "next";
import Image from "next/image";
import { contact, giving } from "@/content/ministry";
import heroImage from "../../../../public/images/home/hero-presence.webp";

export const metadata: Metadata = {
  title: "Give",
  description: "Partner with Encounter Ground. Your giving keeps the prayer streams, YADA and discipleship going.",
};

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export default function GivePage() {
  const whatsapp = contact.socials.find((s) => s.name === "WhatsApp channel")!;
  const hasAccounts = giving.bankAccounts.length > 0;

  return (
    <>
      <header className="relative isolate overflow-hidden bg-slate-deep text-chalk">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="-z-10 object-cover object-[70%_center]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-deep/85 via-slate-deep/50 to-transparent"
        />
        <div className="wrap pb-20 pt-16 md:pb-28 md:pt-24">
          <p className="font-semibold text-flame">Give</p>
          <h1 className="mt-2 max-w-3xl text-[length:var(--text-h1)]">Partner with what God is doing</h1>
          <p className="mt-5 max-w-[34rem] text-lede leading-relaxed text-chalk/90">
            Every gift helps us raise a praying, prophetic community and carry the
            knowledge of God’s glory further.
          </p>
          <blockquote className="mt-8 max-w-[34rem] border-l-4 border-flame pl-5 text-chalk/85">
            <p className="font-display text-xl leading-snug">
              “Each one must give as he has decided in his heart, not reluctantly or
              under compulsion, for God loves a cheerful giver.”
            </p>
            <footer className="mt-2 text-sm text-chalk/70">2 Corinthians 9:7</footer>
          </blockquote>
        </div>
      </header>

      <section aria-labelledby="ways-heading">
        <div className="wrap py-14 md:py-20">
          <h2 id="ways-heading" className="text-[length:var(--text-h2)] text-slate-ink">
            Ways to give
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <article className="rounded-3xl border border-rule bg-chalk p-7">
              <h3 className="text-h3 text-slate-ink">Bank transfer</h3>
              {hasAccounts ? (
                <dl className="mt-5 grid gap-5">
                  {giving.bankAccounts.map((a) => (
                    <div key={a.accountNumber} className="rounded-2xl bg-limestone p-5">
                      <dt className="text-sm text-stone-muted">
                        {a.bank} · {a.currency}
                      </dt>
                      <dd className="mt-1 font-display text-3xl tracking-wide text-slate-ink">
                        {a.accountNumber}
                      </dd>
                      <dd className="mt-1 text-slate-ink/90">{a.accountName}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <>
                  <p className="mt-3 text-stone-muted">
                    Ask us for the ministry’s account details and we’ll send them
                    straight to you.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href={`mailto:${contact.email}?subject=${encodeURIComponent("Giving: account details")}`}
                      className="btn btn-fire"
                    >
                      Email us
                    </a>
                    <a href={contact.phoneHref} className="btn btn-quiet text-slate-ink">
                      Call {contact.phoneDisplay}
                    </a>
                  </div>
                </>
              )}
            </article>

            <article className="rounded-3xl border border-rule bg-chalk p-7">
              <h3 className="text-h3 text-slate-ink">Give online</h3>
              {/* Replaced by the Paystack giving form when payments ship. */}
              <p className="mt-3 text-stone-muted">
                Card and bank payments in naira, right here on the site, are coming
                soon. Follow the WhatsApp channel to hear when it opens.
              </p>
              <a href={whatsapp.href} {...external} className="btn btn-quiet mt-6 text-slate-ink">
                Follow on WhatsApp
              </a>
            </article>
          </div>
        </div>
      </section>

      <section aria-labelledby="uses-heading" className="border-t border-rule bg-chalk">
        <div className="wrap py-14 md:py-20">
          <h2 id="uses-heading" className="text-[length:var(--text-h2)] text-slate-ink">
            What your giving supports
          </h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {giving.uses.map((u) => (
              <li key={u.title} className="rounded-3xl border border-rule bg-limestone p-6">
                <h3 className="text-h3 text-slate-ink">{u.title}</h3>
                <p className="mt-3 text-stone-muted">{u.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
