import type { Metadata } from "next";
import { SchoolShell } from "@/components/school/SchoolShell";
import { school } from "@/content/school";

// The school and dashboard are their own site under the ministry, so titles carry the school's name.
export const metadata: Metadata = {
  title: { default: school.name, template: `%s | ${school.shortName}` },
};

export default function SchoolLayout({ children }: { children: React.ReactNode }) {
  return <SchoolShell>{children}</SchoolShell>;
}
