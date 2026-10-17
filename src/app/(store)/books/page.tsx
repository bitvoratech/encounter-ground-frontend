import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CurrencySwitcher } from "@/components/store/CurrencySwitcher";
import { Price } from "@/components/store/Price";
import { authorStoreUrl, books, samplePrices } from "@/content/books";

export const metadata: Metadata = {
  title: "Bookstore",
  description:
    "E-books by Toyin Bello on intimacy with God, prayer and identity, for adults, pre-teens and teenagers. Read on any device.",
};

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export default function BooksPage() {
  return (
    <>
      <header className="page-hero wrap pb-12 pt-14 md:pt-20">
        <p className="font-semibold text-amber">Bookstore</p>
        <h1 className="mt-2 text-[length:var(--text-h1)] text-slate-ink">Books by Toyin Bello</h1>
        <p className="mt-5 max-w-[36rem] text-lede leading-relaxed text-stone-muted">
          Devotionals and journals on intimacy with God, prayer and identity, for
          adults, pre-teens and teenagers. Buy the e-book and read it here, on any device.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <CurrencySwitcher />
          {samplePrices && <p className="text-sm text-stone-muted">Sample prices: final prices to come.</p>}
        </div>
      </header>

      <section aria-label="Books" className="border-t border-rule bg-chalk">
        <ul className="wrap grid grid-cols-2 gap-x-4 gap-y-10 py-12 sm:gap-x-8 sm:gap-y-14 md:py-20 lg:grid-cols-3">
          {books.map((book) => (
            <li key={book.slug} className="flex flex-col">
              <Link href={`/books/${book.slug}`} className="group block" tabIndex={-1} aria-hidden="true">
                <Image
                  src={book.cover}
                  alt=""
                  width={683}
                  height={1024}
                  sizes="(min-width: 1024px) 30vw, 45vw"
                  className="aspect-[2/3] w-full rounded-xl bg-limestone object-cover shadow-[0_18px_40px_-20px_rgb(29_38_48/0.55)] transition-transform duration-300 group-hover:-translate-y-1 sm:rounded-2xl"
                />
              </Link>
              <p className="mt-4 text-xs font-semibold text-amber sm:mt-5 sm:text-sm">{book.audience}</p>
              <h2 className="mt-1 text-lg leading-snug text-slate-ink sm:text-h3">
                <Link href={`/books/${book.slug}`} className="hover:underline hover:decoration-flame hover:underline-offset-4">
                  {book.title}
                </Link>
              </h2>
              {book.subtitle && <p className="mt-1.5 text-sm text-stone-muted sm:mt-2 sm:text-base">{book.subtitle}</p>}
              <div className="mt-auto pt-4 sm:pt-5">
                <p className="text-sm text-stone-muted">
                  E-book <Price prices={book.prices} className="ml-1 text-base font-semibold text-slate-ink sm:text-lg" />
                </p>
                <Link
                  href={`/books/${book.slug}`}
                  className="btn btn-fire mt-3 w-full px-3 text-sm sm:w-auto sm:px-[1.4rem] sm:text-base"
                >
                  View book
                  <span className="sr-only">: {book.title}{book.subtitle ? `, ${book.audience}` : ""}</span>
                </Link>
                <a href={book.amazonUrl} {...external} className="link mt-3 block text-sm text-stone-muted">
                  Paperback on Amazon
                  <span className="sr-only">: {book.title}</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="how-heading">
        <div className="wrap flex flex-col gap-6 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="how-heading" className="text-h3 text-slate-ink md:text-[2rem]">
              Read on this site, on any device
            </h2>
            <p className="mt-2 max-w-xl text-stone-muted">
              E-books bought here live in My books, in your Encounter Ground account. Prefer
              a printed copy? Every paperback is on Amazon.
            </p>
          </div>
          <a href={authorStoreUrl} {...external} className="btn btn-quiet self-start text-slate-ink md:self-auto">
            All paperbacks on Amazon
          </a>
        </div>
      </section>
    </>
  );
}
