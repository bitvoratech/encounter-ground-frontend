"use client";

import { findBook, type Book } from "@/content/books";
import type { Currency } from "./currency";
import { clearCart } from "./cart";
import { addToLibrary } from "./library";

// Everything checkout needs from the outside world goes through this file, so swapping the
// simulation for the real backend touches nothing else. With the backend, placeOrder becomes:
//   1. POST /orders { slugs, currency, method, email }: the server re-prices from the books
//      table, refuses books the buyer already owns, and creates a pending order.
//   2. The server opens a session with the provider (Stripe, PayPal or Paystack) and returns
//      its URL; the browser goes there to pay.
//   3. The provider returns to /checkout/complete?ref=…; the server verifies the payment
//      (webhook + lookup) before marking the order paid and granting the books.

export type PaymentMethod = "card" | "paypal" | "paystack";

/** Which ways to pay are offered in each currency. */
export const paymentMethods: Record<Currency, PaymentMethod[]> = {
  CAD: ["card", "paypal"],
  USD: ["card", "paypal"],
  NGN: ["paystack"],
};

export const methodDetails: Record<PaymentMethod, { label: string; detail: string; provider: string }> = {
  card: { label: "Card, Apple Pay or Google Pay", detail: "Visa, Mastercard, Amex and wallets", provider: "Stripe" },
  paypal: { label: "PayPal", detail: "Pay with your PayPal account or card", provider: "PayPal" },
  paystack: { label: "Card, bank transfer or USSD", detail: "Nigerian cards and banks", provider: "Paystack" },
};

export type Order = {
  reference: string;
  slugs: string[];
  currency: Currency;
  /** In minor units. */
  total: number;
  method: PaymentMethod;
  email: string;
  placedAt: string;
};

export type PlaceOrderResult = { ok: true; order: Order } | { ok: false; error: string };

const LAST_ORDER_KEY = "eg-last-order";

/** Payments are simulated until the backend exists. */
export const paymentsAreSimulated = true;

const newReference = () =>
  `EG-${Array.from({ length: 6 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("")}`;

export async function placeOrder(input: {
  slugs: string[];
  currency: Currency;
  method: PaymentMethod;
  email: string;
  /** Test the failure path: the checkout page passes this for ?simulate=fail. */
  simulateFailure?: boolean;
}): Promise<PlaceOrderResult> {
  const books = input.slugs.map(findBook).filter((b): b is Book => !!b);
  if (books.length === 0) return { ok: false, error: "Your cart is empty." };
  if (!paymentMethods[input.currency].includes(input.method)) {
    return { ok: false, error: "That way to pay isn’t available in this currency." };
  }

  // Stand-in for the trip to the payment provider.
  await new Promise((resolve) => setTimeout(resolve, 1600));
  if (input.simulateFailure) {
    return { ok: false, error: "The payment didn’t go through, so nothing was charged. Try again, or choose another way to pay." };
  }

  const order: Order = {
    reference: newReference(),
    slugs: books.map((b) => b.slug),
    currency: input.currency,
    total: books.reduce((sum, b) => sum + b.prices[input.currency], 0),
    method: input.method,
    email: input.email,
    placedAt: new Date().toISOString(),
  };
  try {
    sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  } catch {
    // The confirmation page falls back to the reference alone.
  }
  addToLibrary(order.slugs);
  clearCart();
  return { ok: true, order };
}

/** The order just placed in this tab, for the confirmation page. */
export function readLastOrder(reference: string): Order | null {
  try {
    const order = JSON.parse(sessionStorage.getItem(LAST_ORDER_KEY) ?? "null") as Order | null;
    return order?.reference === reference ? order : null;
  } catch {
    return null;
  }
}
