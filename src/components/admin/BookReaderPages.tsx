"use client";

import { IconBook, IconFileTypePdf } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { setBookPages } from "@/lib/adminActions";
import { uploadBookPages } from "@/lib/pdfPages";
import type { AdminBook } from "@/types/admin";
import { errorText } from "./fields";
import { card } from "./ui";

const MAX_PDF = 200 * 1024 * 1024;

/** Upload the book's PDF; the browser turns it into the page images buyers read. */
export function BookReaderPages({ book }: { book: AdminBook }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<{ done: number; total: number; stage: "reading" | "pages" | "saving" } | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const busy = progress !== null;

  return (
    <section aria-labelledby="reader-pages" className={`${card} grid gap-4`}>
      <div>
        <h2 id="reader-pages" className="font-display text-xl text-slate-ink">
          Book file for the reader
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-stone-muted">
          Upload the e-book as a PDF. Each page is turned into an image here in your browser, and buyers read those images
          on the site; the PDF itself is never stored or offered for download. Keep this tab open until it finishes.
        </p>
      </div>

      <p className="flex items-center gap-2 font-semibold text-slate-ink">
        <IconBook aria-hidden="true" size={20} stroke={1.75} className="text-amber" />
        {book.pages_ready ? `Ready to read: ${book.page_count} pages` : "No book file yet. Buyers will see “Being prepared for reading”."}
      </p>

      <input
        ref={fileRef}
        type="file"
        accept="application/pdf"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          if (file.size > MAX_PDF) return setError("The PDF must be smaller than 200 MB.");
          if (book.pages_ready && !window.confirm("Replace the pages buyers read with this PDF?")) return;
          setError("");
          setSaved("");
          try {
            const { folder, pages } = await uploadBookPages(book.id, file, (done, total, stage) => setProgress({ done, total, stage }));
            setProgress({ done: pages.length, total: pages.length, stage: "saving" });
            const { page_count } = await setBookPages(book.id, folder, pages);
            setSaved(`Done: ${page_count} pages are ready to read.`);
            router.refresh();
          } catch (err) {
            setError(errorText(err));
          } finally {
            setProgress(null);
          }
        }}
      />
      <div className="flex flex-wrap items-center gap-4">
        <button type="button" disabled={busy} onClick={() => fileRef.current?.click()} className="btn btn-quiet min-h-11 px-5 py-2 text-slate-ink">
          <IconFileTypePdf aria-hidden="true" size={18} stroke={1.75} />
          {book.pages_ready ? "Replace the PDF" : "Upload the PDF"}
        </button>
        {progress && (
          <div className="min-w-48 flex-1" role="status">
            <p className="text-sm font-semibold text-slate-ink">
              {progress.stage === "reading"
                ? "Opening the PDF…"
                : progress.stage === "saving"
                  ? "Saving…"
                  : `Preparing page ${Math.min(progress.done + 1, progress.total)} of ${progress.total}…`}
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-rule" aria-hidden="true">
              <div
                className="h-full bg-flame transition-[width]"
                style={{ width: `${progress.total ? Math.round((progress.done / progress.total) * 100) : 0}%` }}
              />
            </div>
          </div>
        )}
        {error && (
          <p role="alert" className="text-sm font-semibold text-amber">
            {error}
          </p>
        )}
        {saved && !error && (
          <p role="status" className="text-sm font-semibold text-slate">
            {saved}
          </p>
        )}
      </div>
    </section>
  );
}
