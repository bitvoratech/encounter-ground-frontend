import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next, error } = await searchParams;
  const nextPath = typeof next === "string" ? next : undefined;
  const fromCheckout = nextPath?.startsWith("/checkout");

  return (
    <AuthCard
      title={fromCheckout ? "Sign in to check out" : "Welcome back"}
      lede={
        fromCheckout
          ? "Your e-books go into your account, so you can read them on any device. New here? Create an account below."
          : "Sign in to your Encounter Ground account."
      }
    >
      <LoginForm next={nextPath} linkError={error === "link"} />
    </AuthCard>
  );
}
