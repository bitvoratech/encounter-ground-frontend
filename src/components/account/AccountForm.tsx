"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { errorText, FormMessage, TextField } from "@/components/admin/fields";
import { api } from "@/lib/api";
import { authHeader, createClient } from "@/lib/supabase/client";

const card = "rounded-3xl border border-rule bg-chalk p-6 sm:p-8";

/** The member's own details: name and phone can be changed; the email is how they sign in. */
export function AccountForm({ email, fullName, phone, offline }: { email: string; fullName: string; phone: string; offline: boolean }) {
  const router = useRouter();
  const [name, setName] = useState(fullName);
  const [tel, setTel] = useState(phone);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  return (
    <div className="mt-8 grid max-w-xl gap-6">
      {offline && (
        <p role="alert" className="rounded-2xl bg-limestone p-4 text-sm text-slate-ink">
          Your saved details can’t be loaded right now, so these may be out of date. Please try again in a moment.
        </p>
      )}
      <form
        noValidate
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          setSaved("");
          if (!name.trim()) return setError("Please enter your name.");
          setPending(true);
          try {
            await api("/me", {
              method: "PATCH",
              headers: await authHeader(),
              body: JSON.stringify({ full_name: name.trim(), phone: tel.trim() }),
            });
            // Keep the name in the header and menus in step.
            await createClient().auth.updateUser({ data: { full_name: name.trim(), phone: tel.trim() } });
            setSaved("Your details are saved.");
            router.refresh();
          } catch (err) {
            setError(errorText(err));
          } finally {
            setPending(false);
          }
        }}
        className={`${card} grid gap-5`}
      >
        <TextField label="Full name" required autoComplete="name" maxLength={120} value={name} onChange={(v) => (setName(v), setSaved(""))} />
        <TextField
          label="Phone number"
          optional
          type="tel"
          autoComplete="tel"
          maxLength={30}
          value={tel}
          onChange={(v) => (setTel(v), setSaved(""))}
          hint="So the team can reach you about your classes or orders. Include your country code."
        />
        <div>
          <p className="font-semibold text-slate-ink">Email</p>
          <p className="mt-2 break-all rounded-xl bg-limestone px-3 py-2.5 text-slate-ink">{email}</p>
          <p className="mt-1 text-sm text-stone-muted">You sign in with this email. To change it, contact the ministry team.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" disabled={pending} className="btn btn-fire min-h-11 px-6 py-2">
            {pending ? "Saving…" : "Save changes"}
          </button>
          <FormMessage error={error} saved={saved} />
        </div>
      </form>

      <section aria-labelledby="password-heading" className={card}>
        <h2 id="password-heading" className="font-display text-xl text-slate-ink">
          Password
        </h2>
        <p className="mt-2 text-stone-muted">Choose a new password for signing in.</p>
        <Link href="/reset-password" className="btn btn-quiet mt-5 text-slate-ink">
          Change password
        </Link>
      </section>
    </div>
  );
}
