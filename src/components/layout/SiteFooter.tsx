import {
  IconArrowUp,
  IconBrandWhatsapp,
  IconHeartHandshake,
  IconMail,
  IconPhone,
  IconUserCircle,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { contact, home } from "@/content/ministry";
import { isGroup, nav, type NavLink } from "./nav";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

// Columns come from the header nav: plain links under "Explore", each dropdown as its own column.
const explore = nav.filter((item): item is NavLink => !isGroup(item));
const groups = nav.filter(isGroup);

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-flame">{title}</h2>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  );
}

const linkClass = "inline-flex items-center gap-2.5 text-chalk/80 transition-colors hover:text-flame";

export function SiteFooter() {
  const whatsapp = contact.socials.find((s) => s.name === "WhatsApp channel")!;

  return (
    <footer className="mt-auto bg-slate-deep text-chalk/85">
      {/* Invitation band */}
      <div className="border-b border-chalk/10">
        <div className="wrap flex flex-col gap-8 py-14 lg:flex-row lg:items-center lg:justify-between lg:py-16">
          <div>
            <p className="font-display text-[clamp(2.25rem,1.5rem+3vw,3.75rem)] leading-none text-chalk">
              Dominion in <span className="text-flame">Intimacy</span>
            </p>
            <p className="mt-4 max-w-md text-chalk/70">
              Prayer, worship and the Word, every week. Come as you are.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/give" className="btn btn-fire">
              <IconHeartHandshake aria-hidden="true" size={20} stroke={1.75} />
              Give
            </Link>
            <a href={home.joinUsUrl} {...external} className="btn btn-quiet text-chalk">
              Join us
            </a>
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="wrap grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.85fr_0.85fr_1.5fr]">
        <div className="max-w-sm sm:col-span-2 lg:col-span-1">
          <Image
            src="/brand/lockup-light.png"
            alt="Encounter Ground"
            width={467}
            height={480}
            className="h-20 w-auto"
          />
          <p className="mt-5 text-[0.95rem] leading-relaxed text-chalk/70">
            Awakening hearts and equipping lives to seek God, find Him, and live
            the scroll He has written for them.
          </p>
          <ul className="mt-6 flex gap-2.5" aria-label="Encounter Ground on social media">
            {contact.socials.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  {...external}
                  aria-label={`${s.name} (${s.handle})`}
                  title={s.name}
                  className="grid size-11 place-items-center rounded-full border border-chalk/20 text-chalk transition-colors hover:border-flame hover:bg-flame hover:text-slate-ink"
                >
                  <SocialIcon name={s.name} size={20} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer" className="grid gap-12 sm:col-span-2 sm:grid-cols-2 lg:col-span-2">
          <Column title="Explore">
            {explore.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </Column>
          {groups.map((group) => (
            <Column key={group.label} title={group.label}>
              {group.children.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </Column>
          ))}
        </nav>

        <Column title="Reach us">
          <li>
            <a href={`mailto:${contact.email}`} className={`${linkClass} [overflow-wrap:anywhere]`}>
              <IconMail aria-hidden="true" size={18} stroke={1.75} className="shrink-0 text-flame" />
              {contact.email}
            </a>
          </li>
          <li>
            <a href={contact.phoneHref} className={linkClass}>
              <IconPhone aria-hidden="true" size={18} stroke={1.75} className="shrink-0 text-flame" />
              {contact.phoneDisplay}
            </a>
          </li>
          <li>
            <a href={whatsapp.href} {...external} className={linkClass}>
              <IconBrandWhatsapp aria-hidden="true" size={18} stroke={1.75} className="shrink-0 text-flame" />
              WhatsApp channel
            </a>
          </li>
          <li>
            <Link href="/login" className={linkClass}>
              <IconUserCircle aria-hidden="true" size={18} stroke={1.75} className="shrink-0 text-flame" />
              Sign in or create an account
            </Link>
          </li>
        </Column>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-chalk/10">
        <div className="wrap flex flex-col gap-4 py-6 text-sm text-chalk/55 lg:flex-row lg:items-center lg:justify-between">
          <p>© {new Date().getFullYear()} Encounter Ground. All rights reserved.</p>
          <p className="font-display text-base text-chalk/70">
            Hunger, Intimacy, Partnership, Revival, Dominion.
          </p>
          <a href="#" className="inline-flex items-center gap-1.5 self-start font-semibold text-chalk/80 hover:text-flame lg:self-auto">
            Back to top
            <IconArrowUp aria-hidden="true" size={16} stroke={2} />
          </a>
        </div>
      </div>
    </footer>
  );
}
