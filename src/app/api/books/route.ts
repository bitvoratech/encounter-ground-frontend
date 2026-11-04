import { NextResponse } from "next/server";
import { fetchBooks } from "@/lib/books";

/**
 * The bookstore catalogue for the browser (cart, wishlist, checkout), fetched here on the server
 * just as the store pages fetch it. Same-origin, so it can't be blocked by the API's CORS
 * settings or a mixed-content API address: if the store pages show books, so does the cart.
 */
export async function GET() {
  try {
    return NextResponse.json(await fetchBooks({ cache: "no-store" }));
  } catch (err) {
    console.error("Books unavailable:", err);
    return NextResponse.json({ error: "The bookstore can't be reached" }, { status: 502 });
  }
}
