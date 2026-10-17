"use client";

import { findBook } from "@/content/books";
import { createSlugStore } from "./slugStore";

// The cart lives in the browser so it works before signing in. It holds book slugs only:
// e-books sell one copy each, and prices always come from the catalogue, never from storage.
// When checkout reaches the backend, the server recomputes the order from these slugs.

const store = createSlugStore("eg-cart-v1");

export const useCart = store.useSlugs;

export function addToCart(slug: string) {
  const cart = store.read();
  if (findBook(slug) && !cart.includes(slug)) store.write([...cart, slug]);
}

export function removeFromCart(slug: string) {
  store.write(store.read().filter((s) => s !== slug));
}

export function clearCart() {
  store.write([]);
}
