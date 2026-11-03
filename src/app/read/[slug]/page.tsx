import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BookReader } from "@/components/reader/BookReader";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Reading", robots: { index: false } };

/** The online reader for an e-book the member owns. Full screen, outside the site's frame. */
export default async function ReadPage({ params }: PageProps<"/read/[slug]">) {
  const { slug } = await params;
  // The proxy already sends signed-out visitors to sign in; this is the backstop.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/read/${encodeURIComponent(slug)}`);
  return <BookReader slug={slug} />;
}
