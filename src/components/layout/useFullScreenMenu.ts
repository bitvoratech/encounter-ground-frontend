"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * State for a full-screen mobile menu. While it is open the page can't scroll, Tab stays
 * inside the menu, and Escape (or growing to the desktop layout) closes it, returning focus
 * to the button that opened it. The menu belongs to the page it was opened on, so
 * navigating closes it.
 */
export function useFullScreenMenu() {
  const pathname = usePathname();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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
        buttonRef.current?.focus();
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

  return {
    open,
    buttonRef,
    menuRef,
    openMenu: () => setOpenOn(pathname),
    closeMenu: () => {
      setOpenOn(null);
      buttonRef.current?.focus();
    },
  };
}

/** Whether a member is signed in; updates on every sign-in or sign-out. */
export function useSignedIn() {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    const { data } = createClient().auth.onAuthStateChange((_event, session) => setSignedIn(!!session));
    return () => data.subscription.unsubscribe();
  }, []);
  return signedIn;
}
