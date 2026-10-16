"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { school, schoolNav } from "@/content/school";

/** Beth-El Institute's own header: the school is a separate site from the Encounter Ground pages. */
export function SchoolHeader() {
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState(false);

  // Fires once with the current session, then on every sign-in or sign-out.
  useEffect(() => {
    const { data } = createClient().auth.onAuthStateChange((_event, session) => setSignedIn(!!session));
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-chalk/95 backdrop-blur supports-[backdrop-filter]:bg-chalk/80">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-limestone focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4">
        <Link href="/school" className="leading-tight" aria-label={`${school.name} home`}>
          <span className="block font-display text-2xl text-slate-ink">{school.shortName}</span>
          <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-amber">of the Supernatural</span>
        </Link>

        <div className="flex items-center gap-2 lg:order-last">
          {!signedIn && (
            <Link
              href={`/login?next=${encodeURIComponent(pathname)}`}
              className="rounded-full px-3 py-2 text-[0.95rem] font-semibold text-slate-ink hover:text-amber"
            >
              Sign in
            </Link>
          )}
          <Link href="/school/enrol" className="btn btn-fire min-h-11 px-5 py-2">
            Enrol
          </Link>
        </div>

        <nav aria-label="School" className="-mx-3 w-full overflow-x-auto lg:mx-0 lg:w-auto">
          <ul className="flex items-center gap-1 px-3 lg:px-0">
            {schoolNav.map((item) => (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="block rounded-full px-3.5 py-2 text-[0.95rem] font-medium text-slate transition-colors hover:text-slate-ink aria-[current=page]:bg-slate aria-[current=page]:text-chalk"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
