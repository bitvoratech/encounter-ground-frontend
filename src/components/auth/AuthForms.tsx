"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  requestPasswordReset,
  signIn,
  signUp,
  updatePassword,
  type AuthState,
} from "@/app/(auth)/actions";
import { inputClass } from "@/components/ui/form";

function Field({
  label,
  hint,
  ...input
}: { label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="font-semibold text-slate-ink">
        {label}
        {hint && <span className="font-normal text-stone-muted"> {hint}</span>}
      </span>
      <input className={inputClass} {...input} />
    </label>
  );
}

function FormError({ state }: { state: AuthState }) {
  return state?.error ? (
    <p role="alert" className="rounded-xl bg-flame/15 px-4 py-3 font-semibold text-amber">
      {state.error}
    </p>
  ) : null;
}

function CheckEmail({ email, children }: { email: string; children: React.ReactNode }) {
  return (
    <div role="status" className="rounded-2xl border border-rule bg-limestone p-6">
      <p className="font-display text-2xl text-slate-ink">Check your email</p>
      <p className="mt-2 text-stone-muted">
        We sent a link to <span className="font-semibold text-slate-ink">{email}</span>. {children}
      </p>
    </div>
  );
}

export function LoginForm({ next, linkError }: { next?: string; linkError?: boolean }) {
  const [state, action, pending] = useActionState(signIn, undefined);
  return (
    <form action={action} className="grid gap-5">
      {linkError && !state?.error && (
        <p role="alert" className="rounded-xl bg-flame/15 px-4 py-3 font-semibold text-amber">
          That link has expired or was already used. Sign in, or request a new one.
        </p>
      )}
      <FormError state={state} />
      <input type="hidden" name="next" value={next ?? ""} />
      <Field label="Email" name="email" type="email" autoComplete="email" required defaultValue={state?.values?.email} />
      <div>
        <Field label="Password" name="password" type="password" autoComplete="current-password" required />
        <Link href="/forgot-password" className="link mt-2 inline-block text-sm text-stone-muted">
          Forgot your password?
        </Link>
      </div>
      <button type="submit" className="btn btn-fire" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-stone-muted">
        New here?{" "}
        <Link href="/register" className="link font-semibold text-slate-ink">
          Create an account
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(signUp, undefined);
  if (state?.sentTo)
    return (
      <CheckEmail email={state.sentTo}>Open it to confirm your account, then you’re in.</CheckEmail>
    );
  return (
    <form action={action} className="grid gap-5">
      <FormError state={state} />
      <Field label="Full name" name="full_name" autoComplete="name" required maxLength={120} defaultValue={state?.values?.full_name} />
      <Field label="Email" name="email" type="email" autoComplete="email" required defaultValue={state?.values?.email} />
      <Field
        label="Phone or WhatsApp"
        hint="(optional)"
        name="phone"
        type="tel"
        autoComplete="tel"
        maxLength={30}
        defaultValue={state?.values?.phone}
      />
      <Field
        label="Password"
        hint="(at least 8 characters)"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
      />
      <button type="submit" className="btn btn-fire" disabled={pending}>
        {pending ? "Creating your account…" : "Create account"}
      </button>
      <p className="text-stone-muted">
        Already have an account?{" "}
        <Link href="/login" className="link font-semibold text-slate-ink">
          Sign in
        </Link>
      </p>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, undefined);
  if (state?.sentTo)
    return (
      <CheckEmail email={state.sentTo}>
        If there’s an account for that address, the link lets you choose a new password.
      </CheckEmail>
    );
  return (
    <form action={action} className="grid gap-5">
      <FormError state={state} />
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <button type="submit" className="btn btn-fire" disabled={pending}>
        {pending ? "Sending…" : "Send reset link"}
      </button>
      <Link href="/login" className="link text-stone-muted">
        Back to sign in
      </Link>
    </form>
  );
}

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, undefined);
  return (
    <form action={action} className="grid gap-5">
      <FormError state={state} />
      <Field
        label="New password"
        hint="(at least 8 characters)"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
      />
      <Field label="Confirm new password" name="confirm" type="password" autoComplete="new-password" required />
      <button type="submit" className="btn btn-fire" disabled={pending}>
        {pending ? "Saving…" : "Save new password"}
      </button>
    </form>
  );
}
