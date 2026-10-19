import type { Metadata } from "next";
import { PortalNav } from "@/components/school/PortalNav";
import { SchoolShell } from "@/components/school/SchoolShell";
import { school } from "@/content/school";

// The school and dashboard are their own site under the ministry, so titles carry the school's name.
export const metadata: Metadata = {
  title: { default: school.name, template: `%s | ${school.shortName}` },
};

/** The member area: dashboard, My courses and My books share a sidebar. */
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <SchoolShell>
      <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-8 pb-24 pt-6 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12 lg:pt-10">
        <PortalNav />
        <div className="min-w-0">{children}</div>
      </div>
    </SchoolShell>
  );
}
