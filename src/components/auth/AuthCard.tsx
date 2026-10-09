import Image from "next/image";
import heroImage from "../../../public/images/home/hero-presence.webp";

/** Two-panel layout for the sign-in pages: the golden hall beside the form. */
export function AuthCard({
  title,
  lede,
  children,
}: {
  title: string;
  lede?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="wrap py-10 md:py-16">
      <div className="grid overflow-hidden rounded-[2rem] border border-rule bg-chalk md:grid-cols-[5fr_6fr]">
        <div className="relative isolate hidden min-h-[36rem] overflow-hidden bg-slate-deep text-chalk md:block">
          <Image
            src={heroImage}
            alt=""
            fill
            placeholder="blur"
            sizes="40vw"
            className="-z-10 object-cover object-[35%_center]"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-deep/90 via-slate-deep/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-10">
            <p className="font-semibold text-flame">Encounter Ground</p>
            <p className="mt-2 font-display text-4xl leading-tight">Dominion in Intimacy</p>
          </div>
        </div>
        <div className="px-6 py-10 sm:px-10 md:px-14 md:py-14">
          <h1 className="text-[length:var(--text-h2)] text-slate-ink">{title}</h1>
          {lede && <p className="mt-3 text-stone-muted">{lede}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
