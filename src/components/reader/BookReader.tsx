"use client";

import { IconArrowLeft, IconChevronLeft, IconChevronRight, IconLock, IconZoomIn, IconZoomOut } from "@tabler/icons-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { authHeader } from "@/lib/supabase/client";

// Page-by-page reading of an e-book the member owns. Pages are images behind short-lived
// signed links (the PDF is never sent), fetched a few at a time and kept ahead of the reader.
// Where they stop is saved, so the book opens there next time on any device.

type Info = { slug: string; title: string; page_count: number; last_page: number; pages: { n: number; w: number | null; h: number | null }[] };
type Load = { status: "loading" } | { status: "ready"; info: Info } | { status: "error"; code: number; message: string };

const ZOOMS = [1, 1.25, 1.5, 2, 2.5];
/** Signed links last ten minutes; refetch a little before that. */
const LINK_LIFE_MS = 9 * 60 * 1000;
const AHEAD = 3;

export function BookReader({ slug }: { slug: string }) {
  const [load, setLoad] = useState<Load>({ status: "loading" });
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(0);
  const [urls, setUrls] = useState<Record<number, { url: string; at: number }>>({});
  const inflight = useRef(new Set<number>());
  const base = `/me/books/${encodeURIComponent(slug)}`;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const info = await api<Info>(base, { headers: await authHeader(), cache: "no-store" });
        if (cancelled) return;
        setLoad({ status: "ready", info });
        setPage(info.last_page);
      } catch (err) {
        if (!cancelled)
          setLoad({
            status: "error",
            code: err instanceof ApiError ? err.status : 0,
            message: err instanceof Error ? err.message : "This book can’t be opened right now.",
          });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [base]);

  const total = load.status === "ready" ? load.info.page_count : 0;

  /** Fetch signed links for pages from..from+7 that are missing or about to expire. */
  const fetchFrom = useCallback(
    async (from: number) => {
      if (inflight.current.has(from)) return;
      inflight.current.add(from);
      try {
        const list = await api<{ n: number; url: string | null }[]>(`${base}/pages?from=${from}&to=${from + 7}`, {
          headers: await authHeader(),
          cache: "no-store",
        });
        const now = Date.now();
        setUrls((u) => {
          const next = { ...u };
          for (const p of list) if (p.url) next[p.n] = { url: p.url, at: now };
          return next;
        });
      } catch {
        // The page shows a retry button if its image never arrives.
      } finally {
        inflight.current.delete(from);
      }
    },
    [base],
  );

  // Keep the current page and the next few ready.
  useEffect(() => {
    if (!total) return;
    const fresh = (n: number) => urls[n] && Date.now() - urls[n].at < LINK_LIFE_MS;
    const missing = Array.from({ length: AHEAD + 1 }, (_, i) => page + i).filter((n) => n <= total && !fresh(n));
    // Warm the browser cache for the next page so turning is instant.
    const next = urls[page + 1];
    if (next) new Image().src = next.url;
    if (!missing.length) return;
    const t = setTimeout(() => void fetchFrom(missing[0]!), 0);
    return () => clearTimeout(t);
  }, [page, total, urls, fetchFrom]);

  // Save where the reader is, a moment after they stop turning.
  useEffect(() => {
    if (!total) return;
    const t = setTimeout(async () => {
      try {
        await api(`${base}/progress`, { method: "PUT", headers: await authHeader(), body: JSON.stringify({ page }) });
      } catch {
        // Not critical: the next turn tries again.
      }
    }, 1200);
    return () => clearTimeout(t);
  }, [page, total, base]);

  const go = useCallback((n: number) => setPage((p) => (total ? Math.min(Math.max(n, 1), total) : p)), [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") go(page + 1);
      else if (e.key === "ArrowLeft" || e.key === "PageUp") go(page - 1);
      else if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 1, ZOOMS.length - 1));
      else if (e.key === "-") setZoom((z) => Math.max(z - 1, 0));
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, page]);

  // Back to the top of the page on every turn.
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0, left: 0 });
  }, [page]);

  // Swipe to turn on touch screens, when not zoomed in.
  const touch = useRef<{ x: number; y: number } | null>(null);

  if (load.status === "loading") return <Frame title="" />;
  if (load.status === "error") {
    const notOwned = load.code === 403;
    return (
      <Frame title="">
        <div className="mx-auto mt-16 max-w-md px-5 text-center text-chalk">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-chalk/10 text-flame">
            <IconLock aria-hidden="true" size={26} stroke={1.75} />
          </span>
          <h1 className="mt-6 font-display text-3xl">{notOwned ? "This book isn’t in your library" : load.code === 404 ? "Book not found" : "This book can’t be opened"}</h1>
          <p className="mt-3 text-chalk/75">
            {notOwned ? "Buy the e-book to read it here." : load.code === 404 ? "It may have been taken off the shop." : load.message}
          </p>
          <Link href={notOwned ? `/books/${slug}` : "/my-books"} className="btn btn-fire mt-8">
            {notOwned ? "See the book" : "Back to My books"}
          </Link>
        </div>
      </Frame>
    );
  }

  const { info } = load;
  if (info.page_count === 0)
    return (
      <Frame title={info.title}>
        <p className="mx-auto mt-16 max-w-md px-5 text-center text-chalk/80">
          This book is still being prepared for reading. Please check back soon.
        </p>
      </Frame>
    );

  const meta = info.pages[page - 1];
  const ratio = meta?.w && meta?.h ? meta.h / meta.w : 1.5;
  const current = urls[page];
  const scale = ZOOMS[zoom]!;

  return (
    <Frame
      title={info.title}
      controls={
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(z - 1, 0))}
            disabled={zoom === 0}
            aria-label="Zoom out"
            className="grid size-10 place-items-center rounded-full text-chalk hover:bg-chalk/10 disabled:opacity-40"
          >
            <IconZoomOut aria-hidden="true" size={20} stroke={1.75} />
          </button>
          <span className="w-12 text-center text-sm tabular-nums text-chalk/80" aria-live="polite">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(z + 1, ZOOMS.length - 1))}
            disabled={zoom === ZOOMS.length - 1}
            aria-label="Zoom in"
            className="grid size-10 place-items-center rounded-full text-chalk hover:bg-chalk/10 disabled:opacity-40"
          >
            <IconZoomIn aria-hidden="true" size={20} stroke={1.75} />
          </button>
        </div>
      }
      footer={<PageNav page={page} total={total} onGo={go} />}
    >
      <div
        ref={scroller}
        className="flex-1 overflow-auto overscroll-contain"
        onTouchStart={(e) => {
          if (zoom > 0 || e.touches.length !== 1) return;
          touch.current = { x: e.touches[0]!.clientX, y: e.touches[0]!.clientY };
        }}
        onTouchEnd={(e) => {
          const start = touch.current;
          touch.current = null;
          if (!start) return;
          const dx = e.changedTouches[0]!.clientX - start.x;
          const dy = e.changedTouches[0]!.clientY - start.y;
          if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(page + (dx < 0 ? 1 : -1));
        }}
      >
        <div className="mx-auto px-3 py-4 sm:px-6 sm:py-6" style={{ width: `min(${scale * 100}%, ${scale * 56}rem)`, minWidth: zoom > 0 ? `${scale * 100}%` : undefined }}>
          <div
            className="relative w-full select-none overflow-hidden rounded-sm bg-white shadow-[0_20px_50px_-20px_rgb(0_0_0/0.6)]"
            style={{ aspectRatio: `1 / ${ratio}` }}
          >
            {current ? (
              // eslint-disable-next-line @next/next/no-img-element -- signed, short-lived links; next/image would re-host them
              <img
                key={current.url}
                src={current.url}
                alt={`Page ${page} of ${total}`}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                onError={() =>
                  // The link expired: drop it so a fresh one is fetched.
                  setUrls((u) => {
                    const next = { ...u };
                    delete next[page];
                    return next;
                  })
                }
                className="absolute inset-0 size-full"
              />
            ) : (
              <div className="absolute inset-0 animate-pulse bg-limestone" aria-hidden="true" />
            )}
          </div>
        </div>
      </div>
    </Frame>
  );
}

