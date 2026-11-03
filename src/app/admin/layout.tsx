import type { Metadata } from "next";
import { connection } from "next/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminNotice } from "@/components/admin/ui";
import { getOverview, getStaff } from "@/lib/admin";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Encounter Ground admin" },
  robots: { index: false },
};

/** The ministry team's dashboard. Only editors and admins get past this layout. */
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  await connection();
  const staff = await getStaff();
  if (staff.status === "forbidden")
    return (
      <AdminNotice title="This area is for the ministry team">
        Your account doesn’t have access to the admin dashboard. If you think it should, ask an administrator to give you a role.
      </AdminNotice>
    );
  if (staff.status === "unavailable")
    return (
      <AdminNotice title="The dashboard can’t be reached">
        The server isn’t answering right now. Please refresh in a moment.
      </AdminNotice>
    );

  // The sidebar's counts; if they fail, the page itself reports the problem.
  const overview = await getOverview(staff.token).catch(() => null);
  const counts = { checkpoints: overview?.counts.checkpoints_waiting ?? 0, messages: overview?.counts.messages_open ?? 0 };

  return (
    <AdminShell profile={staff.profile} counts={counts}>
      {children}
    </AdminShell>
  );
}
