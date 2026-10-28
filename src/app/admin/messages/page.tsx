import { IconMail, IconPhone } from "@tabler/icons-react";
import type { Metadata } from "next";
import { HandledButton } from "@/components/admin/HandledButton";
import { card, EmptyState, fullDate, PageHeader, Tabs, When } from "@/components/admin/ui";
import { adminGet, getOverview, getStaff } from "@/lib/admin";
import type { ContactMessage } from "@/types/admin";

export const metadata: Metadata = { title: "Messages" };

export default async function AdminMessagesPage({ searchParams }: PageProps<"/admin/messages">) {
  const staff = await getStaff();
  if (staff.status !== "staff") return null;
  const handled = (await searchParams).status === "handled";
  const [list, overview] = await Promise.all([
    adminGet<ContactMessage[]>(staff.token, handled ? "/messages?status=handled" : "/messages"),
    getOverview(staff.token),
  ]);

  return (
    <>
      <PageHeader title="Messages">
        Sent through the website’s contact form. Reply by email, then mark the message as handled so the team knows it’s done.
      </PageHeader>
      <Tabs
        label="Messages"
        tabs={[
          { href: "/admin/messages", label: "To answer", count: overview.counts.messages_open, current: !handled },
          { href: "/admin/messages?status=handled", label: "Handled", current: handled },
        ]}
      />

      {list.length === 0 ? (
        handled ? (
          <EmptyState title="Nothing handled yet">Messages you mark as handled will be kept here.</EmptyState>
        ) : (
          <EmptyState title="No messages waiting">New messages from the contact form appear here.</EmptyState>
        )
      ) : (
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-5">
          {list.map((m) => {
            const subject = encodeURIComponent(`Re: ${m.subject}`);
            return (
              <li key={m.id}>
                <article aria-labelledby={`msg-${m.id}`} className={`${card} grid gap-4`}>
                  <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-1">
                    <div className="min-w-0">
                      <h2 id={`msg-${m.id}`} className="font-display text-xl text-slate-ink">
                        {m.subject}
                      </h2>
                      <p className="text-sm text-stone-muted">From {m.full_name}</p>
                    </div>
                    <p className="text-sm text-stone-muted">
                      <When iso={m.created_at} />
                    </p>
                  </header>
                  <p className="whitespace-pre-line leading-relaxed text-slate-ink">{m.message}</p>
                  <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                    <li className="flex min-w-0 items-center gap-2">
                      <IconMail aria-hidden="true" size={18} stroke={1.75} className="shrink-0 text-amber" />
                      <a href={`mailto:${m.email}`} className="link [overflow-wrap:anywhere] text-slate-ink">
                        {m.email}
                      </a>
                    </li>
                    {m.phone && (
                      <li className="flex items-center gap-2">
                        <IconPhone aria-hidden="true" size={18} stroke={1.75} className="shrink-0 text-amber" />
                        <a href={`tel:${m.phone.replace(/[^\d+]/g, "")}`} className="link text-slate-ink">
                          {m.phone}
                        </a>
                      </li>
                    )}
                  </ul>
                  <div className="flex flex-wrap items-start gap-3 border-t border-rule pt-4">
                    {!handled && (
                      <a href={`mailto:${m.email}?subject=${subject}`} className="btn btn-fire min-h-11 px-5 py-2">
                        Reply by email
                      </a>
                    )}
                    <HandledButton id={m.id} handled={!!m.handled_at} />
                    {m.handled_at && <p className="self-center text-sm text-stone-muted">Handled {fullDate(m.handled_at)}</p>}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
