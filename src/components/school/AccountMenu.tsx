"use client";

import { IconBooks, IconLayoutDashboard, IconLogout, IconSchool, IconShieldCheck } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Account } from "@/components/layout/useFullScreenMenu";
import { useIsStaff } from "@/lib/staff";
import { Avatar } from "./Avatar";

export const accountLinks = [
  { href: "/dashboard", label: "My dashboard", Icon: IconLayoutDashboard },
  { href: "/my-courses", label: "My courses", Icon: IconSchool },
  { href: "/my-books", label: "My books", Icon: IconBooks },
] as const;

/** For editors and admins, in place of the member's links: they work from the admin dashboard. */
export const adminLink = { href: "/admin", label: "Admin dashboard", Icon: IconShieldCheck } as const;
export const staffLinks = [adminLink] as const;

/** The avatar at the end of the header: opens the member's account links and sign out. */
export function AccountMenu({ account }: { account: Account }) {
  const pathname = usePathname();
  const isStaff = useIsStaff();
  const links = isStaff ? staffLinks : accountLinks;
  // Belongs to the page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpenOn(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenOn(null);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="account-menu"
        aria-label={`Account: ${account.name}`}
        onClick={() => setOpenOn(open ? null : pathname)}
        className="grid rounded-full ring-offset-2 ring-offset-chalk transition-shadow hover:ring-2 hover:ring-flame aria-expanded:ring-2 aria-expanded:ring-flame"
      >
        <Avatar name={account.name} src={account.avatarUrl} size={40} />
      </button>

      <div
        id="account-menu"
        hidden={!open}
        className="absolute right-0 top-full z-50 mt-3 w-72 rounded-2xl border border-rule bg-chalk p-2 shadow-[0_18px_40px_-18px_rgb(29_38_48/0.35)]"
      >
        <div className="flex items-center gap-3 border-b border-rule px-3 pb-3 pt-2">
          <Avatar name={account.name} src={account.avatarUrl} size={44} />
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-ink">{account.name}</p>
            <p className="truncate text-sm text-stone-muted">{account.email}</p>
          </div>
        </div>
        <ul className="py-2">
          {links.map(({ href, label, Icon }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-slate-ink hover:bg-limestone aria-[current=page]:bg-limestone"
              >
                <Icon aria-hidden="true" size={20} stroke={1.75} className="text-amber" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <form action="/auth/signout" method="post" className="border-t border-rule pt-2">
          <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-slate-ink hover:bg-limestone">
            <IconLogout aria-hidden="true" size={20} stroke={1.75} className="text-stone-muted" />
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
