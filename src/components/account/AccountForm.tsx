"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconKey, IconMail } from "@tabler/icons-react";
import { errorText, FormMessage, TextField } from "@/components/admin/fields";
import { panel } from "@/components/admin/ui";
import { api } from "@/lib/api";
import { authHeader, createClient } from "@/lib/supabase/client";

/** The member's own details: name and phone can be changed; the email is how they sign in. */
export function AccountForm({ email, fullName, phone, offline }: { email: string; fullName: string; phone: string; offline: boolean }) {
  const router = useRouter();
  const [name, setName] = useState(fullName);
  const [tel, setTel] = useState(phone);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  return (
    <div className="grid max-w-2xl gap-6">
      {offline && (
        <p role="alert" className="rounded-xl border border-flame/50 bg-flame/10 px-4 py-3 text-sm text-slate-ink">
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
        className={`${panel} overflow-hidden`}
      >
        <div className="border-b border-rule/80 px-5 py-4 md:px-6">
          <h2 className="font-sans text-xl font-bold text-slate-ink">Your details</h2>
          <p className="mt-0.5 text-sm text-stone-muted">Used on your classes and orders.</p>
        </div>
        <div className="grid gap-5 p-5 md:p-6">
          <TextField
            label="Full name"
            required
            autoComplete="name"
            maxLength={120}
            value={name}
            onChange={(v) => (setName(v), setSaved(""))}
          />
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
            <p className="mt-2 flex items-center gap-2 break-all rounded-lg border border-rule/80 bg-limestone px-3 py-2.5 text-slate-ink">
              <IconMail aria-hidden="true" size={18} stroke={1.75} className="shrink-0 text-stone-muted" />
              {email}
            </p>
            <p className="mt-1 text-sm text-stone-muted">You sign in with this email. To change it, contact the ministry team.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-3 border-t border-rule/80 bg-limestone/40 px-5 py-4 md:px-6">
          <div className="mr-auto">
            <FormMessage error={error} saved={saved} />
          </div>
          <button type="submit" disabled={pending} className="btn btn-fire px-5 disabled:opacity-60">
            {pending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>

      <section aria-labelledby="password-heading" className={`${panel} flex flex-wrap items-center gap-x-5 gap-y-4 p-5 md:p-6`}>
        <span className="hidden size-11 shrink-0 place-items-center rounded-xl bg-slate/10 text-slate sm:grid">
          <IconKey aria-hidden="true" size={22} stroke={1.75} />
        </span>
        <div className="min-w-0 flex-1 basis-52">
          <h2 id="password-heading" className="font-sans text-xl font-bold text-slate-ink">
            Password
          </h2>
          <p className="mt-0.5 text-stone-muted">Choose a new password for signing in.</p>
        </div>
        <Link href="/reset-password" className="btn btn-quiet">
          Change password
        </Link>
      </section>

      <form action="/auth/signout" method="post" className="justify-self-start">
        <button type="submit" className="text-sm font-semibold text-stone-muted underline-offset-4 hover:text-slate-ink hover:underline">
          Sign out of this device
        </button>
      </form>
    </div>
  );
}
