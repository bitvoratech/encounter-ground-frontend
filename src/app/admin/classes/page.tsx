import { IconPlus } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge } from "@/components/admin/fields";
import { card, EmptyState, PageHeader } from "@/components/admin/ui";
import { adminGet, getStaff } from "@/lib/admin";
import type { AdminCourseSummary } from "@/types/admin";

export const metadata: Metadata = { title: "Classes" };

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export default async function AdminClassesPage() {
  const staff = await getStaff();
  if (staff.status !== "staff") return null;
  const courses = await adminGet<AdminCourseSummary[]>(staff.token, "/courses");

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader title="Classes">The Beth-El Institute classes. Open one to edit its details, modules, lessons and final check.</PageHeader>
        <Link href="/admin/classes/new" className="btn btn-fire min-h-11 px-5 py-2">
          <IconPlus aria-hidden="true" size={18} stroke={2} />
          Add a class
        </Link>
      </div>

      {courses.length === 0 ? (
        <EmptyState title="No classes yet">Add the first class, then its modules and lessons.</EmptyState>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {courses.map((c) => (
            <li key={c.id}>
              <Link href={`/admin/classes/${c.id}`} className={`${card} block h-full transition-colors hover:border-slate`}>
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-display text-2xl text-slate-ink">{c.title}</span>
                  <StatusBadge status={c.status} />
                </span>
                {c.summary && <span className="mt-2 line-clamp-2 block text-stone-muted">{c.summary}</span>}
                <span className="mt-3 block text-sm text-slate">
                  {plural(c.module_count, "module", "modules")} · {plural(c.lesson_count, "lesson", "lessons")} ·{" "}
                  {plural(c.enrolments, "student", "students")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
