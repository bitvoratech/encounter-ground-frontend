import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next, error } = await searchParams;
  return (
    <AuthCard title="Welcome back" lede="Sign in to your Encounter Ground account.">
      <LoginForm next={typeof next === "string" ? next : undefined} linkError={error === "link"} />
    </AuthCard>
  );
}
