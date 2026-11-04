import type { Currency } from "./currency";
import { api, ApiError } from "./api";

// The bookstore's catalogue, from the API (GET /books). Server pages fetch it per request
// (like the classes) so a build never depends on the API; client components share one copy
// through useBooks() in ./catalogue.

/** E-book prices in minor units (cents, kobo). A currency left out isn't sold in. */
export type BookPrices = Partial<Record<Currency, number>>;

export type Book = {
  slug: string;
  title: string;
  subtitle: string | null;
  author: string;
  /** Who it's for, e.g. "Adults", "Teenage girls". */
  audience: string | null;
  cover: string | null;
  prices: BookPrices;
  amazonUrl: string | null;
  description: string | null;
  pageCount: number | null;
};

type ApiBook = {
  slug: string;
  title: string;
  subtitle: string | null;
  author: string | null;
  audience: string | null;
  description: string | null;
  cover_image_url: string | null;
  amazon_url: string | null;
  page_count: number | null;
  prices: BookPrices;
};

export const toBook = (b: ApiBook): Book => ({
  slug: b.slug,
  title: b.title,
  subtitle: b.subtitle,
  author: b.author || "Toyin Bello",
  audience: b.audience,
  cover: b.cover_image_url,
  prices: b.prices ?? {},
  amazonUrl: b.amazon_url,
  description: b.description,
  pageCount: b.page_count,
});

export async function fetchBooks(init?: RequestInit) {
  return (await api<ApiBook[]>("/books", init)).map(toBook);
}

export async function fetchBook(slug: string, init?: RequestInit) {
  return toBook(await api<ApiBook>(`/books/${encodeURIComponent(slug)}`, init));
}

export const findBook = (books: Book[] | "unavailable" | null | undefined, slug: string) =>
  Array.isArray(books) ? books.find((b) => b.slug === slug) : undefined;

/** For server pages: the catalogue, or "unavailable" when the API can't be reached. */
export async function loadBooks(): Promise<Book[] | "unavailable"> {
  try {
    return await fetchBooks({ cache: "no-store" });
  } catch (err) {
    console.error("Books unavailable:", err);
    return "unavailable";
  }
}

/** For server pages: one book, "missing" (send a 404) or "unavailable". */
export async function loadBook(slug: string): Promise<Book | "missing" | "unavailable"> {
  try {
    return await fetchBook(slug, { cache: "no-store" });
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return "missing";
    console.error(`Book "${slug}" unavailable:`, err);
    return "unavailable";
  }
}
