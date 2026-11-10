"use client";

import { IconChevronDown, IconLogout, IconMenu2, IconX } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AccountMenu, accountLinks, staffLinks } from "@/components/school/AccountMenu";
import { Avatar } from "@/components/school/Avatar";
import { CartLink } from "@/components/store/CartLink";
import { WishlistLink } from "@/components/store/WishlistLink";
import { SocialIcon } from "@/components/ui/SocialIcon";
import type { Social } from "@/lib/siteContent";
import { useIsStaff } from "@/lib/staff";
import { useAccount, useFullScreenMenu } from "./useFullScreenMenu";
import { isGroup, nav, type NavGroup, type NavItem } from "./nav";

const pill =
  "rounded-full px-3.5 py-2 text-[0.95rem] font-medium text-slate transition-colors hover:text-slate-ink";
// Keyed on data-active so it outranks the plain text-slate above (two bare text colours on one
// element resolve by stylesheet order, which left the label slate-on-slate).
const pillActive = "data-active:bg-slate data-active:text-chalk data-active:hover:text-chalk";

function useIsActive() {
  const pathname = usePathname();
  return (href: string) =>
    href === "/events" ? pathname === "/events" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Desktop dropdown: opens on hover or click; Escape, outside click or navigation closes it. */
function NavDropdown({ group }: { group: NavGroup }) {
  const pathname = usePathname();
  const isActive = useIsActive();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const ref = useRef<HTMLLIElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = `nav-${group.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const groupActive = group.children.some((c) => isActive(c.href));

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
    <li
      ref={ref}
      className="relative"
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpenOn(pathname)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpenOn(null)}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpenOn(open ? null : pathname)}
        data-active={groupActive || undefined}
        className={`${pill} ${pillActive} inline-flex items-center gap-1.5`}
      >
        {group.label}
        <IconChevronDown
          aria-hidden="true"
          size={16}
          stroke={2}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {/* pt-2 bridges the gap so the menu doesn't close as the pointer moves down */}
      <div id={menuId} hidden={!open} className="absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 pt-2">
        <ul className="rounded-2xl border border-rule bg-chalk p-2 shadow-[0_18px_40px_-18px_rgb(29_38_48/0.35)]">
          {group.children.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                aria-current={isActive(child.href) ? "page" : undefined}
                className="block rounded-xl px-4 py-2.5 font-medium text-slate-ink transition-colors hover:bg-limestone aria-[current=page]:bg-slate aria-[current=page]:text-chalk"
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

const mobileLink =
  "flex items-baseline gap-4 py-3.5 font-display text-[1.75rem] leading-tight text-chalk transition-colors hover:text-flame aria-[current=page]:text-flame";
const mobileNum = "w-6 shrink-0 font-sans text-xs font-semibold text-flame";

/** Phone menu: a dropdown's links fold open beneath it, so the whole menu fits on one screen.
 * The group holding the current page starts open. */
function MobileGroup({ group, num, isActive }: { group: NavGroup; num: string; isActive: (href: string) => boolean }) {
  const holdsCurrent = group.children.some((c) => isActive(c.href));
  const [expanded, setExpanded] = useState(holdsCurrent);
  const panelId = `m-${group.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded(!expanded)}
        className={`${mobileLink} w-full text-left ${holdsCurrent ? "text-flame" : ""}`}
      >
        <span aria-hidden="true" className={mobileNum}>
          {num}
        </span>
        <span className="flex-1">{group.label}</span>
        <IconChevronDown
          aria-hidden="true"
          size={22}
          stroke={2}
          className={`self-center text-chalk/60 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      <ul id={panelId} hidden={!expanded} className="pb-3 pl-10">
        {group.children.map((child) => (
          <li key={child.href}>
            <Link
              href={child.href}
              aria-current={isActive(child.href) ? "page" : undefined}
              className="flex min-h-11 items-center text-lg font-medium text-chalk/80 transition-colors hover:text-flame aria-[current=page]:text-flame"
            >
              {child.label}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export function SiteHeader({ socials }: { socials: Social[] }) {
  const isActive = useIsActive();
  const { open, buttonRef: menuButtonRef, menuRef, openMenu, closeMenu } = useFullScreenMenu();
  const member = useAccount();
  const signedIn = !!member;
  const isStaff = useIsStaff();

  const account = signedIn
    ? { href: isStaff ? "/admin" : "/dashboard", label: isStaff ? "Admin dashboard" : "My dashboard" }
    : { href: "/login", label: "Sign in" };

  // Top-level menu entries are numbered from Home (01), and the number also staggers their entrance.
  const entries = [{ href: "/", label: "Home" } as NavItem, ...nav];
  const num = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-rule bg-limestone/95 backdrop-blur supports-[backdrop-filter]:bg-limestone/80">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-chalk focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <div className="wrap flex h-18 lg:h-22 items-center justify-between gap-4">
          <Link href="/" className="shrink-0" aria-label="Encounter Ground home">
            <Image
              src="/brand/logo.png"
              alt="Encounter Ground"
              width={467}
              height={480}
              priority
              className="h-14 lg:h-[4.5rem] w-auto"
            />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) =>
                isGroup(item) ? (
                  <NavDropdown key={item.label} group={item} />
                ) : (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={`${pill} aria-[current=page]:bg-slate aria-[current=page]:text-chalk`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <WishlistLink />
            <CartLink />
            {member === undefined ? (
              // Session not checked yet: hold the avatar's space without guessing.
              <span aria-hidden="true" className="hidden size-10 rounded-full bg-chalk lg:block" />
            ) : member ? (
              // Signed in: their initials (or photo), opening the same account menu as the school and dashboard.
              <AccountMenu account={member} />
            ) : (
              <Link
                  href={account.href}
                  aria-current={isActive(account.href) ? "page" : undefined}
                  className="hidden rounded-full border-[1.5px] border-current px-5 py-2 text-[0.95rem] font-semibold text-slate-ink transition-colors hover:bg-slate-ink/5 hover:text-amber aria-[current=page]:text-amber lg:inline-flex lg:items-center"
                >
                  {account.label}
                </Link>
            )}
            <button
              ref={menuButtonRef}
              type="button"
              className="grid size-11 place-items-center rounded-full border border-slate/30 text-sm font-semibold text-slate-ink lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label="Open menu"
              onClick={openMenu}
            >
              <IconMenu2 aria-hidden="true" size={20} stroke={2} />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu. It sits outside the header: the header's backdrop blur
          would otherwise make a fixed element size itself to the header bar. */}
      <div
        ref={menuRef}
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="fixed inset-0 z-50 flex flex-col bg-slate-deep text-chalk lg:hidden"
      >
        <div className="wrap flex h-18 shrink-0 items-center justify-between gap-4 border-b border-chalk/10">
          <Link href="/" aria-label="Encounter Ground home">
            <Image src="/brand/logo.png" alt="" width={507} height={580} className="h-20 w-auto" />
          </Link>
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close menu"
            className="grid size-11 place-items-center rounded-full border border-chalk/30 text-sm font-semibold text-chalk"
          >
            <IconX aria-hidden="true" size={20} stroke={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <nav aria-label="Main" className="wrap">
            <ul className="py-3">
              {entries.map((item, i) => (
                <li key={isGroup(item) ? item.label : item.href} className="menu-in border-b border-chalk/10" style={{ "--i": i } as React.CSSProperties}>
                  {isGroup(item) ? (
                    <MobileGroup group={item} num={num(i)} isActive={isActive} />
                  ) : (
                    <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className={mobileLink}>
                      <span aria-hidden="true" className={mobileNum}>
                        {num(i)}
                      </span>
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <section aria-label="Your account" className="wrap pb-6 pt-3">
            {member ? (
              <div className="rounded-2xl bg-chalk/[0.06] p-2">
                <div className="flex items-center gap-3 px-2 pb-3 pt-2">
                  <Avatar name={member.name} src={member.avatarUrl} size={44} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-chalk">{member.name}</p>
                    <p className="truncate text-sm text-chalk/65">{member.email}</p>
                  </div>
                </div>
                <ul className="grid gap-0.5 border-t border-chalk/10 pt-2">
                  {(isStaff ? staffLinks : accountLinks).map(({ href, label, Icon }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        aria-current={isActive(href) ? "page" : undefined}
                        className="flex min-h-11 items-center gap-2.5 rounded-xl px-2.5 py-2 font-medium text-chalk/90 hover:bg-chalk/10 aria-[current=page]:bg-chalk/10 aria-[current=page]:text-flame"
                      >
                        <Icon aria-hidden="true" size={20} stroke={1.75} className="shrink-0 text-flame" />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <form action="/auth/signout" method="post" className="mt-1 border-t border-chalk/10 pt-1">
                  <button
                    type="submit"
                    className="flex min-h-11 w-full items-center gap-2.5 rounded-xl px-2.5 py-2 font-medium text-chalk/75 hover:bg-chalk/10"
                  >
                    <IconLogout aria-hidden="true" size={20} stroke={1.75} className="shrink-0" />
                    Sign out
                  </button>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link href="/login" className="btn btn-fire border-black">
                  Sign in
                </Link>
                <Link href="/register" className="btn btn-quiet text-chalk">
                  Create account
                </Link>
              </div>
            )}

            <ul className="mt-6 flex gap-2" aria-label="Encounter Ground on social media">
              {socials.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.name} (${s.handle})`}
                    className="grid size-11 place-items-center rounded-full border border-chalk/20 text-chalk transition-colors hover:border-flame hover:bg-flame hover:text-slate-ink"
                  >
                    <SocialIcon name={s.name} size={18} />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
