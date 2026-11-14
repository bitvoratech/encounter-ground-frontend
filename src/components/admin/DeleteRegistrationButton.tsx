"use client";

import { IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteRegistration } from "@/lib/adminActions";

/** Removes a registration (a test sign-up, a duplicate). Admins only; asks first. */
export function DeleteRegistrationButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  return (
    <div>
      <button
        type="button"
        disabled={pending}
        aria-label={`Remove ${name}’s registration`}
        onClick={async () => {
          if (!window.confirm(`Remove ${name}’s registration? This can’t be undone.`)) return;
          setPending(true);
          setError("");
          try {
            await deleteRegistration(id);
            router.refresh();
          } catch {
            setError("That didn’t work. Please try again.");
          } finally {
            setPending(false);
          }
        }}
        className="grid size-10 place-items-center rounded-lg text-stone-muted transition-colors hover:bg-limestone hover:text-slate-ink disabled:opacity-50"
      >
        <IconTrash aria-hidden="true" size={18} stroke={1.75} />
      </button>
      {error && (
        <p role="alert" className="text-xs font-semibold text-amber">
          {error}
        </p>
      )}
    </div>
  );
}
