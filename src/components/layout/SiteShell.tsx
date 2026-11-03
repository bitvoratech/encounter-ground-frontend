import { SiteHeader } from "./SiteHeader";
import { getSiteContent } from "@/lib/siteContent";
import { SiteFooter } from "./SiteFooter";

/** Header, main landmark and footer shared by the public site, store and auth pages. */
export async function SiteShell({ children }: { children: React.ReactNode }) {
  const { contact } = await getSiteContent();
  return (
    <>
      <SiteHeader socials={contact.socials} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
