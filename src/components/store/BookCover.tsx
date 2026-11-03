import { IconBook2 } from "@tabler/icons-react";
import Image from "next/image";

/**
 * A book's cover, 2:3. Covers are either the website's own images or uploads on Supabase
 * Storage (allowed in next.config.ts); a book without one gets a plain placeholder.
 */
export function BookCover({
  cover,
  alt = "",
  sizes,
  priority,
  className = "",
}: {
  cover: string | null;
  alt?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (!cover)
    return (
      <span role={alt ? "img" : undefined} aria-label={alt || undefined} className={`grid aspect-[2/3] place-items-center bg-limestone text-stone ${className}`}>
        <IconBook2 aria-hidden="true" size={32} stroke={1.25} />
      </span>
    );
  return <Image src={cover} alt={alt} width={683} height={1024} sizes={sizes} priority={priority} className={`aspect-[2/3] object-cover ${className}`} />;
}
