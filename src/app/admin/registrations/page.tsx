import { IconFileSpreadsheet, IconFileTypeCsv, IconSearch } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DeleteRegistrationButton } from "@/components/admin/DeleteRegistrationButton";
import { card, EmptyState, fullDate, PageHeader, panel, Tabs } from "@/components/admin/ui";
import { adminGet, getStaff } from "@/lib/admin";
import { dayLabel } from "@/lib/registrations";
import type { RegistrationsPage } from "@/types/admin";

export const metadata: Metadata = { title: "Registrations" };

const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : "");

export default async function AdminRegistrationsPage({ searchParams }: PageProps<"/admin/registrations">) {
  const staff = await getStaff();
  if (staff.status !== "staff") return null;

  const sp = await searchParams;
  const event = one(sp.event);
  const q = one(sp.q).trim().slice(0, 100);
  const transport = one(sp.transport) === "yes" ? "yes" : one(sp.transport) === "no" ? "no" : "";
  const page = Math.max(1, Number.parseInt(one(sp.page), 10) || 1);

  /** A link to this page with some of the choices changed. */
  const href = (change: { event?: string; q?: string; transport?: string; page?: number }, path = "/admin/registrations") => {
    const next = { event, q, transport, page: 1, ...change };
    const params = new URLSearchParams();
    if (next.event) params.set("event", next.event);
    if (next.q) params.set("q", next.q);
    if (next.transport) params.set("transport", next.transport);
    if (next.page > 1) params.set("page", String(next.page));
    const qs = params.toString();
    return qs ? `${path}?${qs}` : path;
  };

  const data = await adminGet<RegistrationsPage>(staff.token, href({ page }, "/registrations"));

  /** The download link: the same event, search and filter as the list on screen. */
  const exportHref = (format: "csv" | "xlsx") => {
    const params = new URLSearchParams({ format });
    if (data.event) params.set("event", data.event.slug);
    if (q) params.set("q", q);
    if (transport) params.set("transport", transport);
    return `/admin/registrations/export?${params}`;
  };

  if (!data.event || !data.stats)
    return (
      <>
        <PageHeader title="Registrations">Sign-ups for the ministry’s events, with a download for the team.</PageHeader>
        <EmptyState title="No registrations yet">
          {event ? "We couldn’t find that event." : "Once an event is open for registration and people sign up, they appear here."}
        </EmptyState>
      </>
    );

  const { stats, rows, total, page_size } = data;
  const filtered = !!q || !!transport;
  const firstShown = total === 0 ? 0 : (data.page - 1) * page_size + 1;
  const lastShown = Math.min(total, data.page * page_size);
  const slug = data.event.slug;
  const canDelete = staff.profile.role === "admin";

  return (
    <>
      <PageHeader
        title="Registrations"
        actions={
          <>
            <a href={exportHref("csv")} className="btn btn-quiet px-4">
              <IconFileTypeCsv aria-hidden="true" size={18} stroke={1.75} />
              Download CSV
            </a>
            <a href={exportHref("xlsx")} className="btn btn-fire px-4">
              <IconFileSpreadsheet aria-hidden="true" size={18} stroke={1.75} />
              Download Excel
            </a>
          </>
        }
      >
        {data.event.title}. Newest first.{" "}
        {filtered ? "Downloads include only the people matching your search and filter." : "Downloads include everyone registered."}
      </PageHeader>

      {data.events.length > 1 && (
        <Tabs
          label="Events"
          tabs={data.events.map((e) => ({ href: href({ event: e.slug, q: "", transport: "" }), label: e.title, count: e.total, current: e.slug === slug }))}
        />
      )}

      <section aria-label="Totals" className="mb-8 grid gap-4 md:grid-cols-3">
        <div className={card}>
          <p className="text-sm text-stone-muted">Registered</p>
          <p className="mt-1 font-display text-4xl tabular-nums text-slate-ink">{stats.total}</p>
          <p className="mt-1 text-sm text-stone-muted">
            {stats.first_timers} {stats.first_timers === 1 ? "is" : "are"} new to Encounter Ground
          </p>
        </div>
        <div className={card}>
          <p className="text-sm text-stone-muted">Attending each day</p>
          {stats.by_day.length === 0 ? (
            <p className="mt-2 text-stone-muted">No days chosen yet.</p>
          ) : (
            <ul className="mt-2 grid gap-1">
              {stats.by_day.map((d) => (
                <li key={d.day} className="flex items-baseline justify-between gap-4">
                  <span className="text-slate-ink">{dayLabel(d.day)}</span>
                  <span className="font-semibold tabular-nums text-slate-ink">{d.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={card}>
          <p className="text-sm text-stone-muted">Need transport</p>
          <p className="mt-1 font-display text-4xl tabular-nums text-slate-ink">{stats.transport}</p>
          {stats.by_area.length > 0 && (
            <ul className="mt-2 grid gap-1">
              {stats.by_area.map((a) => (
                <li key={a.area} className="flex items-baseline justify-between gap-4 text-sm">
                  <span className="text-slate-ink">{a.area}</span>
                  <span className="font-semibold tabular-nums text-slate-ink">{a.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <form role="search" action="/admin/registrations" className="mb-4 flex max-w-xl gap-2">
        {event && <input type="hidden" name="event" value={event} />}
        {transport && <input type="hidden" name="transport" value={transport} />}
        <label htmlFor="registration-search" className="sr-only">
          Search by name, email or phone
        </label>
        <input
          id="registration-search"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Name, email or phone"
          className="min-h-10 min-w-0 flex-1 rounded-xl border border-rule bg-white px-4 text-slate-ink shadow-[0_1px_2px_rgb(29_38_48/0.04)] focus:border-slate"
        />
        <button type="submit" className="btn btn-fire px-4">
          <IconSearch aria-hidden="true" size={18} stroke={2} />
          Search
        </button>
      </form>
      <Tabs
        label="Transport"
        tabs={[
          { href: href({ transport: "" }), label: "Everyone", current: !transport },
          { href: href({ transport: "yes" }), label: "Needs transport", current: transport === "yes" },
          { href: href({ transport: "no" }), label: "No transport", current: transport === "no" },
        ]}
      />

      {rows.length === 0 ? (
        <EmptyState title={filtered ? "No one matches" : "No registrations yet"}>
          {filtered ? (
            <>
              Nothing matches your search.{" "}
              <Link href={href({ q: "", transport: "" })} className="link font-semibold text-slate-ink">
                Show everyone
              </Link>
            </>
          ) : (
            "New sign-ups from the registration form appear here."
          )}
        </EmptyState>
      ) : (
        <>
          <section aria-label="Registrations" className={panel}>
            <div
              aria-hidden="true"
              className="hidden grid-cols-[minmax(0,1.4fr)_9.5rem_minmax(0,1fr)_7rem_8.5rem_2.5rem] gap-4 rounded-t-2xl border-b border-rule/80 bg-limestone/60 px-6 py-3 text-xs font-bold uppercase tracking-wider text-stone-muted lg:grid"
            >
              <span>Name</span>
              <span>Phone</span>
              <span>Days</span>
              <span>Transport</span>
              <span>Registered</span>
              <span />
            </div>
            <ul className="divide-y divide-rule/80">
              {rows.map((r) => {
                const area = r.location_area === "Other" && r.location_other ? r.location_other : r.location_area;
                const about = [r.gender, r.age_range, r.first_time === "yes" ? "First time" : "", r.church].filter(Boolean).join(" · ");
                return (
                  <li key={r.id} className="grid items-start gap-x-4 gap-y-2 px-5 py-4 lg:grid-cols-[minmax(0,1.4fr)_9.5rem_minmax(0,1fr)_7rem_8.5rem_2.5rem] lg:px-6">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-ink [overflow-wrap:anywhere]">{r.full_name}</p>
                      <a href={`mailto:${r.email}`} className="link text-sm text-stone-muted [overflow-wrap:anywhere]">
                        {r.email}
                      </a>
                      {about && <p className="text-sm text-stone-muted">{about}</p>}
                      {r.special_needs && (
                        <p className="mt-1 whitespace-pre-line text-sm text-slate-ink">
                          <span className="font-semibold">Note: </span>
                          {r.special_needs}
                        </p>
                      )}
                    </div>
                    <p className="text-sm lg:text-base">
                      <span className="sr-only">Phone: </span>
                      {r.phone ? (
                        <a href={`tel:${r.phone.replace(/[^\d+]/g, "")}`} className="link text-slate-ink">
                          {r.phone}
                        </a>
                      ) : (
                        "—"
                      )}
                    </p>
                    <p className="text-sm text-slate-ink lg:text-base">
                      <span className="sr-only">Days: </span>
                      {r.days.length ? r.days.map(dayLabel).join(", ") : "—"}
                    </p>
                    <p className="text-sm lg:text-base">
                      <span className="sr-only">Transport: </span>
                      {r.needs_transport ? (
                        <span className="rounded-full bg-flame/20 px-2.5 py-0.5 font-semibold text-slate-ink">{area || "Yes"}</span>
                      ) : (
                        <span className="text-stone-muted">—</span>
                      )}
                    </p>
                    <p className="text-sm text-stone-muted">
                      <span className="sr-only">Registered: </span>
                      <time dateTime={r.created_at}>{fullDate(r.created_at)}</time>
                    </p>
                    <div className="lg:justify-self-end">{canDelete && <DeleteRegistrationButton id={r.id} name={r.full_name} />}</div>
                  </li>
                );
              })}
            </ul>
          </section>

          <nav aria-label="Pages" className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-stone-muted">
            <p>
              Showing {firstShown}–{lastShown} of {total}
            </p>
            <div className="flex gap-2">
              {data.page > 1 && (
                <Link href={href({ page: data.page - 1 })} className="btn btn-quiet px-4">
                  Previous
                </Link>
              )}
              {lastShown < total && (
                <Link href={href({ page: data.page + 1 })} className="btn btn-quiet px-4">
                  Next
                </Link>
              )}
            </div>
          </nav>
        </>
      )}
    </>
  );
}
