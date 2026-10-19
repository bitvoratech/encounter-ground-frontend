/** A labelled progress bar; the label carries the numbers, so the bar itself is hidden from screen readers. */
export function ProgressBar({ finished, total, className = "" }: { finished: number; total: number; className?: string }) {
  const percent = total ? Math.round((finished / total) * 100) : 0;
  return (
    <div className={className}>
      <p className="flex justify-between text-sm">
        <span className="font-semibold text-slate-ink">
          {finished} of {total} lessons done
        </span>
        <span className="text-stone-muted">{percent}%</span>
      </p>
      <div aria-hidden="true" className="mt-2 h-2 overflow-hidden rounded-full bg-rule">
        <div className="h-full rounded-full bg-flame transition-[width] duration-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
