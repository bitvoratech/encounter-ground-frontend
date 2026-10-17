"use client";

import { IconChevronDown } from "@tabler/icons-react";
import { useId } from "react";
import { currencies, currencyLabels, isCurrency } from "@/lib/currency";
import { setCurrency, useCurrency } from "@/lib/useCurrency";

/** "Prices in [currency]": the visitor's choice is remembered on this device. */
export function CurrencySwitcher({ className = "" }: { className?: string }) {
  const id = useId();
  const currency = useCurrency();

  return (
    <div className={`inline-flex items-center gap-2 text-sm ${className}`}>
      <label htmlFor={id} className="text-stone-muted">
        Prices in
      </label>
      <span className="relative">
        <select
          id={id}
          value={currency ?? ""}
          onChange={(e) => isCurrency(e.target.value) && setCurrency(e.target.value)}
          disabled={!currency}
          className="min-h-11 appearance-none rounded-full border border-rule bg-chalk py-2 pl-4 pr-9 font-semibold text-slate-ink"
        >
          {!currency && <option value="">…</option>}
          {currencies.map((c) => (
            <option key={c} value={c}>
              {currencyLabels[c]}
            </option>
          ))}
        </select>
        <IconChevronDown
          aria-hidden="true"
          size={16}
          stroke={2}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate"
        />
      </span>
    </div>
  );
}
