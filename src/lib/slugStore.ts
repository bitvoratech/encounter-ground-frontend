"use client";

import { useSyncExternalStore } from "react";

/**
 * A list of ids kept in the browser (localStorage, or memory when storage is blocked), shared
 * across tabs and components. Ids that fail `isValid` (say, a book no longer sold) and
 * duplicates are dropped.
 */
export function createSlugStore(storageKey: string, isValid: (id: string) => boolean) {
  const changeEvent = `${storageKey}-change`;
  const empty: string[] = [];
  let memory: string[] = empty;
  // useSyncExternalStore needs the same array back until the list actually changes.
  let cachedRaw: string | null = null;
  let cached: string[] = empty;

  const parse = (raw: string | null): string[] => {
    try {
      const value: unknown = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(value)) return empty;
      return [...new Set(value.filter((s): s is string => typeof s === "string" && isValid(s)))];
    } catch {
      return empty;
    }
  };

  const read = (): string[] => {
    let raw: string | null;
    try {
      raw = localStorage.getItem(storageKey);
    } catch {
      return memory;
    }
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cached = parse(raw);
    }
    return cached;
  };

  const write = (slugs: string[]) => {
    memory = slugs;
    try {
      localStorage.setItem(storageKey, JSON.stringify(slugs));
    } catch {
      // Kept in memory instead.
    }
    window.dispatchEvent(new Event(changeEvent));
  };

  const subscribe = (onChange: () => void) => {
    window.addEventListener(changeEvent, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(changeEvent, onChange);
      window.removeEventListener("storage", onChange);
    };
  };

  return {
    read,
    write,
    /** The slugs, or `null` while rendering on the server and hydrating. */
    useSlugs: (): string[] | null => useSyncExternalStore(subscribe, read, () => null),
  };
}
