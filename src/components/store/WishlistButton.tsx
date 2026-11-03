"use client";

import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { useState } from "react";
import { toggleWishlist, useWishlist } from "@/lib/wishlist";

/**
 * Heart toggle that saves a book to the wishlist. `overlay` sits on a cover's corner;
 * `labelled` is a full button with text, for the book page.
 */
export function WishlistButton({
  slug,
  title,
  variant = "overlay",
}: {
  slug: string;
  title: string;
  variant?: "overlay" | "labelled";
}) {
  const wishlist = useWishlist();
  const saved = wishlist?.includes(slug) ?? false;
  const [message, setMessage] = useState("");
  const Icon = saved ? IconHeartFilled : IconHeart;

  const toggle = () => {
    toggleWishlist(slug);
    setMessage(saved ? `${title} removed from your wishlist.` : `${title} saved to your wishlist.`);
  };

  return (
    <>
      {variant === "overlay" ? (
        <button
          type="button"
          onClick={toggle}
          disabled={!wishlist}
          aria-pressed={saved}
          aria-label={`Save ${title} to wishlist`}
          className="grid size-10 place-items-center rounded-full bg-chalk/90 text-slate-ink shadow-md backdrop-blur transition-transform hover:scale-110 aria-pressed:text-[#c2410c]"
        >
          <Icon aria-hidden="true" size={20} stroke={1.75} />
        </button>
      ) : (
        <button
          type="button"
          onClick={toggle}
          disabled={!wishlist}
          aria-pressed={saved}
          className="btn btn-quiet text-slate-ink aria-pressed:border-[#c2410c] aria-pressed:text-[#c2410c]"
        >
          <Icon aria-hidden="true" size={20} stroke={1.75} />
          {saved ? "Saved to wishlist" : "Save to wishlist"}
        </button>
      )}
      <span role="status" className="sr-only">
        {message}
      </span>
    </>
  );
}
