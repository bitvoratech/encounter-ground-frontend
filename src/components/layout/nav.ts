// Primary navigation. Give and the account link sit beside the nav in the
// header rather than in this list. An item with `children` is a dropdown.

export type NavLink = { href: string; label: string };
export type NavGroup = { label: string; children: NavLink[] };
export type NavItem = NavLink | NavGroup;

export const isGroup = (item: NavItem): item is NavGroup => "children" in item;

export const nav: NavItem[] = [
  { href: "/about", label: "Who we are" },
  { href: "/events", label: "Programmes" },
  { href: "/events/yada-intimacy-conference-2026", label: "YADA 2026" },
  {
    label: "Media",
    children: [
      { href: "/media", label: "Streams & replays" },
      { href: "/books", label: "Bookstore" },
      { href: "/self-test", label: "Self-tests" },
      { href: "/blog", label: "Blog" },
    ],
  },
  { href: "/contact", label: "Contact" },
];

/** Every page link, with dropdowns flattened (for the footer). */
export const navLinks: NavLink[] = nav.flatMap((item) => (isGroup(item) ? item.children : [item]));
