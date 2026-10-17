"use client";

import { IconShoppingBag } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";

const storePaths = ["/books", "/cart", "/checkout"];

/**
 * The header's cart icon with a count. Shown on bookstore pages, or anywhere once the cart
 * has something in it, so the ministry pages stay uncluttered.
 */
export function CartLink({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const cart = useCart();
  const count = cart?.length ?? 0;
  const onStore = storePaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (!onStore && count === 0) return null;

  return (
    <Link
      href="/cart"
      aria-current={pathname === "/cart" ? "page" : undefined}
      aria-label={count ? `Cart, ${count} ${count === 1 ? "book" : "books"}` : "Cart, empty"}
      className={`relative grid size-11 place-items-center rounded-full border border-slate/30 text-slate-ink transition-colors hover:border-slate aria-[current=page]:border-slate aria-[current=page]:bg-slate aria-[current=page]:text-chalk ${className}`}
    >
      <IconShoppingBag aria-hidden="true" size={20} stroke={1.75} />
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-flame px-1 text-xs font-bold leading-5 text-slate-ink"
        >
          {count}
        </span>
      )}
    </Link>
  );
}
