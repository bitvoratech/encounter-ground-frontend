import type { Metadata } from "next";
import Link from "next/link";
import { CheckpointReply } from "@/components/admin/CheckpointReply";
import { card, EmptyState, PageHeader, Tabs, When } from "@/components/admin/ui";
import { adminGet, getOverview, getStaff } from "@/lib/admin";
import type { CheckpointSubmission } from "@/types/admin";

export const metadata: Metadata = { title: "Checkpoints" };

export default async function AdminCheckpointsPage({ searchParams }: PageProps<"/admin/checkpoints">) {
  const staff = await getStaff();
  if (staff.status !== "staff") return null;
  const replied = (await searchParams).status === "replied";
  const [list, overview] = await Promise.all([
    adminGet<CheckpointSubmission[]>(staff.token, replied ? "/checkpoints?status=reviewed" : "/checkpoints"),
    getOverview(staff.token),
  ]);

  return (
    <>
      <PageHeader title="Checkpoints">
        What students wrote at the end of each module. Your reply appears on their lesson and their dashboard. If a student
        rewrites a checkpoint, it comes back here for a fresh reply.
      </PageHeader>
      <Tabs
        label="Checkpoints"
        tabs={[
          { href: "/admin/checkpoints", label: "Waiting", count: overview.counts.checkpoints_waiting, current: !replied },
          { href: "/admin/checkpoints?status=replied", label: "Replied", current: replied },
        ]}
      />

      {list.length === 0 ? (
        replied ? (
          <EmptyState title="No replies yet">Checkpoints you reply to will be kept here.</EmptyState>
        ) : (
          <EmptyState title="All caught up">Every checkpoint has a reply. New ones appear here as students write them.</EmptyState>
        )
      ) : (
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-5">
          {list.map((c) => {
            const name = c.student_name || c.student_email || "A student";
            return (
              <li key={c.id}>
                <article aria-labelledby={`cp-${c.id}`} className={`${card} grid gap-4`}>
                  <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-1">
                    <div className="min-w-0">
                      <h2 id={`cp-${c.id}`} className="font-display text-xl text-slate-ink">
                        {name}
                      </h2>
                      <p className="text-sm text-stone-muted">
                        <Link href={`/school/classes/${c.course_slug}/${c.lesson_slug}`} className="hover:text-slate-ink hover:underline">
                          {c.course_name} · {c.lesson_title}
                        </Link>
                        {c.student_name && c.student_email && <span className="[overflow-wrap:anywhere]"> · {c.student_email}</span>}
                      </p>
                    </div>
                    <p className="text-sm text-stone-muted">
                      <When iso={c.submitted_at} prefix="Written " />
                    </p>
                  </header>
                  {c.prompt && <p className="border-l-2 border-flame pl-3 text-sm italic text-stone-muted">{c.prompt}</p>}
                  <p className="whitespace-pre-line leading-relaxed text-slate-ink">{c.body}</p>
                  <CheckpointReply
                    id={c.id}
                    studentName={name.split(" ")[0]!}
                    feedback={c.feedback}
                    repliedBy={
                      c.reviewed_at && (
                        <>
                          Replied{c.reviewer_name && ` by ${c.reviewer_name}`} · <When iso={c.reviewed_at} />
                        </>
                      )
                    }
                  />
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
