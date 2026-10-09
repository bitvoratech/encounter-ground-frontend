import { SiteShell } from "@/components/layout/SiteShell";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
