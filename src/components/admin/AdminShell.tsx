"use client";

import {
  IconArrowUpRight,
  IconBook2,
  IconChevronRight,
  IconClipboardCheck,
  IconFileText,
  IconLayoutDashboard,
  IconLogout,
  IconMail,
  IconMenu2,
  IconSchool,
  IconUsers,
  IconWorld,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFullScreenMenu } from "@/components/layout/useFullScreenMenu";
import { Avatar } from "@/components/school/Avatar";
import type { Profile } from "@/types/admin";

type Counts = { checkpoints: number; messages: number };

type NavLink = {
  href: string;
  label: string;
  Icon: typeof IconMail;
  count: keyof Counts | null;
  adminOnly: boolean;
};

/** The sidebar, in groups so the team can find a page by what it's for. */
const groups: { label: string | null; links: NavLink[] }[] = [
  { label: null, links: [{ href: "/admin", label: "Overview", Icon: IconLayoutDashboard, count: null, adminOnly: false }] },
  {
    label: "Inbox",
    links: [
      { href: "/admin/checkpoints", label: "Checkpoints", Icon: IconClipboardCheck, count: "checkpoints", adminOnly: false },
      { href: "/admin/messages", label: "Messages", Icon: IconMail, count: "messages", adminOnly: false },
    ],
  },
  {
    label: "Content",
    links: [
      { href: "/admin/classes", label: "Classes", Icon: IconSchool, count: null, adminOnly: false },
      { href: "/admin/books", label: "Books", Icon: IconBook2, count: null, adminOnly: false },
      { href: "/admin/content", label: "Site content", Icon: IconFileText, count: null, adminOnly: false },
    ],
  },
  { label: "People", links: [{ href: "/admin/members", label: "Members", Icon: IconUsers, count: null, adminOnly: true }] },
];

