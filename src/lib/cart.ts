"use client";

import { useSyncExternalStore } from "react";
import { findBook } from "@/content/books";

// The cart lives in the browser so it works before signing in. It holds book slugs only:
// e-books sell one copy each, and prices always come from the catalogue, never from storage.
// When checkout reaches the backend, the server recomputes the order from these slugs.

const STORAGE_KEY = "eg-cart-v1";
const CHANGE_EVENT = "eg-cart-change";
const EMPTY: string[] = [];

// Used when the browser blocks storage, so the cart still works for the visit.
let memoryCart: string[] = EMPTY;
// useSyncExternalStore needs the same array back until the cart actually changes.
let cachedRaw: string | null = null;
let cachedCart: string[] = EMPTY;

function parse(raw: string | null): string[] {
  try {
    const value: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(value)) return EMPTY;
    // Drop anything that is no longer in the catalogue, and any duplicates.
    return [...new Set(value.filter((s): s is string => typeof s === "string" && !!findBook(s)))];
  } catch {
    return EMPTY;
  }
}

function readCart(): string[] {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return memoryCart;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedCart = parse(raw);
  }
  return cachedCart;
}

function writeCart(slugs: string[]) {
  memoryCart = slugs;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    // Kept in memory instead.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** The slugs in the cart, or `null` while rendering on the server and hydrating. */
export function useCart(): string[] | null {
  return useSyncExternalStore(subscribe, readCart, () => null);
}

export function addToCart(slug: string) {
  const cart = readCart();
  if (findBook(slug) && !cart.includes(slug)) writeCart([...cart, slug]);
}

export function removeFromCart(slug: string) {
  writeCart(readCart().filter((s) => s !== slug));
}

export function clearCart() {
  writeCart(EMPTY);
}
