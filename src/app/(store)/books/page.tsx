import type { Metadata } from "next";
import Image from "next/image";
import { authorStoreUrl, books } from "@/content/books";

export const metadata: Metadata = {
  title: "Bookstore",
  description:
    "Books and devotional journals by Toyin Bello on intimacy with God, prayer and identity, for adults, pre-teens and teenagers.",
};

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export default function BooksPage() {
  return (
    <>
      <header className="wrap pb-12 pt-14 md:pt-20">
        <p className="font-semibold text-amber">Bookstore</p>
        <h1 className="mt-2 text-[length:var(--text-h1)] text-slate-ink">Books by Toyin Bello</h1>
        <p className="mt-5 max-w-[36rem] text-lede leading-relaxed text-stone-muted">
          Devotionals and journals on intimacy with God, prayer and identity, for
          adults, pre-teens and teenagers.
        </p>
      </header>

      <section aria-label="Books" className="border-t border-rule bg-chalk">
        <ul className="wrap grid gap-x-8 gap-y-14 py-14 sm:grid-cols-2 lg:grid-cols-3 md:py-20">
          {books.map((book) => (
            <li key={book.slug} className="flex flex-col">
              <a href={book.buyUrl} {...external} className="group block" tabIndex={-1} aria-hidden="true">
                <Image
                  src={book.cover}
                  alt=""
                  width={683}
                  height={1024}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  className="aspect-[2/3] w-full rounded-2xl bg-limestone object-cover shadow-[0_18px_40px_-20px_rgb(29_38_48/0.55)] transition-transform duration-300 group-hover:-translate-y-1"
                />
              </a>
              <p className="mt-5 text-sm font-semibold text-amber">{book.audience}</p>
              <h2 className="mt-1 text-h3 text-slate-ink">{book.title}</h2>
              {book.subtitle && <p className="mt-2 text-stone-muted">{book.subtitle}</p>}
              <div className="mt-auto pt-5">
                <a href={book.buyUrl} {...external} className="btn btn-fire">
                  Buy on Amazon
                  <span className="sr-only">: {book.title}{book.subtitle ? `, ${book.audience}` : ""}</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="soon-heading">
        <div className="wrap flex flex-col gap-6 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="soon-heading" className="text-h3 text-slate-ink md:text-[2rem]">
              Buying straight from this site is coming
            </h2>
            <p className="mt-2 max-w-xl text-stone-muted">
              Soon you’ll be able to pay in naira and read e-books in your account. Until
              then, every title is on Amazon.
            </p>
          </div>
          <a href={authorStoreUrl} {...external} className="btn btn-quiet self-start text-slate-ink md:self-auto">
            All books on Amazon
          </a>
        </div>
      </section>
    </>
  );
}
