"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { accountLinks } from "./AccountMenu";

/** The member area's own navigation: a sidebar on wide screens, a row of tabs on phones. */
export function PortalNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="My account" className="min-w-0 lg:sticky lg:top-28 lg:self-start">
      <ul className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:grid lg:gap-1 lg:overflow-visible lg:px-0">
        {accountLinks.map(({ href, label, Icon }) => (
          <li key={href} className="shrink-0">
            <Link
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              className="flex items-center gap-2.5 rounded-full border border-rule bg-chalk px-4 py-2.5 font-medium text-slate transition-colors hover:text-slate-ink aria-[current=page]:border-slate aria-[current=page]:bg-slate aria-[current=page]:text-chalk lg:rounded-xl lg:border-transparent lg:bg-transparent lg:px-3 lg:aria-[current=page]:bg-slate"
            >
              <Icon aria-hidden="true" size={20} stroke={1.75} />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
