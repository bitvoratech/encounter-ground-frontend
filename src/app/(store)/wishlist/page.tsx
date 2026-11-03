import type { Metadata } from "next";
import { WishlistView } from "@/components/store/WishlistView";

export const metadata: Metadata = { title: "Your wishlist", robots: { index: false } };

export default function WishlistPage() {
  return <WishlistView />;
}
