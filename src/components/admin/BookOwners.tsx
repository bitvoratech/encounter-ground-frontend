"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { giveBook, takeBackBook } from "@/lib/adminActions";
import type { BookOwner } from "@/types/admin";
import { errorText, TextField } from "./fields";
import { card, fullDate } from "./ui";

/** Who has the book. The team can give it to someone (a gift, a replacement, or to test the reader). */
export function BookOwners({ bookId, title, owners }: { bookId: string; title: string; owners: BookOwner[] }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  return (
    <section aria-labelledby="book-owners" className={`${card} grid gap-4`}>
      <div>
        <h2 id="book-owners" className="font-sans text-lg font-bold text-slate-ink">
          Who has this book
        </h2>
        <p className="mt-1 text-sm text-stone-muted">
          Buyers are added automatically once payments are live. You can also give the book to someone with an account.
        </p>
      </div>
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setPending(true);
          setError("");
          setSaved("");
          try {
            await giveBook(bookId, email.trim());
            setSaved(`Given to ${email.trim()}.`);
            setEmail("");
            router.refresh();
          } catch (err) {
            setError(errorText(err));
          } finally {
            setPending(false);
          }
        }}
      >
        <TextField className="min-w-64 flex-1" label="Give the book to (email)" type="email" required value={email} onChange={setEmail} />
        <button type="submit" disabled={pending || !email.trim()} className="btn btn-fire min-h-11 px-5 py-2">
          {pending ? "Giving…" : "Give book"}
        </button>
      </form>
      {error && (
        <p role="alert" className="text-sm font-semibold text-amber">
          {error}
        </p>
      )}
      {saved && !error && (
        <p role="status" className="text-sm font-semibold text-slate">
          {saved}
        </p>
      )}
      {owners.length > 0 && (
        <ul className="divide-y divide-rule rounded-2xl border border-rule">
          {owners.map((o) => (
            <li key={o.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold text-slate-ink">{o.full_name || o.email}</span>
                <span className="block truncate text-sm text-stone-muted">
                  {o.email} · {o.purchased ? "Bought" : "Given"} {fullDate(o.granted_at)}
                  {o.last_read_at ? ` · reached page ${o.last_page}` : ""}
                </span>
              </span>
              {!o.purchased && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!window.confirm(`Take “${title}” back from ${o.full_name || o.email}?`)) return;
                    setError("");
                    try {
                      await takeBackBook(bookId, o.id);
                      router.refresh();
                    } catch (err) {
                      setError(errorText(err));
                    }
                  }}
                  className="text-sm font-semibold text-stone-muted underline-offset-4 hover:text-slate-ink hover:underline"
                >
                  Take back
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
