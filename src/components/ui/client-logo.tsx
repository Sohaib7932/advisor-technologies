import Image from "next/image";
import type { Client } from "@/lib/content";
import { cn, monogram } from "@/lib/utils";

/**
 * A client's logo on a white tile, sized by `className` (e.g. "size-12
 * rounded-xl"). Logos come from public/clients-logos/clean/ (see
 * scripts/clean-logos.mjs): transparent, trimmed and centred, so they all
 * sit the same way. Falls back to the
 * navy monogram badge for a client without a logo.
 */
export function ClientLogo({
  client,
  className,
  sizes = "64px",
  labelled = false,
}: {
  client: Client;
  /** Give the logo alt text. Leave off when the name is shown beside it. */
  labelled?: boolean;
  className?: string;
  /** Rendered width hint for the image optimiser. */
  sizes?: string;
}) {
  if (!client.logo) {
    const badge = monogram(client.name);
    return (
      <span
        {...(labelled
          ? { role: "img", "aria-label": client.name, title: client.name }
          : { "aria-hidden": true })}
        className={cn(
          "grid shrink-0 place-items-center bg-linear-to-br from-brand to-navy px-1 font-display font-semibold tracking-wider text-white",
          badge.length > 3 ? "text-xs" : "text-xs",
          className,
        )}
      >
        {badge}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "relative block shrink-0 overflow-hidden bg-white",
        className,
      )}
    >
      <Image
        src={client.logo}
        alt={labelled ? client.name : ""}
        fill
        sizes={sizes}
        className="object-contain p-1"
      />
    </span>
  );
}
