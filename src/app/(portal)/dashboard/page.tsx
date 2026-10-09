import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "My account", robots: { index: false } };

const soon = [
  { title: "My courses", body: "Ministry School classes you’re enrolled in will appear here." },
  { title: "My books", body: "E-books you buy from the bookstore will be readable here." },
];

export default async function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const { password } = await searchParams;
  const name = (user.user_metadata.full_name as string | undefined) ?? user.email;
  const firstName = name?.split(" ")[0];

  return (
    <>
      <header className="wrap pb-10 pt-14 md:pt-20">
        <p className="font-semibold text-amber">My account</p>
        <h1 className="mt-2 text-[length:var(--text-h1)] text-slate-ink">Welcome, {firstName}</h1>
        {password === "updated" && (
          <p role="status" className="mt-6 inline-block rounded-xl bg-flame/15 px-4 py-3 font-semibold text-amber">
            Your password has been updated.
          </p>
        )}
      </header>

      <section aria-label="Your account" className="border-t border-rule bg-chalk">
        <div className="wrap grid gap-6 py-14 md:grid-cols-3 md:py-20">
          <article className="rounded-3xl border border-rule bg-limestone p-6">
            <h2 className="text-h3 text-slate-ink">Your details</h2>
            <dl className="mt-4 grid gap-3">
              <div>
                <dt className="text-sm text-stone-muted">Name</dt>
                <dd className="text-slate-ink">{name}</dd>
              </div>
              <div>
                <dt className="text-sm text-stone-muted">Email</dt>
                <dd className="break-all text-slate-ink">{user.email}</dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/reset-password" className="link text-sm font-semibold text-slate-ink">
                Change password
              </Link>
            </div>
          </article>

          <article className="rounded-3xl border border-rule bg-limestone p-6">
            <h2 className="text-h3 text-slate-ink">Self-tests</h2>
            <p className="mt-3 text-stone-muted">
              Reflect on your calling. Results you get while signed in are saved to your account.
            </p>
            <Link href="/self-test" className="btn btn-fire mt-6">
              Take a self-test
            </Link>
          </article>

          {soon.map((s) => (
            <article key={s.title} className="rounded-3xl border border-dashed border-rule p-6">
              <h2 className="text-h3 text-slate-ink">{s.title}</h2>
              <p className="mt-3 text-stone-muted">{s.body}</p>
              <p className="mt-6 text-sm font-semibold text-amber">Coming soon</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-label="Sign out">
        <form action="/auth/signout" method="post" className="wrap py-12">
          <button type="submit" className="btn btn-quiet text-slate-ink">
            Sign out
          </button>
        </form>
      </section>
    </>
  );
}
