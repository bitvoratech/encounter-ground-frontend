"use client";

import { IconChevronDown, IconMenu2, IconX } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isGroup, nav, type NavGroup } from "./nav";

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

  // Fires once with the current session, then on every sign-in or sign-out.
  useEffect(() => {
    const { data } = createClient().auth.onAuthStateChange((_event, session) => setSignedIn(!!session));
    return () => data.subscription.unsubscribe();
  }, []);

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
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-slate/30 px-4 text-sm font-semibold text-slate-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpenOn(open ? null : pathname)}
          >
            {open ? <IconX aria-hidden="true" size={18} stroke={2} /> : <IconMenu2 aria-hidden="true" size={18} stroke={2} />}
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Main"
        hidden={!open}
        className="max-h-[calc(100dvh-5.5rem)] overflow-y-auto border-t border-rule bg-limestone lg:hidden"
      >
        <ul className="wrap grid py-3">
          <li>
            <Link href="/" className="block py-3 font-display text-2xl text-slate-ink">
              Home
            </Link>
          </li>
          {nav.map((item) =>
            isGroup(item) ? (
              <li key={item.label} className="py-2">
                <p className="pt-1 text-sm font-semibold uppercase tracking-[0.15em] text-amber">{item.label}</p>
                <ul className="mt-1 border-l-2 border-flame/60 pl-4">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        aria-current={isActive(child.href) ? "page" : undefined}
                        className="block py-2.5 font-display text-xl text-slate-ink aria-[current=page]:text-amber"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="block py-3 font-display text-2xl text-slate-ink aria-[current=page]:text-amber"
                >
                  {item.label}
                </Link>
              </li>
            ),
          )}
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
