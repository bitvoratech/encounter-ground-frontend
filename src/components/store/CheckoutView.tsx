"use client";

import { IconAlertTriangle, IconBrandPaypal, IconBuildingBank, IconCreditCard, IconLoader2, IconLock } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useRef, useState } from "react";
import { findBook, samplePrices, type Book } from "@/content/books";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/currency";
import { methodDetails, paymentMethods, paymentsAreSimulated, placeOrder, type PaymentMethod } from "@/lib/store";
import { useCurrency } from "@/lib/useCurrency";
import { CurrencySwitcher } from "./CurrencySwitcher";
import { Price } from "./Price";

const methodIcons: Record<PaymentMethod, typeof IconCreditCard> = {
  card: IconCreditCard,
  paypal: IconBrandPaypal,
  paystack: IconBuildingBank,
};

export function CheckoutView({ email: accountEmail, simulateFailure }: { email: string; simulateFailure: boolean }) {
  const router = useRouter();
  const cart = useCart();
  const currency = useCurrency();
  const emailId = useId();
  const [email, setEmail] = useState(accountEmail);
  const [chosen, setChosen] = useState<PaymentMethod | null>(null);
  const [state, setState] = useState<"idle" | "paying" | "done">("idle");
  const [error, setError] = useState("");
  const errorRef = useRef<HTMLDivElement>(null);

  const items = (cart ?? []).map(findBook).filter((b): b is Book => !!b);
  const available = currency ? paymentMethods[currency] : [];
  // A choice from another currency falls back to that currency's first method.
  const method = chosen && available.includes(chosen) ? chosen : available[0];
  const total = currency ? items.reduce((sum, b) => sum + b.prices[currency], 0) : 0;

  if (!cart || !currency) {
    return <div className="mt-10 h-64 rounded-3xl border border-rule bg-chalk/60" aria-hidden="true" />;
  }

  // Paid: the cart is now empty, so hold this message while the confirmation page loads.
  if (state === "done") {
    return (
      <p role="status" className="mt-10 flex items-center gap-3 font-semibold text-slate-ink">
        <IconLoader2 aria-hidden="true" size={22} className="animate-spin text-amber" />
        Payment received. Opening your receipt…
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mt-10 flex flex-col items-start gap-5 rounded-3xl border border-rule bg-chalk p-8">
        <h2 className="text-h3 text-slate-ink">There’s nothing to check out</h2>
        <p className="text-stone-muted">Your cart is empty.</p>
        <Link href="/books" className="btn btn-fire">
          Browse the books
        </Link>
      </div>
    );
  }

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    if (!currency || !method || state === "paying") return;
    setState("paying");
    setError("");
    const result = await placeOrder({ slugs: items.map((b) => b.slug), currency, method, email: email.trim(), simulateFailure });
    if (result.ok) {
      setState("done");
      router.push(`/checkout/complete?ref=${result.order.reference}`);
    } else {
      setState("idle");
      setError(result.error);
      requestAnimationFrame(() => errorRef.current?.focus());
    }
  }

  const paying = state === "paying";

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-start">
      <form onSubmit={pay} className="grid gap-8 rounded-3xl border border-rule bg-chalk p-6 md:p-8">
        {paymentsAreSimulated && (
          <p className="rounded-2xl bg-flame/15 px-4 py-3 text-sm font-semibold text-amber">
            Test mode: payments are simulated and no money is taken.
          </p>
        )}

        {error && (
          <div ref={errorRef} tabIndex={-1} role="alert" className="flex items-start gap-3 rounded-2xl border border-amber/40 bg-flame/10 p-4 outline-none">
            <IconAlertTriangle aria-hidden="true" size={22} stroke={1.75} className="mt-0.5 shrink-0 text-amber" />
            <p className="text-slate-ink">{error}</p>
          </div>
        )}

        <div>
          <h2 className="text-h3 text-slate-ink">Receipt</h2>
          <label htmlFor={emailId} className="mt-4 block font-semibold text-slate-ink">
            Email for your receipt
          </label>
          <input
            id={emailId}
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={paying}
            className="mt-2 min-h-12 w-full rounded-xl border border-rule bg-limestone px-4 text-slate-ink"
          />
        </div>

        <fieldset disabled={paying}>
          <legend className="text-h3 font-display text-slate-ink">How would you like to pay?</legend>
          <CurrencySwitcher className="mt-4" />
          <div className="mt-5 grid gap-3">
            {available.map((m) => {
              const Icon = methodIcons[m];
              const details = methodDetails[m];
              return (
                <label
                  key={m}
                  className="flex cursor-pointer items-center gap-4 rounded-2xl border border-rule bg-limestone p-4 transition-colors has-checked:border-slate has-checked:bg-chalk has-checked:shadow-[inset_0_0_0_1px_var(--color-slate)]"
                >
                  <input
                    type="radio"
                    name="method"
                    value={m}
                    checked={method === m}
                    onChange={() => setChosen(m)}
                    className="size-5 accent-slate"
                  />
                  <Icon aria-hidden="true" size={24} stroke={1.75} className="shrink-0 text-amber" />
                  <span className="flex-1">
                    <span className="block font-semibold text-slate-ink">{details.label}</span>
                    <span className="block text-sm text-stone-muted">
                      {details.detail} · via {details.provider}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
          {currency !== "NGN" && (
            <p className="mt-3 text-sm text-stone-muted">Paying from Nigeria? Switch to naira to pay with Paystack.</p>
          )}
        </fieldset>

        <div>
          <button type="submit" disabled={paying || !method} className="btn btn-fire w-full text-lg">
            {paying ? (
              <>
                <IconLoader2 aria-hidden="true" size={20} className="animate-spin" />
                Processing payment…
              </>
            ) : (
              <>Pay {formatPrice(total, currency)}</>
            )}
          </button>
          {method && (
            <p className="mt-3 flex items-start justify-center gap-2 text-center text-sm text-stone-muted">
              <IconLock aria-hidden="true" size={16} stroke={1.75} className="mt-0.5 shrink-0" />
              Payment is handled securely by {methodDetails[method].provider}. This site never sees your card details.
            </p>
          )}
        </div>
      </form>

      <section aria-labelledby="order-heading" className="rounded-3xl border border-rule bg-chalk p-6 lg:sticky lg:top-28">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="order-heading" className="text-h3 text-slate-ink">
            Your order
          </h2>
          <Link href="/cart" className="link text-sm font-semibold text-slate-ink">
            Edit cart
          </Link>
        </div>
        <ul className="mt-5 grid gap-4">
          {items.map((book) => (
            <li key={book.slug} className="flex items-center gap-4">
              <Image
                src={book.cover}
                alt=""
                width={683}
                height={1024}
                sizes="3.5rem"
                className="aspect-[2/3] w-14 shrink-0 rounded-md bg-limestone object-cover"
              />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold leading-snug text-slate-ink">{book.title}</span>
                <span className="block text-sm text-stone-muted">E-book · {book.audience}</span>
              </span>
              <Price prices={book.prices} className="text-sm font-semibold text-slate-ink" />
            </li>
          ))}
        </ul>
        <dl className="mt-6 flex items-baseline justify-between border-t border-rule pt-5">
          <dt className="font-semibold text-slate-ink">Total</dt>
          <dd className="font-display text-[2rem] leading-none text-slate-ink tabular-nums">{formatPrice(total, currency)}</dd>
        </dl>
        {samplePrices && <p className="mt-2 text-right text-sm text-stone-muted">Sample prices: final prices to come.</p>}
        <p className="mt-6 border-t border-rule pt-5 text-sm text-stone-muted">
          Your e-books appear in My books as soon as payment is confirmed, ready to read on any device.
        </p>
      </section>
    </div>
  );
}
