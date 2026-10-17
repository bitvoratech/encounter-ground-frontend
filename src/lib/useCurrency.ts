"use client";

import { useSyncExternalStore } from "react";
import { isCurrency, type Currency } from "./currency";

const STORAGE_KEY = "eg-currency";
const CHANGE_EVENT = "eg-currency-change";
// Used when the browser blocks storage, so the switcher still works for the visit.
let memoryChoice: Currency | null = null;

/** A first guess from the visitor's time zone: Lagos means naira, Canadian zones mean CAD. */
function guessCurrency(): Currency {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  if (zone === "Africa/Lagos") return "NGN";
  const canadian = ["Toronto", "Vancouver", "Edmonton", "Winnipeg", "Halifax", "St_Johns", "Regina", "Moncton", "Whitehorse", "Iqaluit"];
  if (canadian.some((city) => zone.endsWith(`/${city}`))) return "CAD";
  return "USD";
}

function readCurrency(): Currency {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isCurrency(saved)) return saved;
  } catch {
    // Storage blocked: fall through to the in-memory choice.
  }
  return memoryChoice ?? guessCurrency();
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * The visitor's currency: their saved choice, else a guess from their time zone.
 * `null` while rendering on the server and hydrating, so prices appear after mount
 * without a hydration mismatch.
 */
export function useCurrency(): Currency | null {
  return useSyncExternalStore(subscribe, readCurrency, () => null);
}

export function setCurrency(currency: Currency) {
  memoryChoice = currency;
  try {
    localStorage.setItem(STORAGE_KEY, currency);
  } catch {
    // Kept in memory instead.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
