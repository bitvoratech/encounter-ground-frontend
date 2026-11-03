import { IconPhoto, IconPlus } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge } from "@/components/admin/fields";
import { card, EmptyState, PageHeader } from "@/components/admin/ui";
import { adminGet, getStaff } from "@/lib/admin";
import { formatPrice } from "@/lib/currency";
import type { AdminBook } from "@/types/admin";

export const metadata: Metadata = { title: "Books" };

const order = ["NGN", "USD", "CAD"] as const;

export default async function AdminBooksPage() {
  const staff = await getStaff();
  if (staff.status !== "staff") return null;
  const books = await adminGet<AdminBook[]>(staff.token, "/books");

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader title="Books">
          The e-books on the shop. Drafts and archived books are hidden from the website.
        </PageHeader>
        <Link href="/admin/books/new" className="btn btn-fire min-h-11 px-5 py-2">
          <IconPlus aria-hidden="true" size={18} stroke={2} />
          Add a book
        </Link>
      </div>

      {books.length === 0 ? (
        <EmptyState title="No books yet">Add the first book to put it on the shop.</EmptyState>
      ) : (
        <ul className="grid gap-4">
          {books.map((b) => (
            <li key={b.id}>
              <Link
                href={`/admin/books/${b.id}`}
                className={`${card} flex items-center gap-4 transition-colors hover:border-slate md:gap-5`}
              >
                <span className="grid aspect-[2/3] w-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-limestone">
                  {b.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- uploaded covers live on Supabase Storage
                    <img src={b.cover_image_url} alt="" className="size-full object-cover" />
                  ) : (
                    <IconPhoto aria-hidden="true" size={22} stroke={1.5} className="text-stone" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-display text-xl text-slate-ink">{b.title}</span>
                    <StatusBadge status={b.status} />
                  </span>
                  {(b.subtitle || b.audience) && (
                    <span className="mt-0.5 block truncate text-sm text-stone-muted">{b.audience ?? b.subtitle}</span>
                  )}
                  <span className="mt-1 block text-sm text-slate">
                    {order
                      .filter((c) => b.prices[c] !== undefined)
                      .map((c) => formatPrice(b.prices[c]!, c))
                      .join(" · ") || "No price yet"}
                  </span>
                </span>
                <span className="hidden shrink-0 text-right text-sm text-stone-muted sm:block">
                  {b.owners === 1 ? "1 owner" : `${b.owners} owners`}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
