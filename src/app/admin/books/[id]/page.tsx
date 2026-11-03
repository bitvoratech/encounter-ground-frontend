import type { Metadata } from "next";
import Link from "next/link";
import { BookForm } from "@/components/admin/BookForm";
import { BookOwners } from "@/components/admin/BookOwners";
import { BookReaderPages } from "@/components/admin/BookReaderPages";
import { PageHeader } from "@/components/admin/ui";
import { adminGet, adminGetOne, getStaff } from "@/lib/admin";
import type { AdminBook, BookOwner } from "@/types/admin";

export const metadata: Metadata = { title: "Edit book" };

export default async function EditBookPage({ params, searchParams }: PageProps<"/admin/books/[id]">) {
  const staff = await getStaff();
  if (staff.status !== "staff") return null;
  const [{ id }, { saved }] = await Promise.all([params, searchParams]);
  const book = await adminGetOne<AdminBook>(staff.token, `/books/${encodeURIComponent(id)}`);
  const owners = await adminGet<BookOwner[]>(staff.token, `/books/${book.id}/owners`);

  return (
    <>
      <Link href="/admin/books" className="text-sm font-semibold text-stone-muted hover:text-slate-ink">
        ← Books
      </Link>
      <div className="mt-3">
        <PageHeader title={book.title}>
          {saved ? "Book added. " : ""}
          {book.status === "published" ? (
            <>
              On the shop at{" "}
              <a href={`/books/${book.slug}`} className="link text-slate-ink">
                /books/{book.slug}
              </a>
              .
            </>
          ) : (
            "Hidden from the website until you publish it."
          )}
        </PageHeader>
      </div>
      <div className="grid gap-6">
        <BookForm book={book} />
        <BookReaderPages book={book} />
        <BookOwners bookId={book.id} title={book.title} owners={owners} />
      </div>
    </>
  );
}
