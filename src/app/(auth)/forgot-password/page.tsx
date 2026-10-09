import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = { title: "Reset your password", robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <AuthCard title="Forgot your password?" lede="Enter your email and we’ll send you a link to choose a new one.">
      <ForgotPasswordForm />
    </AuthCard>
  );
}