const isCurrent = (href: string, pathname: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

const roleLabel = { admin: "Admin", editor: "Editor", member: "Member" };

function Logo() {
  return (
    <Link href="/admin" className="flex items-center gap-3" aria-label="Encounter Ground admin">
      <Image src="/brand/lockup-light.png" alt="" width={467} height={480} className="h-11 w-auto" />
      <span className="rounded-full bg-flame/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-flame">Admin</span>
    </Link>
  );
}

function Nav({ profile, counts, pathname }: { profile: Profile; counts: Counts; pathname: string }) {
  return (
    <nav aria-label="Admin" className="grid gap-6">
      {groups.map((group) => {
        const links = group.links.filter((l) => !l.adminOnly || profile.role === "admin");
        if (!links.length) return null;
        return (
          <div key={group.label ?? "main"}>
            {group.label && (
              <p className="mb-1.5 px-3 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-chalk/40">{group.label}</p>
            )}
            <ul className="grid gap-0.5">
              {links.map(({ href, label, Icon, count }) => {
                const n = count ? counts[count] : 0;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={isCurrent(href, pathname) ? "page" : undefined}
                      className="group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[0.9375rem] font-medium text-chalk/70 transition-colors hover:bg-chalk/5 hover:text-chalk aria-[current=page]:bg-chalk/10 aria-[current=page]:text-chalk"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-2 -left-4 w-1 rounded-r-full bg-flame opacity-0 transition-opacity group-aria-[current=page]:opacity-100"
                      />
                      <Icon aria-hidden="true" size={19} stroke={1.75} className="group-aria-[current=page]:text-flame" />
                      <span className="flex-1">{label}</span>
                      {n > 0 && (
                        <span className="min-w-6 rounded-full bg-flame px-2 py-0.5 text-center text-xs font-bold text-slate-ink tabular-nums">
                          {n}
                          <span className="sr-only"> waiting</span>
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

function Account({ profile }: { profile: Profile }) {
  const name = profile.full_name || profile.email || "Staff";
  return (
    <div className="grid gap-0.5 rounded-xl bg-chalk/5 p-2">
      <div className="flex items-center gap-3 px-2 pb-2 pt-1">
        <Avatar name={name} src={profile.avatar_url} size={36} />
        <div className="min-w-0">
          <p className="truncate text-[0.9375rem] font-semibold text-chalk">{name}</p>
          <p className="text-xs text-chalk/60">{roleLabel[profile.role]}</p>
        </div>
      </div>
      <Link href="/" className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-chalk/70 hover:bg-chalk/5 hover:text-chalk">
        <IconArrowUpRight aria-hidden="true" size={18} stroke={1.75} />
        View the website
      </Link>
      <form action="/auth/signout" method="post">
        <button type="submit" className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-chalk/70 hover:bg-chalk/5 hover:text-chalk">
          <IconLogout aria-hidden="true" size={18} stroke={1.75} />
          Sign out
        </button>
      </form>
    </div>
  );
}

/** The current page's place in the dashboard, for the desktop top bar. */
function where(pathname: string) {
  for (const g of groups) for (const l of g.links) if (isCurrent(l.href, pathname)) return { group: g.label, link: l };
  return null;
}

function TopBar({ profile, pathname }: { profile: Profile; pathname: string }) {
  const here = where(pathname);
  const name = profile.full_name || profile.email || "Staff";
  return (
    <div className="sticky top-0 z-30 hidden border-b border-rule/80 bg-limestone/85 backdrop-blur-md lg:block">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-8 xl:px-10">
        <p className="flex items-center gap-2 text-sm text-stone-muted">
          <span>Admin</span>
          {here?.group && (
            <>
              <IconChevronRight aria-hidden="true" size={14} stroke={2} />
              <span>{here.group}</span>
            </>
          )}
          {here && here.link.href !== "/admin" && (
            <>
              <IconChevronRight aria-hidden="true" size={14} stroke={2} />
              <Link href={here.link.href} className="font-semibold text-slate-ink hover:text-amber">
                {here.link.label}
              </Link>
            </>
          )}
        </p>
        <div className="flex items-center gap-3">
          <Link href="/" className="btn btn-quiet px-3.5 py-1.5 text-sm">
            <IconWorld aria-hidden="true" size={17} stroke={1.75} />
            View website
          </Link>
          <span className="h-6 w-px bg-rule" aria-hidden="true" />
          <span className="flex items-center gap-2.5">
            <Avatar name={name} src={profile.avatar_url} size={32} />
            <span className="text-sm font-semibold text-slate-ink">{name.split(" ")[0]}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * The admin dashboard's frame, apart from the public site: a dark sidebar on wide screens
 * (the counts show what is waiting), a top bar with a full-screen menu on phones.
 */
export function AdminShell({ profile, counts, children }: { profile: Profile; counts: Counts; children: React.ReactNode }) {
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

      <aside className="sticky top-0 hidden h-dvh flex-col gap-7 overflow-y-auto bg-slate-deep p-4 pt-6 lg:flex">
        <div className="px-3">
          <Logo />
        </div>
        <div className="flex-1">
          <Nav profile={profile} counts={counts} pathname={pathname} />
        </div>
        <Account profile={profile} />
      </aside>

      <header className="sticky top-0 z-40 bg-slate-deep lg:hidden">
        <div className="wrap flex h-18 items-center justify-between gap-4">
          <Logo />
          <button
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls="admin-menu"
            aria-label="Open menu"
            onClick={openMenu}
            className="relative grid size-11 place-items-center rounded-full border border-chalk/25 text-chalk"
          >
            <IconMenu2 aria-hidden="true" size={20} stroke={2} />
            {counts.checkpoints + counts.messages > 0 && (
              <span aria-hidden="true" className="absolute right-1.5 top-1.5 size-2.5 rounded-full bg-flame" />
            )}
          </button>
        </div>
      </header>

      <div
        ref={menuRef}
        id="admin-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Admin menu"
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
            <Nav profile={profile} counts={counts} pathname={pathname} />
          </div>
          <Account profile={profile} />
        </div>
      </div>

      <div className="min-w-0">
        <TopBar profile={profile} pathname={pathname} />
        <main id="main" className="px-5 pb-20 pt-8 md:px-8 lg:pt-10 xl:px-10">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
