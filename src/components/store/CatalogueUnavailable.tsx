/** Shown in place of the cart, wishlist or checkout when the catalogue can't be loaded, so the
 * visitor's saved books don't look lost: they're still kept on this device. */
export function CatalogueUnavailable() {
  return (
    <div role="alert" className="mt-10 flex flex-col items-start gap-4 rounded-3xl border border-rule bg-chalk p-8 md:p-12">
      <h2 className="text-h3 text-slate-ink">The bookstore can’t be loaded right now</h2>
      <p className="max-w-md text-stone-muted">Your books are still saved on this device. Please refresh in a moment.</p>
    </div>
  );
}
