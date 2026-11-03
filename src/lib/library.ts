"use client";

import { useSyncExternalStore } from "react";
import { api } from "./api";
import { authHeader, createClient } from "./supabase/client";

// The e-books the signed-in member owns ("My books"), from GET /me/books. Purchases add
// them once payments are live; until then the team can give a book from the admin.

export type OwnedBook = {
  slug: string;
  title: string;
  subtitle: string | null;
  author: string | null;
  audience: string | null;
  cover_image_url: string | null;
  page_count: number | null;
  /** The reader's pages have been made from the PDF. */
  pages_ready: boolean;
  last_page: number;
  last_read_at: string | null;
  granted_at: string;
};

export type Library = { status: "loading" } | { status: "signed-out" } | { status: "error" } | { status: "ready"; books: OwnedBook[] };

const LOADING: Library = { status: "loading" };
let state: Library = LOADING;
let started = false;
const listeners = new Set<() => void>();

function set(next: Library) {
  state = next;
  listeners.forEach((l) => l());
}

async function load() {
  const headers = await authHeader();
  if (!headers.Authorization) return set({ status: "signed-out" });
  try {
    set({ status: "ready", books: await api<OwnedBook[]>("/me/books", { headers, cache: "no-store" }) });
  } catch {
    set({ status: "error" });
  }
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  if (!started) {
    started = true;
    createClient().auth.onAuthStateChange((event) => {
      if (event === "INITIAL_SESSION" || event === "SIGNED_IN" || event === "SIGNED_OUT") void load();
    });
  }
  return () => listeners.delete(onChange);
}

export function useLibrary(): Library {
  return useSyncExternalStore(subscribe, () => state, () => LOADING);
}

/** Whether the member owns a book; false while loading or signed out. */
export function useOwns(slug: string) {
  const library = useLibrary();
  return library.status === "ready" && library.books.some((b) => b.slug === slug);
}
