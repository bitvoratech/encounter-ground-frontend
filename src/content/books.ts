// Books by Toyin Bello, carried over from the former site's Shop page. The site sells them as
// e-books, read only on the site; paperbacks stay on Amazon. These move to the `books` table
// (admin-editable, with a price per currency) when the bookstore backend is built.

import type { Prices } from "@/lib/currency";

export type Book = {
  slug: string;
  title: string;
  subtitle?: string;
  audience: string;
  cover: string;
  /** E-book price per currency, in minor units (cents, kobo). */
  prices: Prices;
  /** Paperback on Amazon. */
  amazonUrl: string;
  description?: string;
  pageCount?: number;
};

export const authorStoreUrl = "https://www.amazon.com/stores/Toyin-Bello/author/B0C7VPYKPW/allbooks";

// TODO: replace with the ministry's prices. Until then the pages say these are samples.
export const samplePrices = true;
const adultPrice: Prices = { CAD: 1299, USD: 999, NGN: 750000 };
const journalPrice: Prices = { CAD: 999, USD: 799, NGN: 500000 };

export const books: Book[] = [
  {
    slug: "from-servant-to-bride",
    title: "From Servant to Bride",
    audience: "Adults",
    cover: "/images/books/from-servant-to-bride.jpg",
    prices: adultPrice,
    amazonUrl: "https://amzn.eu/d/0bostYPQ",
  },
  {
    slug: "from-bride-to-warrior-bride",
    title: "From Bride to Warrior Bride",
    audience: "Adults",
    cover: "/images/books/from-bride-to-warrior-bride.jpg",
    prices: adultPrice,
    amazonUrl: "https://www.amazon.com/Bride-Warrior-TOYIN-BELLO/dp/1738231100",
  },
  {
    slug: "from-bride-to-beloved",
    title: "From Bride to Beloved",
    audience: "Adults",
    cover: "/images/books/from-bride-to-beloved-cover.jpg",
    prices: adultPrice,
    // The old shop linked this title to the author store rather than a product page.
    amazonUrl: authorStoreUrl,
  },
  {
    slug: "whispers-the-journal",
    title: "Whispers: The Journal",
    subtitle: "Living out my scroll each day guided by His gentle whispers",
    audience: "Journal",
    cover: "/images/books/whispers-the-journal.jpg",
    prices: journalPrice,
    // TODO: swap for the product link once the ministry shares it.
    amazonUrl: authorStoreUrl,
  },
  {
    slug: "burn",
    title: "Burn",
    subtitle: "A Devotional Journal to Guide Pre-Teens and Teenagers on How to Pray",
    audience: "Pre-teens and teens",
    cover: "/images/books/burn.jpg",
    prices: journalPrice,
    amazonUrl: "https://amzn.eu/d/05IBNF9F",
  },
  {
    slug: "who-i-am-becoming-girls",
    title: "Who I Am Becoming",
    subtitle: "A Devo-Journal on Identity for Teenage Girls: Building a Daily Connection with God",
    audience: "Teenage girls",
    cover: "/images/books/who-i-am-becoming-girls.jpg",
    prices: journalPrice,
    amazonUrl: "https://amzn.eu/d/0dxXTtJ2",
  },
  {
    slug: "who-i-am-becoming-guys",
    title: "Who I Am Becoming",
    subtitle: "A Devo-Journal on Identity for Teenage Guys: Building a Daily Connection with God",
    audience: "Teenage guys",
    cover: "/images/books/who-i-am-becoming-guys.jpg",
    prices: journalPrice,
    amazonUrl: "https://amzn.eu/d/04uPCtq4",
  },
];

export const findBook = (slug: string) => books.find((b) => b.slug === slug);
