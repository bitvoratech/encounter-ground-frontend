import { IconPlus, IconSchool } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge } from "@/components/admin/fields";
import { card, EmptyState, PageHeader } from "@/components/admin/ui";
import { adminGet, getStaff } from "@/lib/admin";
import type { AdminCourseSummary } from "@/types/admin";

export const metadata: Metadata = { title: "Classes" };

export default async function AdminClassesPage() {
  const staff = await getStaff();
  if (staff.status !== "staff") return null;
  const courses = await adminGet<AdminCourseSummary[]>(staff.token, "/courses");

  return (
    <>
      <PageHeader
        title="Classes"
        actions={
          <Link href="/admin/classes/new" className="btn btn-fire px-4 py-2">
            <IconPlus aria-hidden="true" size={18} stroke={2} />
            Add a class
          </Link>
        }
      >
        The Beth-El Institute classes. Open one to edit its details, modules, lessons and final check.
      </PageHeader>

      {courses.length === 0 ? (
        <EmptyState title="No classes yet">Add the first class, then its modules and lessons.</EmptyState>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((c) => (
            <li key={c.id}>
              <Link
                href={`/admin/classes/${c.id}`}
                className={`${card} flex h-full flex-col transition-[border-color,box-shadow] hover:border-stone hover:shadow-md`}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-flame/15 text-amber">
                    <IconSchool aria-hidden="true" size={20} stroke={1.75} />
                  </span>
                  <StatusBadge status={c.status} />
                </span>
                <span className="mt-4 text-lg font-bold text-slate-ink">{c.title}</span>
                {c.summary && <span className="mt-1 line-clamp-2 block text-[0.9375rem] text-stone-muted">{c.summary}</span>}
                <span aria-hidden="true" className="min-h-5 flex-1" />
                <span className="grid grid-cols-3 gap-2 border-t border-rule/80 pt-4 text-center">
                  {[
                    [c.module_count, "module", "modules"],
                    [c.lesson_count, "lesson", "lessons"],
                    [c.enrolments, "student", "students"],
                  ].map(([n, one, many]) => (
                    <span key={one}>
                      <span className="block text-lg font-bold tabular-nums text-slate-ink">{n}</span>
                      <span className="block text-xs text-stone-muted">{n === 1 ? one : many}</span>
                    </span>
                  ))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
