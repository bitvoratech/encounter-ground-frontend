"use client";

import { formatPrice, type Prices } from "@/lib/currency";
import { useCurrency } from "@/lib/useCurrency";

/**
 * A price in the visitor's currency. The currency is only known in the browser, so the
 * server renders a same-sized blank that the price fills after mount.
 */
export function Price({ prices, className = "" }: { prices: Prices; className?: string }) {
  const currency = useCurrency();
  return (
    <span className={`inline-block min-w-[5ch] tabular-nums ${className}`}>
      {currency ? formatPrice(prices[currency], currency) : " "}
    </span>
  );
}
