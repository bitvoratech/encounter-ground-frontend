"use client";

import { IconArrowLeft, IconMenu2, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFullScreenMenu, useSignedIn } from "@/components/layout/useFullScreenMenu";
import { school, schoolNav } from "@/content/school";

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link href="/school" className={`leading-tight ${className}`} aria-label={`${school.name} home`}>
      <span className="block font-display text-[1.375rem] text-slate-ink lg:text-2xl">{school.shortName}</span>
      <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-amber lg:text-xs">
        of the Supernatural
      </span>
    </Link>
  );
}

/** Beth-El Institute's own header: the school is a separate site from the Encounter Ground pages. */
export function SchoolHeader() {
  const pathname = usePathname();
  const { open, buttonRef, menuRef, openMenu, closeMenu } = useFullScreenMenu();
  const signedIn = useSignedIn();
  const signIn = `/login?next=${encodeURIComponent(pathname)}`;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-rule bg-chalk/95 backdrop-blur supports-[backdrop-filter]:bg-chalk/80">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-limestone focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <div className="wrap flex h-18 items-center justify-between gap-6 lg:h-20">
          <Wordmark />

          <nav aria-label="School" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {schoolNav.map((item) => (
                <li key={item.href}>
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

          <div className="flex items-center gap-2">
            {!signedIn && (
              <Link
                href={signIn}
                className="hidden rounded-full px-3 py-2 text-[0.95rem] font-semibold text-slate-ink hover:text-amber lg:inline-block"
              >
                Sign in
              </Link>
            )}
            <Link href="/school/enrol" className="btn btn-fire min-h-11 px-5 py-2">
              Enrol
            </Link>
            <button
              ref={buttonRef}
              type="button"
              aria-expanded={open}
              aria-controls="school-menu"
              aria-label="Open menu"
              onClick={openMenu}
              className="grid size-11 place-items-center rounded-full border border-slate/30 text-slate-ink lg:hidden"
            >
              <IconMenu2 aria-hidden="true" size={20} stroke={2} />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu, outside the header so the header's blur can't contain it */}
      <div
        ref={menuRef}
        id="school-menu"
        role="dialog"
        aria-modal="true"
        aria-label="School menu"
        hidden={!open}
        className="fixed inset-0 z-50 flex flex-col bg-chalk text-slate-ink lg:hidden"
      >
        <div className="wrap flex h-18 shrink-0 items-center justify-between gap-4 border-b border-rule">
          <Wordmark />
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close menu"
            className="grid size-11 place-items-center rounded-full border border-slate/30 text-slate-ink"
          >
            <IconX aria-hidden="true" size={20} stroke={2} />
          </button>
        </div>

        <nav aria-label="School" className="flex-1 overflow-y-auto">
          <ul className="wrap py-6">
            {schoolNav.map((item, i) => (
              <li key={item.href} className="menu-in border-b border-rule" style={{ "--i": i } as React.CSSProperties}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="flex items-baseline gap-4 py-4 font-display text-[clamp(2rem,1.4rem+3vw,2.75rem)] leading-tight transition-colors hover:text-amber aria-[current=page]:text-amber"
                >
                  <span aria-hidden="true" className="font-sans text-sm font-semibold text-amber">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="wrap shrink-0 border-t border-rule py-5">
          <div className="flex gap-3">
            <Link href="/school/enrol" className="btn btn-fire flex-1">
              Enrol
            </Link>
            {signedIn ? (
              <form action="/auth/signout" method="post" className="flex flex-1">
                <button type="submit" className="btn btn-quiet flex-1 text-slate-ink">
                  Sign out
                </button>
              </form>
            ) : (
              <Link href={signIn} className="btn btn-quiet flex-1 text-slate-ink">
                Sign in
              </Link>
            )}
          </div>
          <Link
            href="/"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-stone-muted hover:text-slate-ink"
          >
            <IconArrowLeft aria-hidden="true" size={16} stroke={2} />A school of Encounter Ground
          </Link>
        </div>
      </div>
    </>
  );
}
