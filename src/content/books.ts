// Books by Toyin Bello, carried over from the former site's Shop page. Until the
// bookstore (books table + Paystack checkout) ships, "Buy" goes to Amazon as before.

export type Book = {
  slug: string;
  title: string;
  subtitle?: string;
  audience: string;
  cover: string;
  buyUrl: string;
};

export const authorStoreUrl = "https://www.amazon.com/stores/Toyin-Bello/author/B0C7VPYKPW/allbooks";

export const books: Book[] = [
  {
    slug: "from-servant-to-bride",
    title: "From Servant to Bride",
    audience: "Adults",
    cover: "/images/books/from-servant-to-bride.jpg",
    buyUrl: "https://amzn.eu/d/0bostYPQ",
  },
  {
    slug: "from-bride-to-warrior-bride",
    title: "From Bride to Warrior Bride",
    audience: "Adults",
    cover: "/images/books/from-bride-to-warrior-bride.jpg",
    buyUrl: "https://www.amazon.com/Bride-Warrior-TOYIN-BELLO/dp/1738231100",
  },
  {
    slug: "from-bride-to-beloved",
    title: "From Bride to Beloved",
    audience: "Adults",
    cover: "/images/books/from-bride-to-beloved.jpg",
    // The old shop linked this title to the author store rather than a product page.
    buyUrl: authorStoreUrl,
  },
  {
    slug: "burn",
    title: "Burn",
    subtitle: "A Devotional Journal to Guide Pre-Teens and Teenagers on How to Pray",
    audience: "Pre-teens and teens",
    cover: "/images/books/burn.jpg",
    buyUrl: "https://amzn.eu/d/05IBNF9F",
  },
  {
    slug: "who-i-am-becoming-girls",
    title: "Who I Am Becoming",
    subtitle: "A Devo-Journal on Identity for Teenage Girls: Building a Daily Connection with God",
    audience: "Teenage girls",
    cover: "/images/books/who-i-am-becoming-girls.jpg",
    buyUrl: "https://amzn.eu/d/0dxXTtJ2",
  },
  {
    slug: "who-i-am-becoming-guys",
    title: "Who I Am Becoming",
    subtitle: "A Devo-Journal on Identity for Teenage Guys: Building a Daily Connection with God",
    audience: "Teenage guys",
    cover: "/images/books/who-i-am-becoming-guys.jpg",
    buyUrl: "https://amzn.eu/d/04uPCtq4",
  },
];
