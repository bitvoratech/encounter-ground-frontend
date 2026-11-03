"use client";

import { IconCheck, IconRotate } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { setMessageHandled } from "@/lib/adminActions";

/** Moves a contact message between "To answer" and "Handled". */
export function HandledButton({ id, handled }: { id: string; handled: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  return (
    <div>
      <button
        type="button"
        disabled={pending}
        onClick={async () => {
          setPending(true);
          setError("");
          try {
            await setMessageHandled(id, !handled);
            router.refresh();
          } catch {
            setError("That didn’t save. Please try again.");
          } finally {
            setPending(false);
          }
        }}
        className="btn btn-quiet min-h-11 px-5 py-2 text-slate-ink"
      >
        {handled ? <IconRotate aria-hidden="true" size={18} stroke={2} /> : <IconCheck aria-hidden="true" size={18} stroke={2} />}
        {pending ? "Saving…" : handled ? "Move back to To answer" : "Mark as handled"}
      </button>
      {error && (
        <p role="alert" className="mt-1 text-sm font-semibold text-amber">
          {error}
        </p>
      )}
    </div>
  );
}
