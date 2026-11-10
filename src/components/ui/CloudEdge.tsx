/**
 * A cloud border between two sections. Colour it (via a text-* class) with the background of the
 * section BELOW it. By default it overlaps the bottom of the section above. With `flip`, it hangs
 * from the top of the section it sits in (use that for sections with a photo background, where the
 * cloud should be the colour of the section above).
 */
export function CloudEdge({ className = "text-limestone", flip = false }: { className?: string; flip?: boolean }) {
  return <div aria-hidden="true" className={`cloud-edge ${flip ? "cloud-edge-flip" : ""} ${className}`} />;
}