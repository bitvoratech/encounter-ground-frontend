import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Join Encounter Ground to save your self-test results and, soon, take Ministry School courses and read your books.",
};

export default async function RegisterPage({ searchParams }: PageProps<"/register">) {
  const { next } = await searchParams;
  const nextPath = typeof next === "string" ? next : undefined;
  const fromCheckout = nextPath?.startsWith("/checkout");

  return (
    <AuthCard
      title="Join Encounter Ground"
      lede={
        fromCheckout
          ? "Create an account to finish buying. Your e-books will be waiting in My books."
          : "One account for your self-test results and, soon, the Ministry School and your books."
      }
    >
      <RegisterForm next={nextPath} />
    </AuthCard>
  );
}
