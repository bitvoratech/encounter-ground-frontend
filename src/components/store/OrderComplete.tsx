"use client";

import { IconCircleCheck } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { findBook, type Book } from "@/content/books";
import { formatPrice } from "@/lib/currency";
import { methodDetails, paymentsAreSimulated, readLastOrder } from "@/lib/store";

// The order is read from this tab's session once, in the browser; nothing to subscribe to.
const noSubscribe = () => () => {};

export function OrderComplete({ reference }: { reference: string }) {
  // Snapshot as a string so React sees a stable value between renders.
  const raw = useSyncExternalStore(
    noSubscribe,
    () => JSON.stringify(readLastOrder(reference)),
    () => undefined,
  );
  const order = raw ? (JSON.parse(raw) as ReturnType<typeof readLastOrder>) : null;
  const books = (order?.slugs ?? []).map(findBook).filter((b): b is Book => !!b);

  return (
    <div className="page-hero wrap pb-24 pt-14 md:pt-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-flame/20 text-amber">
          <IconCircleCheck aria-hidden="true" size={36} stroke={1.75} />
        </span>
        <h1 className="mt-6 text-[length:var(--text-h1)] text-slate-ink">Thank you</h1>
        <p className="mt-4 text-lede text-stone-muted">
          {books.length > 1 ? "Your e-books are" : "Your e-book is"} ready to read in My books.
        </p>
        <p className="mt-3 text-sm text-stone-muted">
          Order <span className="font-semibold text-slate-ink">{reference}</span>
        </p>
      </div>

      {order && books.length > 0 && (
        <section aria-labelledby="receipt-heading" className="mx-auto mt-10 max-w-2xl rounded-3xl border border-rule bg-chalk p-6 md:p-8">
          <h2 id="receipt-heading" className="text-h3 text-slate-ink">
            Receipt
          </h2>
          <ul className="mt-5 grid gap-4">
            {books.map((book) => (
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
                <span className="text-sm font-semibold tabular-nums text-slate-ink">
                  {formatPrice(book.prices[order.currency], order.currency)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-6 grid gap-2 border-t border-rule pt-5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-stone-muted">Paid with</dt>
              <dd className="text-right text-slate-ink">
                {methodDetails[order.method].label}
                {methodDetails[order.method].provider !== methodDetails[order.method].label &&
                  ` via ${methodDetails[order.method].provider}`}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="font-semibold text-slate-ink">Total</dt>
              <dd className="font-display text-2xl text-slate-ink tabular-nums">{formatPrice(order.total, order.currency)}</dd>
            </div>
          </dl>
          <p className="mt-5 border-t border-rule pt-5 text-sm text-stone-muted">
            {paymentsAreSimulated
              ? `Test mode: no money was taken and no receipt email is sent. With live payments, the receipt goes to ${order.email}.`
              : `A receipt is on its way to ${order.email}.`}
          </p>
        </section>
      )}

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/my-books" className="btn btn-fire">
          Start reading
        </Link>
        <Link href="/books" className="btn btn-quiet text-slate-ink">
          Back to the bookstore
        </Link>
      </div>
    </div>
  );
}
