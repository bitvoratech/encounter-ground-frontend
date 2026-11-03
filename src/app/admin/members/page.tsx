import { IconSearch } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { RoleSelect } from "@/components/admin/RoleSelect";
import { card, EmptyState, PageHeader } from "@/components/admin/ui";
import { Avatar } from "@/components/school/Avatar";
import { adminGet, getStaff } from "@/lib/admin";
import type { Member } from "@/types/admin";

export const metadata: Metadata = { title: "Members" };

const joined = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default async function AdminMembersPage({ searchParams }: PageProps<"/admin/members">) {
  const staff = await getStaff();
  if (staff.status !== "staff") return null;
  if (staff.profile.role !== "admin")
    return (
      <EmptyState title="Members are for admins">
        Ask an administrator if you need to see the member list or change someone’s role.
      </EmptyState>
    );

  const { q } = await searchParams;
  const search = typeof q === "string" ? q.trim() : "";
  const members = await adminGet<Member[]>(staff.token, `/members${search ? `?q=${encodeURIComponent(search)}` : ""}`);

  return (
    <>
      <PageHeader title="Members">
        Everyone with an account, newest first. Editors can reply to checkpoints and messages; admins can also manage members.
      </PageHeader>

      <form role="search" action="/admin/members" className="mb-6 flex max-w-xl gap-2">
        <label htmlFor="member-search" className="sr-only">
          Search by name or email
        </label>
        <input
          id="member-search"
          name="q"
          type="search"
          defaultValue={search}
          placeholder="Name or email"
          className="min-h-12 min-w-0 flex-1 rounded-full border border-rule bg-chalk px-5 text-slate-ink"
        />
        <button type="submit" className="btn btn-fire px-5">
          <IconSearch aria-hidden="true" size={18} stroke={2} />
          Search
        </button>
      </form>

      {members.length === 0 ? (
        <EmptyState title="No one found">
          No member matches “{search}”.{" "}
          <Link href="/admin/members" className="link font-semibold text-slate-ink">
            Show everyone
          </Link>
        </EmptyState>
      ) : (
        <section aria-label={search ? `Members matching “${search}”` : "All members"} className={`${card} p-0 md:p-0`}>
          <div aria-hidden="true" className="hidden grid-cols-[minmax(0,1fr)_8rem_5rem_9.5rem] gap-4 border-b border-rule px-6 py-3 text-sm font-semibold text-stone-muted md:grid">
            <span>Member</span>
            <span>Joined</span>
            <span className="text-right">Classes</span>
            <span>Role</span>
          </div>
          <ul className="divide-y divide-rule">
            {members.map((m) => {
              const name = m.full_name || m.email || "Member";
              const self = m.id === staff.profile.id;
              return (
                <li key={m.id} className="grid grid-cols-[minmax(0,1fr)_9rem] items-center gap-x-4 gap-y-3 px-5 py-4 md:grid-cols-[minmax(0,1fr)_8rem_5rem_9.5rem] md:px-6">
                  <div className="col-span-2 flex min-w-0 items-center gap-3 md:col-span-1">
                    <Avatar name={name} src={null} size={40} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-ink">
                        {name}
                        {self && <span className="font-normal text-stone-muted"> (you)</span>}
                      </p>
                      {m.full_name && m.email && <p className="truncate text-sm text-stone-muted">{m.email}</p>}
                    </div>
                  </div>
                  <p className="text-sm text-stone-muted md:text-base md:text-slate">
                    <span className="md:sr-only">Joined </span>
                    {joined(m.created_at)}
                    <span className="md:hidden">
                      {" "}
                      · {m.enrolments} {m.enrolments === 1 ? "class" : "classes"}
                    </span>
                  </p>
                  <p className="hidden text-right tabular-nums md:block">
                    <span className="sr-only">Classes: </span>
                    {m.enrolments}
                  </p>
                  <div>
                    {self ? (
                      <p className="px-3 font-medium capitalize text-slate">{m.role}</p>
                    ) : (
                      <RoleSelect id={m.id} name={name} role={m.role} />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </>
  );
}
