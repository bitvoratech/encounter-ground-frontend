import type { Metadata } from "next";
import { BookForm } from "@/components/admin/BookForm";
import { PageHeader } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Add a book" };

export default function NewBookPage() {
  return (
    <>
      <PageHeader title="Add a book" back={{ href: "/admin/books", label: "Books" }}>It stays a draft, hidden from the website, until you publish it.</PageHeader>
      <BookForm />
    </>
  );
}
