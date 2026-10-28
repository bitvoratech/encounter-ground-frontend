"use client";

import { findBook } from "@/content/books";
import { createSlugStore } from "./slugStore";

// Books saved for later. Kept in the browser so it works before signing in, like the cart.
// With the backend it moves to the member's account so it follows them across devices.

const store = createSlugStore("eg-wishlist-v1", (slug) => !!findBook(slug));

export const useWishlist = store.useSlugs;

export function toggleWishlist(slug: string) {
  const list = store.read();
  store.write(list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug]);
}

export function removeFromWishlist(slug: string) {
  store.write(store.read().filter((s) => s !== slug));
}
