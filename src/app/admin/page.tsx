import {
  IconArrowRight,
  IconArrowUpRight,
  IconClipboardCheck,
  IconListCheck,
  IconMail,
  IconSchool,
  IconUsers,
} from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge } from "@/components/admin/fields";
import { card, When } from "@/components/admin/ui";
import { getOverview, getStaff } from "@/lib/admin";

export const metadata: Metadata = { title: "Overview" };

function greeting() {
  const hour = Number(new Date().toLocaleString("en-GB", { hour: "numeric", hour12: false, timeZone: "Africa/Lagos" }));
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
}

export default async function AdminOverviewPage() {
  const staff = await getStaff();
  if (staff.status !== "staff") return null;
  const { counts, checkpoints, messages, classes } = await getOverview(staff.token);
  const firstName = (staff.profile.full_name || "").split(" ")[0];

  const stats = [
    { label: "Checkpoints to review", value: counts.checkpoints_waiting, href: "/admin/checkpoints", Icon: IconClipboardCheck, urgent: true },
    { label: "Messages to answer", value: counts.messages_open, href: "/admin/messages", Icon: IconMail, urgent: true },
    {
      label: `Members · ${counts.new_members} new this month`,
      value: counts.members,
      href: staff.profile.role === "admin" ? "/admin/members" : null,
      Icon: IconUsers,
      urgent: false,
    },
    { label: "Class enrolments", value: counts.enrolments, href: null, Icon: IconSchool, urgent: false },
    { label: "Self-tests taken", value: counts.self_tests, href: null, Icon: IconListCheck, urgent: false },
  ];

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-stone-muted">
          {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "Africa/Lagos" })}
        </p>
        <h1 className="mt-1 font-display text-3xl leading-tight text-slate-ink md:text-[2.125rem]">
          {greeting()}
          {firstName && `, ${firstName}`}
        </h1>
      </header>

      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {stats.map(({ label, value, href, Icon, urgent }) => {
          const body = (
            <>
              <span className="flex items-start justify-between gap-2">
                <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${urgent && value > 0 ? "bg-flame text-slate-ink" : "bg-slate/10 text-slate"}`}>
                  <Icon aria-hidden="true" size={20} stroke={1.75} />
                </span>
                {href && (
                  <IconArrowUpRight aria-hidden="true" size={18} stroke={2} className="text-stone transition-colors group-hover:text-slate-ink" />
                )}
              </span>
              <span className="mt-5 block text-3xl font-extrabold leading-none text-slate-ink tabular-nums">{value}</span>
              <span className="mt-1.5 block text-sm text-stone-muted">{label}</span>
            </>
          );
          const box = `group block h-full rounded-2xl border bg-white p-4 shadow-[0_1px_2px_rgb(29_38_48/0.04)] md:p-5 ${
            urgent && value > 0 ? "border-flame/60" : "border-rule/80"
          }`;
          return (
            <li key={label}>
              {href ? (
                <Link href={href} className={`${box} transition-[border-color,box-shadow] hover:border-stone hover:shadow-md`}>
                  {body}
                </Link>
              ) : (
                <div className={box}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="grid gap-6 xl:grid-cols-2">
        <section aria-labelledby="waiting-heading" className={card}>
          <div className="flex items-center justify-between gap-4">
            <h2 id="waiting-heading" className="font-sans text-xl font-bold text-slate-ink">
              Waiting for a reply
            </h2>
            <Link href="/admin/checkpoints" className="shrink-0 rounded-lg px-2 py-1 text-sm font-semibold text-amber hover:bg-flame/10">
              All checkpoints
            </Link>
          </div>
          {checkpoints.length ? (
            <ul className="mt-2 divide-y divide-rule/80">
              {checkpoints.map((c) => (
                <li key={c.id} className="py-4">
                  <p className="flex flex-wrap justify-between gap-x-4 text-sm text-stone-muted">
                    <span>
                      <span className="font-semibold text-slate-ink">{c.student_name || c.student_email}</span> · {c.course_name}
                    </span>
                    <When iso={c.submitted_at} />
                  </p>
                  <p className="mt-1 line-clamp-2 text-slate">{c.body}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-stone-muted">Every checkpoint has a reply. Well done.</p>
          )}
        </section>

        <section aria-labelledby="messages-heading" className={card}>
          <div className="flex items-center justify-between gap-4">
            <h2 id="messages-heading" className="font-sans text-xl font-bold text-slate-ink">
              New messages
            </h2>
            <Link href="/admin/messages" className="shrink-0 rounded-lg px-2 py-1 text-sm font-semibold text-amber hover:bg-flame/10">
              All messages
            </Link>
          </div>
          {messages.length ? (
            <ul className="mt-2 divide-y divide-rule/80">
              {messages.map((m) => (
                <li key={m.id} className="py-4">
                  <p className="flex flex-wrap justify-between gap-x-4 text-sm text-stone-muted">
                    <span className="font-semibold text-slate-ink">{m.full_name}</span>
                    <When iso={m.created_at} />
                  </p>
                  <p className="mt-1 font-semibold text-slate">{m.subject}</p>
                  <p className="line-clamp-1 text-stone-muted">{m.message}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-stone-muted">No messages waiting.</p>
          )}
        </section>
      </div>

      <section aria-labelledby="classes-heading" className={card}>
        <h2 id="classes-heading" className="font-sans text-xl font-bold text-slate-ink">
          Beth-El classes
        </h2>
        <div className="-mx-5 mt-4 overflow-x-auto px-5 md:-mx-6 md:px-6">
          <table className="w-full min-w-[28rem] text-left">
            <thead className="text-xs uppercase tracking-wider text-stone-muted">
              <tr className="border-b border-rule/80">
                <th scope="col" className="py-2 pr-4 font-semibold">Class</th>
                <th scope="col" className="py-2 pr-4 font-semibold">Status</th>
                <th scope="col" className="py-2 pr-4 text-right font-semibold">Enrolled</th>
                <th scope="col" className="py-2 text-right font-semibold">Finished</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule/80">
              {classes.map((c) => (
                <tr key={c.slug}>
                  <th scope="row" className="py-3 pr-4 font-semibold text-slate-ink">
                    <Link href={`/school/classes/${c.slug}`} className="hover:text-amber">
                      {c.name}
                    </Link>
                  </th>
                  <td className="py-3 pr-4">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="py-3 pr-4 text-right tabular-nums">{c.enrolments}</td>
                  <td className="py-3 text-right tabular-nums">{c.completed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link href="/school/classes" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-ink hover:text-amber">
          See the classes as students do
          <IconArrowRight aria-hidden="true" size={16} stroke={2} />
        </Link>
      </section>
    </div>
  );
}
