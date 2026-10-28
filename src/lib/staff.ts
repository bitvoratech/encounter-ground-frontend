"use client";

import { useSyncExternalStore } from "react";
import type { Profile } from "@/types/admin";
import { api } from "./api";
import { authHeader, createClient } from "./supabase/client";

// Whether the signed-in member is on the ministry team (editor or admin), from the API's
// /me. Only decides whether to show the way into the admin dashboard; the API enforces it.

let staff = false;
const listeners = new Set<() => void>();
let started = false;

async function load() {
  const headers = await authHeader();
  let next = false;
  if (headers.Authorization) {
    try {
      next = (await api<Profile>("/me", { headers })).role !== "member";
    } catch {
      // Unknown: keep the link hidden.
    }
  }
  staff = next;
  listeners.forEach((l) => l());
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

export function useIsStaff() {
  return useSyncExternalStore(subscribe, () => staff, () => false);
}
