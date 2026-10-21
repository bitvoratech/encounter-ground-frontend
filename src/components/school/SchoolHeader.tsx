"use client";

import { IconArrowLeft, IconLayoutDashboard, IconLogout, IconMenu2, IconX } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount, useFullScreenMenu } from "@/components/layout/useFullScreenMenu";
import { school, schoolNav } from "@/content/school";
import { useEnrolments } from "@/lib/learning";
import { AccountMenu, accountLinks } from "./AccountMenu";
import { Avatar } from "./Avatar";

/** The school's logo (its wordmark, cut out of the ministry's artwork without the book). */
function Wordmark() {
  return (
    <Link href="/school" className="shrink-0" aria-label={`${school.name} home`}>
      <Image src="/brand/beth-el-wordmark.png" alt="" width={537} height={320} priority className="h-12 w-auto lg:h-14" />
    </Link>
  );
}

/**
 * Beth-El Institute's own header. Like other learning platforms, the student's way in sits at
 * the top right: "My dashboard" beside Enrol, then the avatar with the account menu. Once
 * someone has enrolled, Enrol drops away.
 */
export function SchoolHeader() {
  const pathname = usePathname();
  const { open, buttonRef, menuRef, openMenu, closeMenu } = useFullScreenMenu();
  const account = useAccount();
  const enrolments = useEnrolments();
  const enrolled = (enrolments?.length ?? 0) > 0;
  const signIn = `/login?next=${encodeURIComponent(pathname)}`;
  const isCurrent = (href: string) => (href === "/school" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));
  const onDashboard = pathname === "/dashboard";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-rule bg-chalk/95 backdrop-blur supports-[backdrop-filter]:bg-chalk/80">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-limestone focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <div className="wrap flex h-18 items-center justify-between gap-4 lg:h-20">
          <Wordmark />

          <nav aria-label="School" className="hidden flex-1 lg:block">
            <ul className="flex items-center gap-1 pl-6">
              {schoolNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isCurrent(item.href) ? "page" : undefined}
                    className="block rounded-full px-3.5 py-2 text-[0.95rem] font-medium text-slate transition-colors hover:text-slate-ink aria-[current=page]:bg-slate aria-[current=page]:text-chalk"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {account === undefined ? (
              // Session not checked yet: hold the space without guessing.
              <span aria-hidden="true" className="size-10 rounded-full bg-limestone" />
            ) : account === null ? (
              <>
                <Link href={signIn} className="hidden rounded-full px-3 py-2 text-[0.95rem] font-semibold text-slate-ink hover:text-amber sm:inline-block">
                  Sign in
                </Link>
                <Link href="/school/enrol" className="btn btn-fire min-h-11 px-5 py-2">
                  Enrol
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  aria-current={onDashboard ? "page" : undefined}
                  className={`${enrolled ? "btn btn-fire" : "btn btn-quiet text-slate-ink"} hidden min-h-11 px-5 py-2 lg:inline-flex`}
                >
                  My dashboard
                </Link>
                {enrolled ? (
                  // Phones: no room for the full button, so the dashboard keeps an icon of its own.
                  <Link
                    href="/dashboard"
                    aria-label="My dashboard"
                    aria-current={onDashboard ? "page" : undefined}
                    className="grid size-11 place-items-center rounded-full bg-flame text-slate-ink lg:hidden"
                  >
                    <IconLayoutDashboard aria-hidden="true" size={20} stroke={1.75} />
                  </Link>
                ) : (
                  <Link href="/school/classes" className="btn btn-fire min-h-11 px-5 py-2">
                    Enrol
                  </Link>
                )}
                <AccountMenu account={account} />
              </>
            )}
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

        <div className="flex-1 overflow-y-auto">
          <nav aria-label="School">
            <ul className="wrap pt-4">
              {[...schoolNav, { href: "/school/enrol", label: "How to enrol" }].map((item, i) => (
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

          {account && (
            <section aria-label="Your account" className="wrap py-6">
              <div className="flex items-center gap-3 rounded-2xl bg-limestone p-4">
                <Avatar name={account.name} src={account.avatarUrl} size={48} />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-ink">{account.name}</p>
                  <p className="truncate text-sm text-stone-muted">{account.email}</p>
                </div>
              </div>
              <ul className="mt-3 grid gap-1">
                {accountLinks.map(({ href, label, Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={pathname === href ? "page" : undefined}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-lg font-medium text-slate-ink hover:bg-limestone aria-[current=page]:bg-limestone"
                    >
                      <Icon aria-hidden="true" size={22} stroke={1.75} className="text-amber" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="wrap shrink-0 border-t border-rule py-5">
          <div className="flex gap-3">
            {account ? (
              <>
                {!enrolled && (
                  <Link href="/school/classes" className="btn btn-fire flex-1">
                    Enrol
                  </Link>
                )}
                <form action="/auth/signout" method="post" className="flex flex-1">
                  <button type="submit" className="btn btn-quiet flex-1 text-slate-ink">
                    <IconLogout aria-hidden="true" size={18} stroke={1.75} />
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/school/enrol" className="btn btn-fire flex-1">
                  Enrol
                </Link>
                <Link href={signIn} className="btn btn-quiet flex-1 text-slate-ink">
                  Sign in
                </Link>
              </>
            )}
          </div>
          <Link href="/" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-stone-muted hover:text-slate-ink">
            <IconArrowLeft aria-hidden="true" size={16} stroke={2} />A school of Encounter Ground
          </Link>
        </div>
      </div>
    </>
  );
}
