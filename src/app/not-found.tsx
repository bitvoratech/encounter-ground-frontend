import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function NotFound() {
  return (
    <>
    <SiteHeader />
    <main id="main" className="flex-1">
    <section className="wrap py-24 md:py-32">
      <h1 className="text-[length:var(--text-h1)] text-slate-ink">This page isn’t here</h1>
      <p className="mt-5 max-w-md text-lede text-stone-muted">
        It may have moved when the site was rebuilt. Start from the home page or
        browse our programmes.
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-fire">Go to the home page</Link>
        <Link href="/events" className="btn btn-quiet text-slate-ink">See programmes</Link>
      </div>
    </section>
    </main>
    <SiteFooter />
    </>
  );
}
