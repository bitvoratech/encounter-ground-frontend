import type { Metadata } from "next";
import Link from "next/link";
import { BookForm } from "@/components/admin/BookForm";
import { PageHeader } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Add a book" };

export default function NewBookPage() {
  return (
    <>
      <Link href="/admin/books" className="text-sm font-semibold text-stone-muted hover:text-slate-ink">
        ← Books
      </Link>
      <div className="mt-3">
        <PageHeader title="Add a book">It stays a draft, hidden from the website, until you publish it.</PageHeader>
      </div>
      <BookForm />
    </>
  );
}
