"use client";

import { createSlugStore } from "./slugStore";

// The e-books someone owns. STAND-IN until the backend: a sample checkout adds books here,
// in this browser only. With the backend, ownership comes from GET /me/books (user_books),
// granted by the server only after a payment is verified.

const store = createSlugStore("eg-library-sample-v1");

export const useLibrary = store.useSlugs;

export function addToLibrary(slugs: string[]) {
  store.write([...new Set([...store.read(), ...slugs])]);
}
