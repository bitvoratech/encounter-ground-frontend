"use client";

import { IconArrowRight, IconBook, IconBooks } from "@tabler/icons-react";
import Link from "next/link";
import { card, panel } from "@/components/admin/ui";
import { useLibrary } from "@/lib/library";
import { BookCover } from "./BookCover";

/** The e-books this member owns, each opening in the reader where they stopped. */
export function MyBooks() {
  const library = useLibrary();

  if (library.status === "loading" || library.status === "signed-out") {
    return (
      <div aria-hidden="true" className="grid animate-pulse grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="aspect-[3/5] rounded-2xl bg-rule/40" />
        ))}
      </div>
    );
  }

  if (library.status === "error") {
    return (
      <p role="alert" className="rounded-xl border border-flame/50 bg-flame/10 px-4 py-3 font-semibold text-slate-ink">
        Your books can’t be loaded right now. Please refresh in a moment.
      </p>
    );
  }

  if (library.books.length === 0) {
    return (
      <div className={`${card} flex flex-col items-center border-dashed py-12 text-center md:py-14`}>
        <span className="grid size-14 place-items-center rounded-2xl bg-flame/15 text-amber">
          <IconBooks aria-hidden="true" size={28} stroke={1.75} />
        </span>
        <h2 className="mt-5 font-display text-2xl text-slate-ink">No e-books yet</h2>
        <p className="mx-auto mt-2 max-w-md text-stone-muted">E-books you buy in the bookstore appear here, ready to read on any device.</p>
        <Link href="/books" className="btn btn-fire mt-6">
          Visit the bookstore
          <IconArrowRight aria-hidden="true" size={18} stroke={2} />
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
      {library.books.map((book) => {
        const started = !!book.last_read_at && book.last_page > 1;
        return (
          <li key={book.slug} className={`${panel} flex flex-col p-3 sm:p-4`}>
            <Link href={`/read/${book.slug}`} tabIndex={-1} aria-hidden="true" className="block rounded-lg bg-limestone p-3 sm:p-5">
              <BookCover
                cover={book.cover_image_url}
                sizes="(min-width: 1280px) 16vw, (min-width: 768px) 24vw, 40vw"
                className="mx-auto w-full max-w-44 rounded-md shadow-[0_18px_40px_-20px_rgb(29_38_48/0.55)]"
              />
            </Link>
            {book.audience && <p className="mt-3 text-xs font-semibold text-amber">{book.audience}</p>}
            <h2 className={`${book.audience ? "mt-0.5" : "mt-3"} font-sans text-base font-bold leading-snug text-slate-ink sm:text-lg`}>
              {book.title}
            </h2>
            {book.pages_ready ? (
              <>
                {started && book.page_count ? (
                  <div className="mt-2">
                    <p className="text-sm text-stone-muted">
                      Page {book.last_page} of {book.page_count}
                    </p>
                    <div aria-hidden="true" className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-rule">
                      <div
                        className="h-full rounded-full bg-flame"
                        style={{ width: `${Math.min(100, Math.round((book.last_page / book.page_count) * 100))}%` }}
                      />
                    </div>
                  </div>
                ) : null}
                <div className="min-h-3.5 flex-1" />
                <Link href={`/read/${book.slug}`} className={`btn ${started ? "btn-fire" : "btn-quiet"} w-full px-3 text-sm`}>
                  <IconBook aria-hidden="true" size={18} stroke={1.75} />
                  {started ? "Continue reading" : "Start reading"}
                  <span className="sr-only">: {book.title}</span>
                </Link>
              </>
            ) : (
              <>
                <div className="min-h-3.5 flex-1" />
                <p className="rounded-lg bg-limestone px-3 py-2 text-center text-sm font-semibold text-stone-muted">
                  Being prepared for reading
                </p>
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}
