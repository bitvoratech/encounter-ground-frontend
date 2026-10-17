"use client";

import { IconBooks } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { findBook, type Book } from "@/content/books";
import { useLibrary } from "@/lib/library";
import { paymentsAreSimulated } from "@/lib/store";

/** The e-books this member owns. Until the backend, that is the sample library in this browser. */
export function MyBooks() {
  const library = useLibrary();
  const books = (library ?? []).map(findBook).filter((b): b is Book => !!b);

  if (!library) {
    return <div className="mt-10 h-48 rounded-3xl border border-rule bg-chalk/60" aria-hidden="true" />;
  }

  if (books.length === 0) {
    return (
      <div className="mt-10 flex flex-col items-start gap-6 rounded-3xl border border-rule bg-chalk p-8 md:p-12">
        <span className="grid size-14 place-items-center rounded-full bg-flame/20 text-amber">
          <IconBooks aria-hidden="true" size={28} stroke={1.75} />
        </span>
        <div>
          <h2 className="text-h3 text-slate-ink">No e-books yet</h2>
          <p className="mt-2 max-w-md text-stone-muted">
            E-books you buy in the bookstore appear here, ready to read on any device.
          </p>
        </div>
        <Link href="/books" className="btn btn-fire">
          Visit the bookstore
        </Link>
      </div>
    );
  }

  return (
    <>
      {paymentsAreSimulated && (
        <p className="mt-8 rounded-2xl bg-flame/15 px-4 py-3 text-sm font-semibold text-amber">
          Test mode: these are books from sample purchases in this browser.
        </p>
      )}
      <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-8 md:grid-cols-3 lg:grid-cols-4">
        {books.map((book) => (
          <li key={book.slug} className="flex flex-col">
            <Image
              src={book.cover}
              alt=""
              width={683}
              height={1024}
              sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 45vw"
              className="aspect-[2/3] w-full rounded-xl bg-limestone object-cover shadow-[0_18px_40px_-20px_rgb(29_38_48/0.55)]"
            />
            <p className="mt-4 text-xs font-semibold text-amber sm:text-sm">{book.audience}</p>
            <h2 className="mt-1 text-lg leading-snug text-slate-ink sm:text-xl">{book.title}</h2>
            <p className="mt-3 inline-flex self-start rounded-full border border-rule bg-chalk px-3 py-1 text-sm font-semibold text-stone-muted">
              Reader opening soon
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
