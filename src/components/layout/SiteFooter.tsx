import Image from "next/image";
import Link from "next/link";
import { contact } from "@/content/ministry";
import { navLinks } from "./nav";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-slate-deep text-chalk/85">
      <div className="wrap grid gap-12 py-16 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="max-w-xs">
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
        </div>

        <nav aria-label="Footer">
          <h2 className="font-display text-xl text-chalk">Explore</h2>
          <ul className="mt-4 space-y-2.5">
            {[...navLinks, { href: "/give", label: "Give" }, { href: "/login", label: "Sign in" }].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-flame">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-xl text-chalk">Reach us</h2>
          <ul className="mt-4 space-y-2.5">
            <li>
              <a href={`mailto:${contact.email}`} className="hover:text-flame">
                {contact.email}
              </a>
            </li>
            <li>
              <a href={contact.phoneHref} className="hover:text-flame">
                {contact.phoneDisplay}
              </a>
            </li>
            {contact.socials.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-flame">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-chalk/10">
        <p className="wrap py-6 text-sm text-chalk/55">
          © {new Date().getFullYear()} Encounter Ground. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
