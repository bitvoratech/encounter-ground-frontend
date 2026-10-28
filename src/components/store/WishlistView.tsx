"use client";

import { IconHeart, IconTrash } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { findBook, type Book } from "@/content/books";
import { removeFromWishlist, useWishlist } from "@/lib/wishlist";
import { AddToCartButton } from "./AddToCartButton";
import { Price } from "./Price";

export function WishlistView() {
  const [message, setMessage] = useState("");
  return (
    <>
      <p role="status" className="sr-only">
        {message}
      </p>
      <WishlistBody onMessage={setMessage} />
    </>
  );
}

function WishlistBody({ onMessage }: { onMessage: (m: string) => void }) {
  const wishlist = useWishlist();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const books = (wishlist ?? []).map(findBook).filter((b): b is Book => !!b);

  const heading = (
    <h1 ref={headingRef} tabIndex={-1} className="text-[length:var(--text-h1)] text-slate-ink outline-none">
      Your <em>wishlist</em>
    </h1>
  );

  if (!wishlist) {
    return (
      <div className="page-hero wrap pb-24 pt-14 md:pt-20">
        {heading}
        <div className="mt-10 h-40 rounded-3xl border border-rule bg-chalk/60" aria-hidden="true" />
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="page-hero wrap pb-24 pt-14 md:pt-20">
        {heading}
        <div className="mt-10 flex flex-col items-start gap-6 rounded-3xl border border-rule bg-chalk p-8 md:p-12">
          <span className="grid size-14 place-items-center rounded-full bg-flame/20 text-amber">
            <IconHeart aria-hidden="true" size={28} stroke={1.75} />
          </span>
          <div>
            <h2 className="text-h3 text-slate-ink">Nothing saved yet</h2>
            <p className="mt-2 max-w-md text-stone-muted">Tap the heart on any book to save it here for later.</p>
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
        {books.length} saved {books.length === 1 ? "book" : "books"}. Saved on this device.
      </p>
      <ul className="mt-10 grid gap-4">
        {books.map((book) => (
          <li key={book.slug} className="flex gap-4 rounded-3xl border border-rule bg-chalk p-4 sm:gap-6 sm:p-6">
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
            <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-amber sm:text-sm">{book.audience}</p>
                <h2 className="mt-1 text-lg leading-snug text-slate-ink sm:text-xl">
                  <Link href={`/books/${book.slug}`} className="hover:underline hover:decoration-flame hover:underline-offset-4">
                    {book.title}
                  </Link>
                </h2>
                <p className="mt-1 text-sm text-stone-muted">
                  E-book · <Price prices={book.prices} className="font-semibold text-slate-ink" />
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <AddToCartButton slug={book.slug} title={book.title} />
                <button
                  type="button"
                  onClick={() => {
                    removeFromWishlist(book.slug);
                    onMessage(`${book.title} removed from your wishlist.`);
                    headingRef.current?.focus();
                  }}
                  className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-stone-muted hover:text-slate-ink"
                >
                  <IconTrash aria-hidden="true" size={18} stroke={1.75} />
                  Remove from wishlist<span className="sr-only">: {book.title}</span>
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <Link href="/books" className="link mt-10 inline-block font-semibold text-slate-ink">
        Keep browsing
      </Link>
    </div>
  );
}
