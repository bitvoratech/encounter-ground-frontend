import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Join Encounter Ground to save your self-test results and, soon, take Ministry School courses and read your books.",
};

export default function RegisterPage() {
  return (
    <AuthCard
      title="Join Encounter Ground"
      lede="One account for your self-test results and, soon, the Ministry School and your books."
    >
      <RegisterForm />
    </AuthCard>
  );
}
