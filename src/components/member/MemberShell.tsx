"use client";

import {
  IconArrowUpRight,
  IconBooks,
  IconBuildingStore,
  IconChevronRight,
  IconLayoutDashboard,
  IconLogout,
  IconMenu2,
  IconSchool,
  IconSparkles,
  IconUserCircle,
  IconWorld,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFullScreenMenu, type Account } from "@/components/layout/useFullScreenMenu";
import { Avatar } from "@/components/school/Avatar";

type NavLink = { href: string; label: string; Icon: typeof IconSchool; external?: boolean };

/**
 * The member area's sidebar, built like the admin's: the member's own pages first, then the
 * places on the website they come from (marked with an arrow, as they leave the dashboard).
 */
const groups: { label: string | null; links: NavLink[] }[] = [
  { label: null, links: [{ href: "/dashboard", label: "Dashboard", Icon: IconLayoutDashboard }] },
  {
    label: "My learning",
    links: [
      { href: "/my-courses", label: "My courses", Icon: IconSchool },
      { href: "/my-books", label: "My books", Icon: IconBooks },
    ],
  },
  { label: "Account", links: [{ href: "/account", label: "My account", Icon: IconUserCircle }] },
  {
    label: "Explore",
    links: [
      { href: "/school/classes", label: "Beth-El classes", Icon: IconSchool, external: true },
      { href: "/books", label: "Bookstore", Icon: IconBuildingStore, external: true },
      { href: "/self-test", label: "Self-tests", Icon: IconSparkles, external: true },
    ],
  },
];

const isCurrent = (href: string, pathname: string) => pathname === href || pathname.startsWith(`${href}/`);

function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-3" aria-label="Encounter Ground: my dashboard">
      <Image src="/brand/lockup-light.png" alt="" width={467} height={480} className="h-11 w-auto [@media(max-height:41rem)]:h-9" />
      <span className="rounded-full bg-flame/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-flame">Member</span>
    </Link>
  );
}

