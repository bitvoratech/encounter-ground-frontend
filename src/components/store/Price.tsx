"use client";

import { formatPrice } from "@/lib/currency";
import type { BookPrices } from "@/lib/books";
import { useCurrency } from "@/lib/useCurrency";

/**
 * A price in the visitor's currency. The currency is only known in the browser, so the
 * server renders a same-sized blank that the price fills after mount. A book with no price
 * in that currency says so.
 */
export function Price({ prices, className = "" }: { prices: BookPrices; className?: string }) {
  const currency = useCurrency();
  const amount = currency ? prices[currency] : undefined;
  return (
    <span className={`inline-block min-w-[5ch] tabular-nums ${className}`}>
      {!currency ? " " : amount === undefined ? <span className="text-[0.8em] font-normal text-stone-muted">Not sold in {currency}</span> : formatPrice(amount, currency)}
    </span>
  );
}
