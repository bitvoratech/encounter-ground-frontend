"use client";

import { IconChevronDown, IconMenu2, IconX } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { contact } from "@/content/ministry";
import { createClient } from "@/lib/supabase/client";
import { isGroup, nav, type NavGroup, type NavItem } from "./nav";

const pill =
  "rounded-full px-3.5 py-2 text-[0.95rem] font-medium text-slate transition-colors hover:text-slate-ink";
const pillActive = "bg-slate text-chalk hover:text-chalk";

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
  const menuId = `nav-${group.label.toLowerCase()}`;
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
        className={`${pill} inline-flex items-center gap-1.5 ${groupActive ? pillActive : ""}`}
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

export function SiteHeader() {
  const pathname = usePathname();
  const isActive = useIsActive();
  // The menu belongs to the page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const [signedIn, setSignedIn] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fires once with the current session, then on every sign-in or sign-out.
  useEffect(() => {
    const { data } = createClient().auth.onAuthStateChange((_event, session) => setSignedIn(!!session));
    return () => data.subscription.unsubscribe();
  }, []);

  const closeMenu = () => {
    setOpenOn(null);
    menuButtonRef.current?.focus();
  };

  // While the full-screen menu is open: lock page scroll, keep Tab inside it, and close it
  // on Escape or when the screen grows to the desktop layout.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    const menu = menuRef.current;
    menu?.querySelector<HTMLElement>("a, button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenOn(null);
        menuButtonRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !menu) return;
      const focusable = menu.querySelectorAll<HTMLElement>("a, button");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 64rem)");
    const onDesktop = (e: MediaQueryListEvent) => e.matches && setOpenOn(null);

    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);
    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open]);

  const account = signedIn
    ? { href: "/dashboard", label: "My account" }
    : { href: "/login", label: "Sign in" };

  // Top-level menu entries are numbered from Home (01), and the number also staggers their entrance.
  const entries = [{ href: "/", label: "Home" } as NavItem, ...nav];
  const num = (i: number) => String(i + 1).padStart(2, "0");
  const fullLink =
    "flex items-baseline gap-4 py-2 font-display text-[clamp(2rem,1.4rem+3vw,2.75rem)] leading-tight text-chalk transition-colors hover:text-flame aria-[current=page]:text-flame";

  return (
    <>
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
            <Link
              href={account.href}
              aria-current={isActive(account.href) ? "page" : undefined}
              className="hidden rounded-full px-3 py-2 text-[0.95rem] font-semibold text-slate-ink hover:text-amber aria-[current=page]:text-amber lg:inline-block"
            >
              {account.label}
            </Link>
            <Link href="/give" className="btn btn-fire min-h-11 px-5 py-2">
              Give
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-slate/30 px-4 text-sm font-semibold text-slate-ink lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpenOn(pathname)}
            >
              <IconMenu2 aria-hidden="true" size={18} stroke={2} />
              Menu
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
        <div className="wrap flex h-22 shrink-0 items-center justify-between gap-4 border-b border-chalk/10">
          <Link href="/" aria-label="Encounter Ground home">
            <Image src="/brand/lockup-light.png" alt="" width={467} height={480} className="h-[4.5rem] w-auto" />
          </Link>
          <button
            type="button"
            onClick={closeMenu}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-chalk/30 px-4 text-sm font-semibold text-chalk"
          >
            <IconX aria-hidden="true" size={18} stroke={2} />
            Close
          </button>
        </div>

        <nav aria-label="Main" className="flex-1 overflow-y-auto">
          <ul className="wrap py-6">
            {entries.map((item, i) =>
              isGroup(item) ? (
                <li key={item.label} className="menu-in py-3" style={{ "--i": i } as React.CSSProperties}>
                  <p className="flex items-baseline gap-4 text-sm font-semibold uppercase tracking-[0.18em] text-flame">
                    <span aria-hidden="true">{num(i)}</span>
                    {item.label}
                  </p>
                  <ul className="mt-2 grid grid-cols-2 gap-x-4 border-l border-chalk/15 pl-9">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          aria-current={isActive(child.href) ? "page" : undefined}
                          className="block py-2.5 text-lg font-medium text-chalk/85 transition-colors hover:text-flame aria-[current=page]:text-flame"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={item.href} className="menu-in" style={{ "--i": i } as React.CSSProperties}>
                  <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className={fullLink}>
                    <span aria-hidden="true" className="font-sans text-sm font-semibold text-flame">
                      {num(i)}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="wrap shrink-0 border-t border-chalk/10 py-5">
          <div className="flex gap-3">
            <Link href="/give" className="btn btn-fire flex-1">
              Give
            </Link>
            <Link href={account.href} className="btn btn-quiet flex-1 text-chalk">
              {account.label}
            </Link>
          </div>
          <div className="mt-5 flex items-center justify-between gap-4">
            {signedIn ? (
              <span />
            ) : (
              <Link href="/register" className="text-sm font-semibold text-chalk/80 hover:text-flame">
                Create an account
              </Link>
            )}
            <ul className="flex gap-2" aria-label="Encounter Ground on social media">
              {contact.socials.map((s) => (
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
          </div>
        </div>
      </div>
    </>
  );
}
