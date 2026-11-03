"use client";

import { IconHeart } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWishlist } from "@/lib/wishlist";

/** Header heart with a count. Shown once something is saved, like the cart icon. */
export function WishlistLink() {
  const pathname = usePathname();
  const count = useWishlist()?.length ?? 0;
  if (count === 0) return null;

  return (
    <Link
      href="/wishlist"
      aria-current={pathname === "/wishlist" ? "page" : undefined}
      aria-label={`Wishlist, ${count} ${count === 1 ? "book" : "books"}`}
      className="relative grid size-11 place-items-center rounded-full border border-slate/30 text-slate-ink transition-colors hover:border-slate aria-[current=page]:border-slate aria-[current=page]:bg-slate aria-[current=page]:text-chalk"
    >
      <IconHeart aria-hidden="true" size={20} stroke={1.75} />
      <span
        aria-hidden="true"
        className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-flame px-1 text-xs font-bold leading-5 text-slate-ink"
      >
        {count}
      </span>
    </Link>
  );
}
