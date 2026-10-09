"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { nav } from "./nav";

export function SiteHeader() {
  const pathname = usePathname();
  // The menu belongs to the page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const [signedIn, setSignedIn] = useState(false);

  // Fires once with the current session, then on every sign-in or sign-out.
  useEffect(() => {
    const { data } = createClient().auth.onAuthStateChange((_event, session) => setSignedIn(!!session));
    return () => data.subscription.unsubscribe();
  }, []);

  const isActive = (href: string) =>
    href === "/events"
      ? pathname === "/events"
      : pathname === href || pathname.startsWith(`${href}/`);

  const account = signedIn
    ? { href: "/dashboard", label: "My account" }
    : { href: "/login", label: "Sign in" };

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-limestone/95 backdrop-blur supports-[backdrop-filter]:bg-limestone/80">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-chalk focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <div className="wrap flex h-22 items-center justify-between gap-4">
        <Link href="/" className="shrink-0" aria-label="Encounter Ground home">
          <Image
            src="/brand/lockup.png"
            alt="Encounter Ground"
            width={467}
            height={480}
            priority
            className="h-[4.5rem] w-auto"
          />
        </Link>

        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-0.5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="rounded-full px-3 py-2 text-[0.95rem] font-medium text-slate transition-colors hover:text-slate-ink aria-[current=page]:bg-slate aria-[current=page]:text-chalk"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={account.href}
            aria-current={isActive(account.href) ? "page" : undefined}
            className="hidden rounded-full px-3 py-2 text-[0.95rem] font-semibold text-slate-ink hover:text-amber aria-[current=page]:text-amber xl:inline-block"
          >
            {account.label}
          </Link>
          <Link href="/give" className="btn btn-fire min-h-11 px-5 py-2">
            Give
          </Link>
          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-slate/30 px-4 text-sm font-semibold text-slate-ink xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpenOn(open ? null : pathname)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Main"
        hidden={!open}
        className="max-h-[calc(100dvh-5.5rem)] overflow-y-auto border-t border-rule bg-limestone xl:hidden"
      >
        <ul className="wrap grid py-3 sm:grid-cols-2 sm:gap-x-8">
          <li>
            <Link href="/" className="block py-3 font-display text-2xl text-slate-ink">
              Home
            </Link>
          </li>
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="block py-3 font-display text-2xl text-slate-ink aria-[current=page]:text-amber"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="wrap flex flex-wrap gap-3 border-t border-rule py-5">
          <Link href={account.href} className="btn btn-quiet text-slate-ink">
            {account.label}
          </Link>
          {!signedIn && (
            <Link href="/register" className="btn btn-quiet text-slate-ink">
              Create an account
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