function PageNav({ page, total, onGo }: { page: number; total: number; onGo: (n: number) => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <nav aria-label="Pages" className="flex items-center justify-between gap-3 px-3 py-2 sm:px-6">
      <button
        type="button"
        onClick={() => onGo(page - 1)}
        disabled={page <= 1}
        className="inline-flex min-h-11 items-center gap-1 rounded-full px-4 font-semibold text-chalk hover:bg-chalk/10 disabled:opacity-40"
      >
        <IconChevronLeft aria-hidden="true" size={20} stroke={2} />
        <span className="hidden sm:inline">Previous</span>
        <span className="sr-only sm:hidden">Previous page</span>
      </button>
      <form
        className="flex items-center gap-2 text-sm text-chalk/80"
        onSubmit={(e) => {
          e.preventDefault();
          const n = Number(draft);
          if (Number.isInteger(n)) onGo(n);
          setDraft(null);
        }}
      >
        <label htmlFor="reader-page">Page</label>
        <input
          id="reader-page"
          inputMode="numeric"
          value={draft ?? String(page)}
          onChange={(e) => setDraft(e.target.value.replace(/\D/g, ""))}
          onBlur={() => setDraft(null)}
          className="w-14 rounded-lg border border-chalk/20 bg-chalk/10 px-2 py-1.5 text-center tabular-nums text-chalk"
        />
        <span className="tabular-nums">of {total}</span>
      </form>
      <button
        type="button"
        onClick={() => onGo(page + 1)}
        disabled={page >= total}
        className="inline-flex min-h-11 items-center gap-1 rounded-full px-4 font-semibold text-chalk hover:bg-chalk/10 disabled:opacity-40"
      >
        <span className="hidden sm:inline">Next</span>
        <span className="sr-only sm:hidden">Next page</span>
        <IconChevronRight aria-hidden="true" size={20} stroke={2} />
      </button>
    </nav>
  );
}

/** The reader's dark frame: a top bar (back, title, zoom) and a bottom bar (pages). */
function Frame({
  title,
  controls,
  footer,
  children,
}: {
  title: string;
  controls?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 flex flex-col bg-slate-deep">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-chalk/10 px-3 sm:px-6">
        <Link href="/my-books" className="inline-flex min-h-11 items-center gap-1.5 rounded-full pr-3 text-sm font-semibold text-chalk/80 hover:text-chalk">
          <IconArrowLeft aria-hidden="true" size={18} stroke={2} />
          <span className="hidden sm:inline">My books</span>
          <span className="sr-only sm:hidden">Back to My books</span>
        </Link>
        <h1 className="min-w-0 flex-1 truncate text-center font-display text-lg text-chalk">{title}</h1>
        {controls ?? <span className="w-10" />}
      </header>
      <main id="main" className="flex min-h-0 flex-1 flex-col">
        {children}
      </main>
      {footer && <footer className="shrink-0 border-t border-chalk/10">{footer}</footer>}
    </div>
  );
}
