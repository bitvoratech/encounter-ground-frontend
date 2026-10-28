import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CurrencySwitcher } from "@/components/store/CurrencySwitcher";
import { Price } from "@/components/store/Price";
import { WishlistButton } from "@/components/store/WishlistButton";
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
        <ul className="wrap grid grid-cols-2 gap-x-4 gap-y-10 py-12 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 md:py-16 lg:grid-cols-5">
          {books.map((book) => (
            <li key={book.slug} className="flex flex-col">
              <div className="relative">
                <Link href={`/books/${book.slug}`} className="group block" tabIndex={-1} aria-hidden="true">
                  <Image
                    src={book.cover}
                    alt=""
                    width={683}
                    height={1024}
                    sizes="(min-width: 1024px) 17vw, (min-width: 768px) 22vw, (min-width: 640px) 30vw, 45vw"
                    className="aspect-[2/3] w-full rounded-xl bg-limestone object-cover shadow-[0_14px_30px_-18px_rgb(29_38_48/0.55)] transition-transform duration-300 group-hover:-translate-y-1"
                  />
                </Link>
                <div className="absolute right-2 top-2">
                  <WishlistButton slug={book.slug} title={book.title} />
                </div>
              </div>
              <p className="mt-3 text-xs font-semibold text-amber">{book.audience}</p>
              <h2 className="mt-1 text-base leading-snug text-slate-ink sm:text-lg">
                <Link href={`/books/${book.slug}`} className="hover:underline hover:decoration-flame hover:underline-offset-4">
                  {book.title}
                </Link>
              </h2>
              {book.subtitle && <p className="mt-1 line-clamp-2 text-xs text-stone-muted sm:text-sm">{book.subtitle}</p>}
              <div className="mt-auto pt-3">
                <p className="text-sm text-stone-muted">
                  E-book <Price prices={book.prices} className="ml-1 font-semibold text-slate-ink" />
                </p>
                <Link
                  href={`/books/${book.slug}`}
                  className="btn btn-fire mt-3 min-h-10 w-full px-3 py-2 text-sm"
                >
                  View book
                  <span className="sr-only">: {book.title}{book.subtitle ? `, ${book.audience}` : ""}</span>
                </Link>
                <a href={book.amazonUrl} {...external} className="link mt-2.5 block text-xs text-stone-muted sm:text-sm">
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
