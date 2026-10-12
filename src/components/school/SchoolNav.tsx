"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { school, schoolNav } from "@/content/school";

/** The school's own bar under the site header: its three pages and the way into the dashboard. */
export function SchoolNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="School" className="border-b border-rule bg-chalk">
      <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3">
        <p className="font-display text-lg text-slate-ink">{school.shortName}</p>
        <ul className="-mx-3 flex flex-wrap items-center gap-1">
          {schoolNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className="block rounded-full px-3 py-1.5 text-[0.95rem] font-medium text-slate hover:text-slate-ink aria-[current=page]:bg-slate aria-[current=page]:text-chalk"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/dashboard" className="link ml-2 block px-1 py-1.5 text-[0.95rem] font-semibold text-slate-ink">
              My dashboard
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
