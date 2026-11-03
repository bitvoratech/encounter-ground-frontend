"use client";

import { IconPhoto, IconTrash, IconUpload } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useId, useRef, useState } from "react";
import { createBook, deleteBook, updateBook, uploadCover, type BookInput } from "@/lib/adminActions";
import type { AdminBook } from "@/types/admin";
import { card } from "./ui";
import { errorText, FormMessage, SelectField, slugify, statusOptions, TextArea, TextField } from "./fields";

const currencies = [
  { code: "NGN", label: "Naira (₦)", step: "1" },
  { code: "USD", label: "US dollars (US$)", step: "0.01" },
  { code: "CAD", label: "Canadian dollars (CA$)", step: "0.01" },
] as const;

type Code = (typeof currencies)[number]["code"];

/** Minor units → what the team types: 750000 kobo → "7500", 1299 cents → "12.99". */
const toMajor = (minor: number | undefined) => (minor === undefined ? "" : String(minor / 100));

/** Add or edit a book: details, cover, prices per currency, and whether it is on the shop. */
export function BookForm({ book }: { book?: AdminBook }) {
  const router = useRouter();
  const [title, setTitle] = useState(book?.title ?? "");
  const [slug, setSlug] = useState(book?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!book);
  const [subtitle, setSubtitle] = useState(book?.subtitle ?? "");
  const [author, setAuthor] = useState(book?.author ?? "Toyin Bello");
  const [audience, setAudience] = useState(book?.audience ?? "");
  const [description, setDescription] = useState(book?.description ?? "");
  const [cover, setCover] = useState(book?.cover_image_url ?? "");
  const [amazon, setAmazon] = useState(book?.amazon_url ?? "");
  const [pages, setPages] = useState(book?.page_count ? String(book.page_count) : "");
  const [order, setOrder] = useState(String(book?.sort_order ?? 0));
  const [status, setStatus] = useState(book?.status ?? "draft");
  const [prices, setPrices] = useState<Record<Code, string>>({
    NGN: toMajor(book?.prices.NGN),
    USD: toMajor(book?.prices.USD),
    CAD: toMajor(book?.prices.CAD),
  });
  const [uploading, setUploading] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const coverId = useId();

  function input(): BookInput | string {
    const minor: BookInput["prices"] = {};
    for (const { code, label } of currencies) {
      const raw = prices[code].trim().replace(/,/g, "");
      if (!raw) continue;
      const value = Number(raw);
      if (!Number.isFinite(value) || value < 0) return `Check the price in ${label}.`;
      minor[code] = Math.round(value * 100);
    }
    if (status === "published" && Object.keys(minor).length === 0) return "Add at least one price before publishing the book.";
    return {
      title,
      slug,
      subtitle,
      author,
      audience,
      description,
      cover_image_url: cover,
      amazon_url: amazon,
      page_count: pages ? Number(pages) : null,
      sort_order: Number(order) || 0,
      status,
      prices: minor,
    };
  }

  return (
    <form
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        const data = input();
        setSaved("");
        if (typeof data === "string") return setError(data);
        setError("");
        setPending(true);
        try {
          if (book) {
            await updateBook(book.id, data);
            setSaved("Saved.");
            router.refresh();
          } else {
            const { id } = await createBook(data);
            router.push(`/admin/books/${id}?saved=1`);
          }
        } catch (err) {
          setError(errorText(err));
        } finally {
          setPending(false);
        }
      }}
      className="grid gap-6"
    >
      <section aria-labelledby="book-details" className={`${card} grid gap-5`}>
        <h2 id="book-details" className="font-sans text-lg font-bold text-slate-ink">
          Details
        </h2>
        <TextField
          label="Title"
          required
          maxLength={200}
          value={title}
          onChange={(v) => {
            setTitle(v);
            if (!slugTouched) setSlug(slugify(v));
          }}
        />
        <TextField
          label="Web address"
          required
          maxLength={80}
          value={slug}
          onChange={(v) => {
            setSlugTouched(true);
            setSlug(v.toLowerCase().replace(/\s+/g, "-"));
          }}
          hint={
            <>
              The book’s page will be at <span className="font-mono">/books/{slug || "…"}</span>. Changing it breaks links people
              have saved.
            </>
          }
        />
        <TextField label="Subtitle" optional maxLength={300} value={subtitle} onChange={setSubtitle} />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Author" optional maxLength={120} value={author} onChange={setAuthor} />
          <TextField
            label="Who it’s for"
            optional
            maxLength={80}
            value={audience}
            onChange={setAudience}
            placeholder="Adults, Teenage girls, Journal…"
          />
        </div>
        <TextArea label="Description" optional rows={6} maxLength={5000} value={description} onChange={setDescription} />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Number of pages" optional type="number" min={1} inputMode="numeric" value={pages} onChange={setPages} />
          <TextField
            label="Paperback on Amazon"
            optional
            type="url"
            placeholder="https://"
            value={amazon}
            onChange={setAmazon}
          />
        </div>
      </section>

      <section aria-labelledby="book-cover" className={`${card} grid gap-4`}>
        <h2 id="book-cover" className="font-sans text-lg font-bold text-slate-ink">
          Cover
        </h2>
        <div className="flex flex-wrap items-start gap-5">
          <div className="grid aspect-[2/3] w-32 shrink-0 place-items-center overflow-hidden rounded-xl border border-rule bg-limestone">
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element -- uploaded covers live on Supabase Storage
              <img src={cover} alt="The current cover" className="size-full object-cover" />
            ) : (
              <IconPhoto aria-hidden="true" size={32} stroke={1.5} className="text-stone" />
            )}
          </div>
          <div className="grid gap-3">
            <input
              ref={fileRef}
              id={coverId}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                if (file.size > 5 * 1024 * 1024) return setError("The cover must be smaller than 5 MB.");
                setError("");
                setUploading(true);
                try {
                  setCover(await uploadCover(file));
                  setSaved(book ? "Cover uploaded. Save the book to keep it." : "");
                } catch (err) {
                  setError(errorText(err));
                } finally {
                  setUploading(false);
                }
              }}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="btn btn-quiet min-h-11 px-5 py-2 text-slate-ink"
            >
              <IconUpload aria-hidden="true" size={18} stroke={1.75} />
              {uploading ? "Uploading…" : cover ? "Replace cover" : "Upload a cover"}
            </button>
            <p className="max-w-xs text-sm text-stone-muted">A JPG, PNG or WebP image, portrait (2:3), up to 5 MB.</p>
            {cover && (
              <button
                type="button"
                onClick={() => setCover("")}
                className="justify-self-start text-sm font-semibold text-stone-muted underline-offset-4 hover:text-slate-ink hover:underline"
              >
                Remove cover
              </button>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="book-prices" className={`${card} grid gap-4`}>
        <div>
          <h2 id="book-prices" className="font-sans text-lg font-bold text-slate-ink">
            E-book prices
          </h2>
          <p className="mt-1 text-sm text-stone-muted">
            Each currency has its own price; nothing is converted. Leave a currency empty to not sell in it.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {currencies.map((c) => (
            <TextField
              key={c.code}
              label={c.label}
              type="number"
              min={0}
              step={c.step}
              inputMode="decimal"
              value={prices[c.code]}
              onChange={(v) => setPrices((p) => ({ ...p, [c.code]: v }))}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="book-shop" className={`${card} grid gap-5 sm:grid-cols-2`}>
        <h2 id="book-shop" className="font-sans text-lg font-bold text-slate-ink sm:col-span-2">
          On the shop
        </h2>
        <SelectField label="Status" value={status} onChange={setStatus} options={statusOptions} />
        <TextField
          label="Position in the shop"
          type="number"
          min={0}
          inputMode="numeric"
          value={order}
          onChange={setOrder}
          hint="Lower numbers come first."
        />
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending || uploading} className="btn btn-fire min-h-11 px-6 py-2">
          {pending ? "Saving…" : book ? "Save changes" : "Add the book"}
        </button>
        <FormMessage error={error} saved={saved} />
        {book && <DeleteBook book={book} />}
      </div>
    </form>
  );
}

function DeleteBook({ book }: { book: AdminBook }) {
  const router = useRouter();
  const [error, setError] = useState("");
  return (
    <div className="ms-auto text-right">
      <button
        type="button"
        onClick={async () => {
          if (!window.confirm(`Delete “${book.title}”? This can’t be undone.`)) return;
          setError("");
          try {
            await deleteBook(book.id);
            router.push("/admin/books");
            router.refresh();
          } catch (err) {
            setError(errorText(err));
          }
        }}
        className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-stone-muted hover:text-slate-ink"
      >
        <IconTrash aria-hidden="true" size={18} stroke={1.75} />
        Delete book
      </button>
      {error && (
        <p role="alert" className="mt-1 max-w-xs text-sm font-semibold text-amber">
          {error}
        </p>
      )}
    </div>
  );
}
