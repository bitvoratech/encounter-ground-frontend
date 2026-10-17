"use client";

import { IconDeviceLaptop, IconShoppingBag, IconTrash } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { findBook, samplePrices, type Book } from "@/content/books";
import { removeFromCart, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/currency";
import { useCurrency } from "@/lib/useCurrency";
import { CurrencySwitcher } from "./CurrencySwitcher";
import { Price } from "./Price";

/** The cart page. The status line sits outside the part that swaps between empty and full,
 * so screen readers still hear "removed" when the last book goes. */
export function CartView() {
  const [message, setMessage] = useState("");
  return (
    <>
      <p role="status" className="sr-only">
        {message}
      </p>
      <CartBody onMessage={setMessage} />
    </>
  );
}

function CartBody({ onMessage }: { onMessage: (message: string) => void }) {
  const cart = useCart();
  const currency = useCurrency();
  const headingRef = useRef<HTMLHeadingElement>(null);

  const items = (cart ?? []).map(findBook).filter((b): b is Book => !!b);
  const total = currency ? items.reduce((sum, b) => sum + b.prices[currency], 0) : null;

  const heading = (
    <h1 ref={headingRef} tabIndex={-1} className="text-[length:var(--text-h1)] text-slate-ink outline-none">
      Your cart
    </h1>
  );

  // Server render and hydration: the cart is only known in the browser.
  if (!cart) {
    return (
      <div className="page-hero wrap pb-24 pt-14 md:pt-20">
        {heading}
        <div className="mt-10 h-40 rounded-3xl border border-rule bg-chalk/60" aria-hidden="true" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-hero wrap pb-24 pt-14 md:pt-20">
        {heading}
        <div className="mt-10 flex flex-col items-start gap-6 rounded-3xl border border-rule bg-chalk p-8 md:p-12">
          <span className="grid size-14 place-items-center rounded-full bg-flame/20 text-amber">
            <IconShoppingBag aria-hidden="true" size={28} stroke={1.75} />
          </span>
          <div>
            <h2 className="text-h3 text-slate-ink">Your cart is empty</h2>
            <p className="mt-2 max-w-md text-stone-muted">
              Books by Toyin Bello are sold here as e-books, to read on any device.
            </p>
          </div>
          <Link href="/books" className="btn btn-fire">
            Browse the books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-hero wrap pb-24 pt-14 md:pt-20">
      {heading}
      <p className="mt-3 text-stone-muted">
        {items.length} {items.length === 1 ? "e-book" : "e-books"}
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
        <ul className="divide-y divide-rule rounded-3xl border border-rule bg-chalk">
          {items.map((book) => (
            <li key={book.slug} className="flex gap-4 p-4 sm:gap-6 sm:p-6">
              <Link href={`/books/${book.slug}`} tabIndex={-1} aria-hidden="true" className="shrink-0">
                <Image
                  src={book.cover}
                  alt=""
                  width={683}
                  height={1024}
                  sizes="6rem"
                  className="aspect-[2/3] w-20 rounded-lg bg-limestone object-cover shadow-[0_10px_24px_-14px_rgb(29_38_48/0.6)] sm:w-24"
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="text-xs font-semibold text-amber sm:text-sm">{book.audience}</p>
                <h2 className="mt-1 text-lg leading-snug text-slate-ink sm:text-xl">
                  <Link href={`/books/${book.slug}`} className="hover:underline hover:decoration-flame hover:underline-offset-4">
                    {book.title}
                  </Link>
                </h2>
                <p className="mt-1 text-sm text-stone-muted">E-book</p>
                <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
                  <Price prices={book.prices} className="font-semibold text-slate-ink" />
                  <button
                    type="button"
                    onClick={() => {
                      removeFromCart(book.slug);
                      onMessage(`${book.title} removed from your cart.`);
                      headingRef.current?.focus();
                    }}
                    className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-stone-muted hover:text-slate-ink"
                  >
                    <IconTrash aria-hidden="true" size={18} stroke={1.75} />
                    Remove<span className="sr-only">: {book.title}</span>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <section aria-labelledby="summary-heading" className="rounded-3xl border border-rule bg-chalk p-6 lg:sticky lg:top-28">
          <h2 id="summary-heading" className="text-h3 text-slate-ink">
            Summary
          </h2>
          <CurrencySwitcher className="mt-5" />
          <dl className="mt-6 flex items-baseline justify-between border-t border-rule pt-5">
            <dt className="font-semibold text-slate-ink">Total</dt>
            <dd className="font-display text-[2rem] leading-none text-slate-ink tabular-nums">
              {currency && total !== null ? formatPrice(total, currency) : " "}
            </dd>
          </dl>
          {samplePrices && <p className="mt-2 text-right text-sm text-stone-muted">Sample prices: final prices to come.</p>}

          <button type="button" disabled className="btn btn-fire mt-6 w-full cursor-not-allowed opacity-60">
            Checkout
          </button>
          <p className="mt-3 text-center text-sm text-stone-muted">Checkout opens with the next update.</p>

          <p className="mt-6 flex items-start gap-3 border-t border-rule pt-5 text-sm text-stone-muted">
            <IconDeviceLaptop aria-hidden="true" size={20} stroke={1.75} className="mt-0.5 shrink-0 text-amber" />
            E-books are read on this site, in My books. You’ll sign in or create an account at checkout.
          </p>
        </section>
      </div>

      <Link href="/books" className="link mt-10 inline-block font-semibold text-slate-ink">
        Keep browsing
      </Link>
    </div>
  );
}
