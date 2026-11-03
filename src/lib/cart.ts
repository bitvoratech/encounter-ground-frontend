"use client";

import { createSlugStore, isBookSlug } from "./slugStore";

// The cart lives in the browser so it works before signing in. It holds book slugs only:
// e-books sell one copy each, and prices always come from the catalogue, never from storage.
// When checkout reaches the backend, the server recomputes the order from these slugs.

// Slugs only; pages drop any that are no longer in the catalogue.
const store = createSlugStore("eg-cart-v1", isBookSlug);

export const useCart = store.useSlugs;

export function addToCart(slug: string) {
  const cart = store.read();
  if (isBookSlug(slug) && !cart.includes(slug)) store.write([...cart, slug]);
}

export function removeFromCart(slug: string) {
  store.write(store.read().filter((s) => s !== slug));
}

export function clearCart() {
  store.write([]);
}
