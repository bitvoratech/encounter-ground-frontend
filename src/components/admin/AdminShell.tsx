"use client";

import {
  IconArrowUpRight,
  IconClipboardCheck,
  IconLayoutDashboard,
  IconLogout,
  IconMail,
  IconMenu2,
  IconSchool,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFullScreenMenu } from "@/components/layout/useFullScreenMenu";
import { Avatar } from "@/components/school/Avatar";
import type { Profile } from "@/types/admin";

type Counts = { checkpoints: number; messages: number };

const links = [
  { href: "/admin", label: "Overview", Icon: IconLayoutDashboard, count: null, adminOnly: false },
  { href: "/admin/checkpoints", label: "Checkpoints", Icon: IconClipboardCheck, count: "checkpoints", adminOnly: false },
  { href: "/admin/messages", label: "Messages", Icon: IconMail, count: "messages", adminOnly: false },
  { href: "/admin/members", label: "Members", Icon: IconUsers, count: null, adminOnly: true },
] as const;

const roleLabel = { admin: "Admin", editor: "Editor", member: "Member" };

function Logo() {
  return (
    <Link href="/admin" className="flex items-center gap-3" aria-label="Encounter Ground admin">
      <Image src="/brand/lockup-light.png" alt="" width={467} height={480} className="h-12 w-auto" />
      <span className="rounded-full bg-flame/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-flame">Admin</span>
    </Link>
  );
}

function Nav({ profile, counts, pathname }: { profile: Profile; counts: Counts; pathname: string }) {
  const isCurrent = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));
  return (
    <nav aria-label="Admin">
      <ul className="grid gap-1">
        {links
          .filter((l) => !l.adminOnly || profile.role === "admin")
          .map(({ href, label, Icon, count }) => {
            const n = count ? counts[count] : 0;
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isCurrent(href) ? "page" : undefined}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-chalk/75 transition-colors hover:bg-chalk/5 hover:text-chalk aria-[current=page]:bg-chalk/10 aria-[current=page]:text-chalk"
                >
                  <Icon aria-hidden="true" size={20} stroke={1.75} />
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
    </nav>
  );
}

function Account({ profile }: { profile: Profile }) {
  const name = profile.full_name || profile.email || "Staff";
  return (
    <div className="grid gap-1 border-t border-chalk/10 pt-4">
      <div className="flex items-center gap-3 px-3 pb-2">
        <Avatar name={name} src={profile.avatar_url} size={40} />
        <div className="min-w-0">
          <p className="truncate font-semibold text-chalk">{name}</p>
          <p className="text-sm text-chalk/60">{roleLabel[profile.role]}</p>
        </div>
      </div>
      <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-chalk/75 hover:bg-chalk/5 hover:text-chalk">
        <IconArrowUpRight aria-hidden="true" size={18} stroke={1.75} />
        View the website
      </Link>
      <Link href="/dashboard" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-chalk/75 hover:bg-chalk/5 hover:text-chalk">
        <IconSchool aria-hidden="true" size={18} stroke={1.75} />
        My student dashboard
      </Link>
      <form action="/auth/signout" method="post">
        <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-chalk/75 hover:bg-chalk/5 hover:text-chalk">
          <IconLogout aria-hidden="true" size={18} stroke={1.75} />
          Sign out
        </button>
      </form>
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
    <div className="flex-1 lg:grid lg:grid-cols-[16.5rem_minmax(0,1fr)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-limestone focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      <aside className="sticky top-0 hidden h-dvh flex-col gap-8 overflow-y-auto bg-slate-deep p-4 pt-6 lg:flex">
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

      <main id="main" className="min-w-0 px-5 pb-20 pt-8 md:px-8 lg:px-12 lg:pt-12">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