function Nav({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="My account" className="grid gap-4 [@media(max-height:41rem)]:gap-2.5 [@media(min-height:50rem)]:gap-6">
      {groups.map((group) => (
        <div key={group.label ?? "main"}>
          {group.label && (
            <p className="mb-1.5 px-3 [@media(max-height:41rem)]:mb-0.5 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-chalk/40">
              {group.label}
            </p>
          )}
          <ul className="grid gap-0.5">
            {group.links.map(({ href, label, Icon, external }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={!external && isCurrent(href, pathname) ? "page" : undefined}
                  className="group relative flex items-center gap-3 rounded-lg px-3 py-2 [@media(max-height:41rem)]:py-1.5 text-[0.9375rem] font-medium text-chalk/70 transition-colors hover:bg-chalk/5 hover:text-chalk aria-[current=page]:bg-chalk/10 aria-[current=page]:text-chalk"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-2 -left-4 w-1 rounded-r-full bg-flame opacity-0 transition-opacity group-aria-[current=page]:opacity-100"
                  />
                  <Icon aria-hidden="true" size={19} stroke={1.75} className="group-aria-[current=page]:text-flame" />
                  <span className="flex-1">{label}</span>
                  {external && (
                    <IconArrowUpRight aria-hidden="true" size={16} stroke={1.75} className="text-chalk/35 group-hover:text-chalk/70" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function AccountBox({ account }: { account: Account }) {
  return (
    <div className="flex items-center gap-1 rounded-xl bg-chalk/5 p-1.5">
      <Link href="/account" className="flex min-w-0 flex-1 items-center gap-3 rounded-lg p-1.5 hover:bg-chalk/5">
        <Avatar name={account.name} src={account.avatarUrl} size={36} />
        <div className="min-w-0">
          <p className="truncate text-[0.9375rem] font-semibold text-chalk">{account.name}</p>
          <p className="truncate text-xs text-chalk/60">{account.email}</p>
        </div>
      </Link>
      <form action="/auth/signout" method="post">
        <button
          type="submit"
          aria-label="Sign out"
          title="Sign out"
          className="grid size-10 place-items-center rounded-lg text-chalk/60 hover:bg-chalk/10 hover:text-chalk"
        >
          <IconLogout aria-hidden="true" size={19} stroke={1.75} />
        </button>
      </form>
    </div>
  );
}

/** The current page's place in the member area, for the desktop top bar. */
function where(pathname: string) {
  for (const g of groups) for (const l of g.links) if (!l.external && isCurrent(l.href, pathname)) return { group: g.label, link: l };
  return null;
}

function TopBar({ account, pathname }: { account: Account; pathname: string }) {
  const here = where(pathname);
  return (
    <div className="sticky top-0 z-30 hidden border-b border-rule/80 bg-limestone/85 backdrop-blur-md lg:block">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-8 xl:px-10">
        <p className="flex items-center gap-2 text-sm text-stone-muted">
          <Link href="/dashboard" className="hover:text-slate-ink">
            My dashboard
          </Link>
          {here?.group && (
            <>
              <IconChevronRight aria-hidden="true" size={14} stroke={2} />
              <span>{here.group}</span>
            </>
          )}
          {here && here.link.href !== "/dashboard" && (
            <>
              <IconChevronRight aria-hidden="true" size={14} stroke={2} />
              <span aria-current="page" className="font-semibold text-slate-ink">
                {here.link.label}
              </span>
            </>
          )}
        </p>
        <div className="flex items-center gap-3">
          <Link href="/" className="btn btn-quiet px-3.5 py-1.5 text-sm">
            <IconWorld aria-hidden="true" size={17} stroke={1.75} />
            Visit the website
          </Link>
          <span className="h-6 w-px bg-rule" aria-hidden="true" />
          <Link href="/account" className="flex items-center gap-2.5 rounded-full pr-1 hover:text-amber">
            <Avatar name={account.name} src={account.avatarUrl} size={32} />
            <span className="text-sm font-semibold text-slate-ink">{account.name.split(" ")[0]}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * The member area's frame, made to match the admin dashboard: a dark sidebar on wide screens,
 * and on phones a dark top bar with a full-screen menu.
 */
export function MemberShell({ account, children }: { account: Account; children: React.ReactNode }) {
  const pathname = usePathname();
  const { open, buttonRef, menuRef, openMenu, closeMenu } = useFullScreenMenu();

  return (
    <div className="admin flex-1 bg-limestone lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-limestone focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      <aside className="sticky top-0 hidden h-dvh flex-col gap-5 overflow-hidden bg-slate-deep p-4 pt-5 lg:flex [@media(max-height:41rem)]:gap-3 [@media(max-height:41rem)]:py-3 [@media(min-height:50rem)]:gap-7 [@media(min-height:50rem)]:pt-6">
        <div className="px-3">
          <Logo />
        </div>
        <div className="flex-1">
          <Nav pathname={pathname} />
        </div>
        <AccountBox account={account} />
      </aside>

      <header className="sticky top-0 z-40 bg-slate-deep lg:hidden">
        <div className="wrap flex h-18 items-center justify-between gap-4">
          <Logo />
          <div className="flex items-center gap-2">
            <Link href="/account" aria-label={`My account: ${account.name}`} className="grid rounded-full">
              <Avatar name={account.name} src={account.avatarUrl} size={36} />
            </Link>
            <button
              ref={buttonRef}
              type="button"
              aria-expanded={open}
              aria-controls="member-menu"
              aria-label="Open menu"
              onClick={openMenu}
              className="grid size-11 place-items-center rounded-full border border-chalk/25 text-chalk"
            >
              <IconMenu2 aria-hidden="true" size={20} stroke={2} />
            </button>
          </div>
        </div>
        {/* Phones: the member's own pages stay one tap away, without opening the menu. */}
        <nav aria-label="My pages" className="border-t border-chalk/10">
          <ul className="wrap flex justify-between gap-1 py-2 sm:justify-start">
            {[...groups[0]!.links, ...groups[1]!.links, ...groups[2]!.links].map(({ href, label, Icon }) => (
              <li key={href} className="shrink-0">
                <Link
                  href={href}
                  aria-current={isCurrent(href, pathname) ? "page" : undefined}
                  className="flex min-h-10 items-center gap-2 whitespace-nowrap rounded-lg px-1.5 py-1.5 text-[0.8125rem] font-semibold max-[359px]:px-1 max-[359px]:text-xs min-[400px]:text-sm text-chalk/70 aria-[current=page]:bg-flame aria-[current=page]:text-slate-ink min-[400px]:px-2.5 sm:px-3"
                >
                  <Icon aria-hidden="true" size={17} stroke={1.75} className="hidden sm:block" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div
        ref={menuRef}
        id="member-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="fixed inset-0 z-50 flex flex-col bg-slate-deep lg:hidden"
      >
        <div className="wrap flex h-18 shrink-0 items-center justify-between gap-4">
          <Logo />
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close menu"
            className="grid size-11 place-items-center rounded-full border border-chalk/25 text-chalk"
          >
            <IconX aria-hidden="true" size={20} stroke={2} />
          </button>
        </div>
        <div className="wrap flex flex-1 flex-col gap-8 overflow-y-auto pb-6 pt-4 text-lg">
          <div className="flex-1">
            <Nav pathname={pathname} />
          </div>
          <Link href="/" className="flex items-center gap-3 px-3 text-[0.9375rem] font-medium text-chalk/70 hover:text-chalk">
            <IconWorld aria-hidden="true" size={19} stroke={1.75} />
            Visit the website
          </Link>
          <AccountBox account={account} />
        </div>
      </div>

      <div className="min-w-0">
        <TopBar account={account} pathname={pathname} />
        <main id="main" className="px-5 pb-20 pt-7 md:px-8 lg:pt-10 xl:px-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
