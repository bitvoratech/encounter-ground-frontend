import type { Metadata } from "next";
import Link from "next/link";
import { CourseForm } from "@/components/admin/CourseForm";
import { PageHeader } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Add a class" };

export default function NewClassPage() {
  return (
    <>
      <Link href="/admin/classes" className="text-sm font-semibold text-stone-muted hover:text-slate-ink">
        ← Classes
      </Link>
      <div className="mt-3">
        <PageHeader title="Add a class">Start with its details. Next you add modules and lessons, then publish it.</PageHeader>
      </div>
      <CourseForm />
    </>
  );
}
