import { IconArrowLeft, IconDeviceLaptop } from "@tabler/icons-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/store/AddToCartButton";
import { CurrencySwitcher } from "@/components/store/CurrencySwitcher";
import { Price } from "@/components/store/Price";
import { books, findBook, samplePrices } from "@/content/books";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export function generateStaticParams() {
  return books.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/books/[slug]">): Promise<Metadata> {
  const book = findBook((await params).slug);
  if (!book) return {};
  // Two editions share a title, so tell them apart by who they are for.
  const shared = books.some((b) => b.slug !== book.slug && b.title === book.title);
  return {
    title: shared ? `${book.title} (${book.audience})` : book.title,
    description: book.description ?? book.subtitle ?? `${book.title}, an e-book by Toyin Bello. Read it on any device.`,
  };
}

export default async function BookPage({ params }: PageProps<"/books/[slug]">) {
  const book = findBook((await params).slug);
  if (!book) notFound();
  const more = books.filter((b) => b.slug !== book.slug).slice(0, 4);

  return (
    <>
      <article className="page-hero wrap pb-16 pt-8 md:pb-24 md:pt-12">
        <Link href="/books" className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-muted hover:text-slate-ink">
          <IconArrowLeft aria-hidden="true" size={16} stroke={2} />
          Bookstore
        </Link>

        <div className="mt-8 grid gap-10 md:grid-cols-[2fr_3fr] md:items-start md:gap-16">
          <Image
            src={book.cover}
            alt={`Cover of ${book.title}`}
            width={683}
            height={1024}
            priority
            sizes="(min-width: 768px) 35vw, 16rem"
            className="mx-auto aspect-[2/3] w-full max-w-[16rem] rounded-2xl bg-limestone object-cover shadow-[0_30px_60px_-28px_rgb(29_38_48/0.6)] sm:max-w-xs md:sticky md:top-28 md:max-w-none"
          />

          <div>
            <p className="font-semibold text-amber">{book.audience}</p>
            <h1 className="mt-2 text-[length:var(--text-h1)] text-slate-ink">{book.title}</h1>
            {book.subtitle && <p className="mt-4 max-w-xl text-lede leading-relaxed text-stone-muted">{book.subtitle}</p>}
            <p className="mt-4 text-stone-muted">by Toyin Bello</p>

            {/* Buying panel */}
            <section aria-labelledby="buy-heading" className="mt-10 rounded-3xl border border-rule bg-chalk p-6 md:p-8">
              <h2 id="buy-heading" className="sr-only">
                Buy the e-book
              </h2>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-stone-muted">E-book</p>
                  <Price prices={book.prices} className="mt-1 font-display text-[2.5rem] leading-none text-slate-ink" />
                </div>
                <CurrencySwitcher />
              </div>
              <p className="mt-5 flex items-start gap-3 text-stone-muted">
                <IconDeviceLaptop aria-hidden="true" size={22} stroke={1.75} className="mt-0.5 shrink-0 text-amber" />
                Read it here on your phone, tablet or computer. It stays in My books, in your account.
              </p>
              <div className="mt-6">
                <AddToCartButton slug={book.slug} title={book.title} />
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-rule pt-6">
                <a href={book.amazonUrl} {...external} className="btn btn-quiet text-slate-ink">
                  Paperback on Amazon
                </a>
                {samplePrices && <p className="text-sm text-stone-muted">Sample price: final prices to come.</p>}
              </div>
            </section>

            {book.description && (
              <section aria-labelledby="about-heading" className="mt-12">
                <h2 id="about-heading" className="text-h3 text-slate-ink">
                  About this book
                </h2>
                <p className="prose-eg measure mt-4 text-slate-ink/90">{book.description}</p>
              </section>
            )}

            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-rule pt-8 sm:grid-cols-3">
              <div>
                <dt className="text-sm text-stone-muted">Format</dt>
                <dd className="mt-1 font-semibold text-slate-ink">E-book, read online</dd>
              </div>
              <div>
                <dt className="text-sm text-stone-muted">For</dt>
                <dd className="mt-1 font-semibold text-slate-ink">{book.audience}</dd>
              </div>
              {book.pageCount && (
                <div>
                  <dt className="text-sm text-stone-muted">Pages</dt>
                  <dd className="mt-1 font-semibold text-slate-ink">{book.pageCount}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </article>

      <section aria-labelledby="more-heading" className="border-t border-rule bg-chalk">
        <div className="wrap py-14 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="more-heading" className="text-[length:var(--text-h2)] text-slate-ink">
              More books
            </h2>
            <Link href="/books" className="link font-semibold text-slate-ink">
              All books
            </Link>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-8 lg:grid-cols-4">
            {more.map((b) => (
              <li key={b.slug}>
                <Link href={`/books/${b.slug}`} className="group block">
                  <Image
                    src={b.cover}
                    alt=""
                    width={683}
                    height={1024}
                    sizes="(min-width: 1024px) 22vw, 45vw"
                    className="aspect-[2/3] w-full rounded-xl bg-limestone object-cover shadow-[0_18px_40px_-20px_rgb(29_38_48/0.55)] transition-transform duration-300 group-hover:-translate-y-1"
                  />
                  <p className="mt-4 text-xs font-semibold text-amber sm:text-sm">{b.audience}</p>
                  <p className="mt-1 font-display text-lg leading-snug text-slate-ink group-hover:underline group-hover:decoration-flame group-hover:underline-offset-4 sm:text-xl">
                    {b.title}
                  </p>
                  <Price prices={b.prices} className="mt-1 text-sm font-semibold text-slate-ink" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
