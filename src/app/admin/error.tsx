"use client";

import { IconRefresh } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

/** When an admin page's data can't be loaded: say so, and offer to try again. */
export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="rounded-3xl border border-rule bg-chalk p-8 text-center">
      <h1 className="font-display text-3xl text-slate-ink">This page couldn’t be loaded</h1>
      <p className="mx-auto mt-2 max-w-md text-stone-muted">The server didn’t answer. Please try again in a moment.</p>
      <button
        type="button"
        // The data comes from the server, so fetch the page again before re-rendering it.
        onClick={() => startTransition(() => (router.refresh(), reset()))}
        className="btn btn-fire mt-6"
      >
        <IconRefresh aria-hidden="true" size={18} stroke={2} />
        Try again
      </button>
    </div>
  );
}
