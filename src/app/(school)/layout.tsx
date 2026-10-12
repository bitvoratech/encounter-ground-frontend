import { SiteShell } from "@/components/layout/SiteShell";
import { SchoolNav } from "@/components/school/SchoolNav";

export default function SchoolLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteShell>
      <SchoolNav />
      {children}
    </SiteShell>
  );
}
