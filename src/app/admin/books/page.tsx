import { IconChevronRight, IconPhoto, IconPlus } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge } from "@/components/admin/fields";
import { EmptyState, PageHeader, panel } from "@/components/admin/ui";
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
      <PageHeader
        title="Books"
        actions={
          <Link href="/admin/books/new" className="btn btn-fire px-4 py-2">
            <IconPlus aria-hidden="true" size={18} stroke={2} />
            Add a book
          </Link>
        }
      >
        The e-books on the shop. Drafts and archived books are hidden from the website.
      </PageHeader>

      {books.length === 0 ? (
        <EmptyState title="No books yet">Add the first book to put it on the shop.</EmptyState>
      ) : (
        <ul className={`${panel} divide-y divide-rule/80`}>
          {books.map((b) => (
            <li key={b.id}>
              <Link
                href={`/admin/books/${b.id}`}
                className="group flex items-center gap-4 px-4 py-3.5 transition-colors first:rounded-t-2xl hover:bg-limestone/60 md:gap-5 md:px-6"
              >
                <span className="grid aspect-[2/3] w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-limestone">
                  {b.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- uploaded covers live on Supabase Storage
                    <img src={b.cover_image_url} alt="" className="size-full object-cover" />
                  ) : (
                    <IconPhoto aria-hidden="true" size={22} stroke={1.5} className="text-stone" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-lg font-bold text-slate-ink">{b.title}</span>
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
                <span className="hidden shrink-0 text-right sm:block">
                  <span className="block text-lg font-bold tabular-nums text-slate-ink">{b.owners}</span>
                  <span className="block text-xs text-stone-muted">{b.owners === 1 ? "owner" : "owners"}</span>
                </span>
                <IconChevronRight aria-hidden="true" size={18} stroke={2} className="shrink-0 text-stone transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
