"use client";

import { createClient } from "./supabase/client";

// Turns a book's PDF into page images in the admin's browser and uploads them to the private
// book-pages bucket. The reader only ever serves these images, never the PDF, so a buyer can
// read but not download the book file.

/** Pages are rendered this wide: sharp on a phone at 2x and readable zoomed in on a laptop. */
const TARGET_WIDTH = 1500;
const QUALITY = 0.82;
const PARALLEL_UPLOADS = 3;

export type PageImage = { file: string; width: number; height: number };

async function toBlob(canvas: HTMLCanvasElement): Promise<{ blob: Blob; ext: "webp" | "jpg" }> {
  const webp = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", QUALITY));
  // Browsers that can't encode WebP hand back a PNG instead; use JPEG there.
  if (webp?.type === "image/webp") return { blob: webp, ext: "webp" };
  const jpg = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", QUALITY));
  if (!jpg) throw new Error("This browser couldn’t make the page images. Try Chrome or Edge.");
  return { blob: jpg, ext: "jpg" };
}

/**
 * Render every page of `file` and upload it under `<bookId>/<uploadId>/`. Returns the folder
 * and the pages, for PUT /admin/books/:id/pages.
 */
export async function uploadBookPages(
  bookId: string,
  file: File,
  onProgress: (done: number, total: number, stage: "reading" | "pages") => void,
) {
  onProgress(0, 0, "reading");
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

  const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
  let pdf: import("pdfjs-dist").PDFDocumentProxy;
  try {
    pdf = await task.promise;
  } catch (err) {
    const name = (err as { name?: string })?.name;
    throw new Error(
      name === "PasswordException"
        ? "This PDF is password-protected. Save a copy without a password and upload that."
        : "This file couldn’t be opened as a PDF.",
    );
  }

  const folder = `${bookId}/${crypto.randomUUID()}`;
  const storage = createClient().storage.from("book-pages");
  const total = pdf.numPages;
  const pages: PageImage[] = new Array(total);
  let done = 0;
  let next = 1;
  onProgress(0, total, "pages");

  async function worker() {
    const canvas = document.createElement("canvas");
    while (next <= total) {
      const n = next++;
      const page = await pdf.getPage(n);
      const base = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: TARGET_WIDTH / base.width });
      canvas.width = Math.round(viewport.width);
      canvas.height = Math.round(viewport.height);
      await page.render({ canvas, viewport, background: "#ffffff" }).promise;
      page.cleanup();
      const { blob, ext } = await toBlob(canvas);
      const name = `${n}.${ext}`;
      const { error } = await storage.upload(`${folder}/${name}`, blob, { contentType: blob.type, upsert: true });
      if (error) throw new Error(`Page ${n} didn’t upload: ${error.message}`);
      pages[n - 1] = { file: name, width: canvas.width, height: canvas.height };
      onProgress(++done, total, "pages");
    }
  }

  try {
    await Promise.all(Array.from({ length: Math.min(PARALLEL_UPLOADS, total) }, worker));
  } finally {
    await task.destroy();
  }
  return { folder, pages };
}
