import { IconChevronLeft } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

// Small building blocks shared by the admin pages (server-rendered).

/** A white panel, without padding: for panels whose rows or sections run edge to edge. */
export const panel = "rounded-2xl border border-rule/80 bg-white shadow-[0_1px_2px_rgb(29_38_48/0.04)]";
export const card = `${panel} p-5 md:p-6`;

/**
 * A page's title row: an optional back link, the title and a line about the page, and the
 * page's main actions on the right.
 */
export function PageHeader({
  title,
  children,
  actions,
  back,
}: {
  title: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="min-w-0 max-w-3xl">
        {back && (
          <Link href={back.href} className="mb-2 inline-flex items-center gap-1 text-sm font-semibold text-stone-muted hover:text-slate-ink">
            <IconChevronLeft aria-hidden="true" size={16} stroke={2} />
            {back.label}
          </Link>
        )}
        <h1 className="font-display text-3xl leading-tight text-slate-ink md:text-[2.125rem]">{title}</h1>
        {children && <p className="mt-1.5 text-stone-muted">{children}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

/** Two or more views of one list, as links so they work without JavaScript and can be shared. */
export function Tabs({ label, tabs }: { label: string; tabs: { href: string; label: string; count?: number; current: boolean }[] }) {
  return (
    <nav aria-label={label} className="mb-6">
      <ul className="inline-flex flex-wrap gap-1 rounded-xl border border-rule/80 bg-white p-1 shadow-[0_1px_2px_rgb(29_38_48/0.04)]">
        {tabs.map((t) => (
          <li key={t.href}>
            <Link
              href={t.href}
              aria-current={t.current ? "page" : undefined}
              className="flex min-h-10 items-center gap-2 rounded-lg px-4 py-1.5 text-[0.9375rem] font-semibold text-stone-muted transition-colors hover:bg-limestone hover:text-slate-ink aria-[current=page]:bg-slate-deep aria-[current=page]:text-chalk"
            >
              {t.label}
              {t.count !== undefined && (
                <span className="min-w-6 rounded-full bg-current/10 px-1.5 text-center text-xs tabular-nums">{t.count}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function EmptyState({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={`${card} border-dashed py-12 text-center md:py-14`}>
      <p className="font-display text-2xl text-slate-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-stone-muted">{children}</p>
    </div>
  );
}

/** A full page message for when the dashboard can't be shown at all. */
export function AdminNotice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main id="main" className="grid flex-1 place-items-center bg-slate-deep px-5 py-16 text-center text-chalk">
      <div className="max-w-md">
        <Image src="/brand/logo.png" alt="Encounter Ground" width={467} height={480} className="mx-auto h-24 w-auto" />
        <h1 className="mt-8 text-[length:var(--text-h2)] leading-tight">{title}</h1>
        <p className="mt-3 text-chalk/75">{children}</p>
        <Link href="/" className="btn btn-fire mt-8">
          Go to the website
        </Link>
      </div>
    </main>
  );
}

const relative = new Intl.RelativeTimeFormat("en-GB", { numeric: "auto" });
const steps: [Intl.RelativeTimeFormatUnit, number][] = [
  ["minute", 60],
  ["hour", 24],
  ["day", 7],
  ["week", 4.35],
  ["month", 12],
  ["year", Infinity],
];

/** "3 hours ago", "yesterday", for lists where recency matters more than the date. */
export function timeAgo(iso: string) {
  let value = (new Date(iso).getTime() - Date.now()) / 60000;
  for (const [unit, size] of steps) {
    if (Math.abs(value) < size) return Math.abs(value) < 1 && unit === "minute" ? "just now" : relative.format(Math.round(value), unit);
    value /= size;
  }
  return "";
}

/** "28 Oct 2026, 16:22", in the ministry's time zone. */
export const fullDate = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Lagos" });

/** A timestamp that reads as "3 hours ago", with the full date on hover and for screen readers' context. */
export function When({ iso, prefix }: { iso: string; prefix?: string }) {
  return (
    <time dateTime={iso} title={fullDate(iso)}>
      {prefix}
      {timeAgo(iso)}
    </time>
  );
}
