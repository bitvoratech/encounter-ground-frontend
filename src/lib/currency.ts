// The bookstore sells to buyers worldwide (the ministry's founder is in Canada), so every
// price is set per currency rather than converted. Amounts are in minor units (cents, kobo).

export const currencies = ["CAD", "USD", "NGN"] as const;
export type Currency = (typeof currencies)[number];
export type Prices = Record<Currency, number>;

export const currencyLabels: Record<Currency, string> = {
  CAD: "CA$ Canadian dollars",
  USD: "US$ US dollars",
  NGN: "₦ Naira",
};

// Explicit symbols: buyers in several countries see these, and a bare "$" would not say
// whether a price is Canadian or US dollars.
const symbols: Record<Currency, string> = { CAD: "CA$", USD: "US$", NGN: "₦" };

export function formatPrice(minor: number, currency: Currency) {
  // Naira prices are whole numbers; dollars keep their cents.
  const digits = currency === "NGN" ? 0 : 2;
  const amount = new Intl.NumberFormat("en", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(minor / 100);
  return `${symbols[currency]}${amount}`;
}

export const isCurrency = (value: unknown): value is Currency => currencies.includes(value as Currency);
