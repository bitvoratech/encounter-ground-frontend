"use server";

import { redirect } from "next/navigation";
import { safeNext } from "@/lib/safe-next";
import { createClient } from "@/lib/supabase/server";

// `values` refills the form after an error (React resets forms after an action).
// Passwords are never sent back.
export type AuthState = { error?: string; sentTo?: string; values?: Record<string, string> } | undefined;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

export async function signIn(_prev: AuthState, form: FormData): Promise<AuthState> {
  const email = text(form, "email");
  const password = String(form.get("password") ?? "");
  const values = { email };
  if (!email || !password) return { error: "Enter your email and password.", values };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return {
      error:
        error.code === "email_not_confirmed"
          ? "Please confirm your email first. Check your inbox for the link we sent."
          : "That email and password don’t match an account.",
      values,
    };
  }
  redirect(safeNext(form.get("next")));
}

export async function signUp(_prev: AuthState, form: FormData): Promise<AuthState> {
  const fullName = text(form, "full_name");
  const phone = text(form, "phone");
  const email = text(form, "email");
  const password = String(form.get("password") ?? "");

  const values = { full_name: fullName, phone, email };
  if (!fullName) return { error: "Please enter your name.", values };
  if (!email) return { error: "Please enter your email address.", values };
  if (password.length < 8) return { error: "Choose a password of at least 8 characters.", values };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Copied into `profiles` by the on_auth_user_created trigger.
      data: { full_name: fullName, phone: phone || null },
      emailRedirectTo: `${siteUrl}/auth/confirm?next=/dashboard`,
    },
  });
  if (error) {
    return {
      error:
        error.code === "user_already_exists"
          ? "There’s already an account with that email. Try signing in."
          : error.code === "weak_password"
            ? "That password is too easy to guess. Try a longer one."
            : "We couldn’t create your account. Please try again.",
      values,
    };
  }

  // With email confirmation off, Supabase signs the person straight in.
  if (data.session) redirect("/dashboard");
  return { sentTo: email };
}

export async function requestPasswordReset(_prev: AuthState, form: FormData): Promise<AuthState> {
  const email = text(form, "email");
  if (!email) return { error: "Please enter your email address." };

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/confirm?next=/reset-password`,
  });
  // Same answer whether or not the account exists, so emails can't be probed.
  return { sentTo: email };
}

export async function updatePassword(_prev: AuthState, form: FormData): Promise<AuthState> {
  const password = String(form.get("password") ?? "");
  if (password.length < 8) return { error: "Choose a password of at least 8 characters." };
  if (password !== String(form.get("confirm") ?? "")) return { error: "The two passwords don’t match." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return {
      error:
        error.code === "same_password"
          ? "That’s your current password. Choose a new one."
          : "We couldn’t update your password. Request a new reset link and try again.",
    };
  }
  redirect("/dashboard?password=updated");
}
