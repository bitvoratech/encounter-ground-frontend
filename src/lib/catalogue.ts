"use client";

import { useSyncExternalStore } from "react";
import type { Book } from "./books";

// The catalogue for client components (cart, wishlist, checkout, dashboard), fetched once per
// page load and shared. It comes through this site's own /api/books (see that route), not
// straight from the API, so it loads wherever the store pages load. `null` while loading;
// "unavailable" if it can't be reached, so pages can say so instead of looking empty.

let books: Book[] | "unavailable" | null = null;
let started = false;
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  if (!started) {
    started = true;
    fetch("/api/books")
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return res.json() as Promise<Book[]>;
      })
      .catch((err) => {
        console.error("Books unavailable:", err);
        return "unavailable" as const;
      })
      .then((list) => {
        books = list;
        listeners.forEach((l) => l());
      });
  }
  return () => listeners.delete(onChange);
}

/** The catalogue, `null` while loading, or "unavailable" when it can't be loaded. */
export function useBooks(): Book[] | "unavailable" | null {
  return useSyncExternalStore(subscribe, () => books, () => null);
}
