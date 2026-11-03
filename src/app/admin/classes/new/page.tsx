import type { Metadata } from "next";
import { CourseForm } from "@/components/admin/CourseForm";
import { PageHeader } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Add a class" };

export default function NewClassPage() {
  return (
    <>
      <PageHeader title="Add a class" back={{ href: "/admin/classes", label: "Classes" }}>Start with its details. Next you add modules and lessons, then publish it.</PageHeader>
      <CourseForm />
    </>
  );
}
