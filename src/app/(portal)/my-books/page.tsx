import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/admin/ui";
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
    <div>
      <PageHeader title="My books">Your e-books, to read here on any device. Each one opens where you stopped.</PageHeader>
      <MyBooks />
    </div>
  );
}
