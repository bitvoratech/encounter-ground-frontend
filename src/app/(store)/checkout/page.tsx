import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckoutView } from "@/components/store/CheckoutView";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage({ searchParams }: PageProps<"/checkout">) {
  // The proxy already sends signed-out visitors to sign in; this is the backstop.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/checkout");

  // ?simulate=fail exercises the payment-failed path while payments are simulated.
  const { simulate } = await searchParams;

  return (
    <div className="page-hero wrap pb-24 pt-14 md:pt-20">
      <h1 className="text-[length:var(--text-h1)] text-slate-ink">Checkout</h1>
      <p className="mt-3 text-stone-muted">
        Signed in as <span className="font-semibold text-slate-ink">{user.email}</span>
      </p>
      <CheckoutView email={user.email ?? ""} simulateFailure={simulate === "fail"} />
    </div>
  );
}
