import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

/** Header, main landmark and footer shared by the public site, store, auth and portal. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
