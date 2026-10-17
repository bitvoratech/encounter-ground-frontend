import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MyBooks } from "@/components/store/MyBooks";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "My books", robots: { index: false } };

export default async function MyBooksPage() {
  // The proxy already sends signed-out visitors to sign in; this is the backstop.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/my-books");

  return (
    <div className="wrap pb-24 pt-14 md:pt-20">
      <Link href="/dashboard" className="text-sm font-semibold text-stone-muted hover:text-slate-ink">
        ← My dashboard
      </Link>
      <h1 className="mt-4 text-[length:var(--text-h1)] text-slate-ink">My books</h1>
      <p className="mt-3 max-w-xl text-stone-muted">Your e-books, to read on this site on any device.</p>
      <MyBooks />
    </div>
  );
}
