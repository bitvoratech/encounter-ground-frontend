"use client";

import { useSyncExternalStore } from "react";
import { fetchBooks, type Book } from "./books";

// The catalogue for client components (cart, wishlist, checkout, dashboard), fetched once per
// page load and shared. `null` while loading; an empty list if the API can't be reached.

let books: Book[] | null = null;
let started = false;
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  if (!started) {
    started = true;
    fetchBooks()
      .catch((err) => {
        console.error("Books unavailable:", err);
        return [] as Book[];
      })
      .then((list) => {
        books = list;
        listeners.forEach((l) => l());
      });
  }
  return () => listeners.delete(onChange);
}

export function useBooks(): Book[] | null {
  return useSyncExternalStore(subscribe, () => books, () => null);
}
