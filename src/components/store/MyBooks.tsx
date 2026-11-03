"use client";

import { IconBook, IconBooks } from "@tabler/icons-react";
import Link from "next/link";
import { useLibrary } from "@/lib/library";
import { BookCover } from "./BookCover";

/** The e-books this member owns, each opening in the reader where they stopped. */
export function MyBooks() {
  const library = useLibrary();

  if (library.status === "loading" || library.status === "signed-out") {
    return <div className="mt-10 h-48 rounded-3xl border border-rule bg-chalk/60" aria-hidden="true" />;
  }

  if (library.status === "error") {
    return (
      <p role="alert" className="mt-10 font-semibold text-amber">
        Your books can’t be loaded right now. Please refresh in a moment.
      </p>
    );
  }

  if (library.books.length === 0) {
    return (
      <div className="mt-10 flex flex-col items-start gap-6 rounded-3xl border border-rule bg-chalk p-8 md:p-12">
        <span className="grid size-14 place-items-center rounded-full bg-flame/20 text-amber">
          <IconBooks aria-hidden="true" size={28} stroke={1.75} />
        </span>
        <div>
          <h2 className="text-h3 text-slate-ink">No e-books yet</h2>
          <p className="mt-2 max-w-md text-stone-muted">E-books you buy in the bookstore appear here, ready to read on any device.</p>
        </div>
        <Link href="/books" className="btn btn-fire">
          Visit the bookstore
        </Link>
      </div>
    );
  }

  return (
    <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-8 md:grid-cols-3 lg:grid-cols-4">
      {library.books.map((book) => {
        const started = !!book.last_read_at && book.last_page > 1;
        return (
          <li key={book.slug} className="flex flex-col">
            <Link href={`/read/${book.slug}`} tabIndex={-1} aria-hidden="true">
              <BookCover
                cover={book.cover_image_url}
                sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 45vw"
                className="w-full rounded-xl shadow-[0_18px_40px_-20px_rgb(29_38_48/0.55)]"
              />
            </Link>
            {book.audience && <p className="mt-4 text-xs font-semibold text-amber sm:text-sm">{book.audience}</p>}
            <h2 className="mt-1 text-lg leading-snug text-slate-ink sm:text-xl">{book.title}</h2>
            {book.pages_ready ? (
              <>
                {started && book.page_count && (
                  <p className="mt-1 text-sm text-stone-muted">
                    Page {book.last_page} of {book.page_count}
                  </p>
                )}
                <Link href={`/read/${book.slug}`} className="btn btn-fire mt-3 min-h-10 self-start px-4 py-2 text-sm">
                  <IconBook aria-hidden="true" size={18} stroke={1.75} />
                  {started ? "Continue reading" : "Start reading"}
                  <span className="sr-only">: {book.title}</span>
                </Link>
              </>
            ) : (
              <p className="mt-3 inline-flex self-start rounded-full border border-rule bg-chalk px-3 py-1 text-sm font-semibold text-stone-muted">
                Being prepared for reading
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
