"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { setMemberRole } from "@/lib/adminActions";
import type { Role } from "@/types/admin";

const roles: { value: Role; label: string }[] = [
  { value: "member", label: "Member" },
  { value: "editor", label: "Editor" },
  { value: "admin", label: "Admin" },
];

/** Changes a member's role as soon as a new one is picked; making someone an admin asks first. */
export function RoleSelect({ id, name, role }: { id: string; name: string; role: Role }) {
  const router = useRouter();
  const fieldId = useId();
  const [value, setValue] = useState(role);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  return (
    <div>
      <label htmlFor={fieldId} className="sr-only">
        Role for {name}
      </label>
      <select
        id={fieldId}
        value={value}
        disabled={pending}
        onChange={async (e) => {
          const next = e.target.value as Role;
          if (next === "admin" && !window.confirm(`Make ${name} an admin? Admins can see every member and change roles.`)) return;
          const previous = value;
          setValue(next);
          setPending(true);
          setError("");
          try {
            await setMemberRole(id, next);
            router.refresh();
          } catch (err) {
            setValue(previous);
            setError(err instanceof Error ? err.message : "That didn’t save. Please try again.");
          } finally {
            setPending(false);
          }
        }}
        className="min-h-11 w-full rounded-xl border border-rule bg-limestone px-3 font-medium text-slate-ink"
      >
        {roles.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
      {error && (
        <p role="alert" className="mt-1 text-sm font-semibold text-amber">
          {error}
        </p>
      )}
    </div>
  );
}
