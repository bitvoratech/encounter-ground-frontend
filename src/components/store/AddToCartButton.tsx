"use client";

import { IconCheck, IconShoppingBag } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { addToCart, removeFromCart, useCart } from "@/lib/cart";

/** Add an e-book to the cart; once it is in, offer the way to the cart instead. */
export function AddToCartButton({ slug, title }: { slug: string; title: string }) {
  const cart = useCart();
  const inCart = cart?.includes(slug) ?? false;
  const [message, setMessage] = useState("");
  // Which control should take focus after the swap: the visitor's button disappears.
  const [focusNext, setFocusNext] = useState<"cart" | "add" | null>(null);
  const goToCartRef = useRef<HTMLAnchorElement>(null);
  const addRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (focusNext === "cart" && inCart) goToCartRef.current?.focus();
    if (focusNext === "add" && !inCart) addRef.current?.focus();
  }, [focusNext, inCart]);

  return (
    <div>
      {inCart ? (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <p className="inline-flex items-center gap-2 font-semibold text-slate-ink">
            <IconCheck aria-hidden="true" size={20} stroke={2} className="text-amber" />
            In your cart
          </p>
          <Link ref={goToCartRef} href="/cart" className="btn btn-fire">
            Go to cart
          </Link>
          <button
            type="button"
            onClick={() => {
              removeFromCart(slug);
              setFocusNext("add");
              setMessage(`${title} removed from your cart.`);
            }}
            className="text-sm font-semibold text-stone-muted underline-offset-4 hover:text-slate-ink hover:underline"
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          ref={addRef}
          type="button"
          disabled={!cart}
          onClick={() => {
            addToCart(slug);
            setFocusNext("cart");
            setMessage(`${title} added to your cart.`);
          }}
          className="btn btn-fire w-full sm:w-auto"
        >
          <IconShoppingBag aria-hidden="true" size={20} stroke={1.75} />
          Add to cart
        </button>
      )}
      <p role="status" className="sr-only">
        {message}
      </p>
    </div>
  );
}
