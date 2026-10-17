import { Icon } from "@/components/ui/icons";
import type { IconName } from "@/lib/content";

/**
 * Card that floods with brand navy from the bottom up on hover. Used for short lists of commitments: values, assurances, reasons.
 * Put it inside a <Reveal>, never on one: the reveal's transition and the
 * hover transition must live on separate elements.
 */
export function FloodCard({
  index,
  icon,
  title,
  body,
}: {
  index: number;
  icon: IconName;
  title: string;
  body: string;
}) {
  return (
    <div className="group relative isolate h-full overflow-hidden card-surface rounded-card p-7 transition-[translate,box-shadow] duration-500 ease-out-soft hover:-translate-y-1 hover:shadow-glow sm:p-8">
      <span
        aria-hidden
        className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-linear-to-t from-brand to-brand-deep transition-transform duration-600 ease-out-soft group-hover:scale-y-100"
      />
      <div className="flex items-center justify-between">
        <span className="grid size-12 place-items-center rounded-full bg-glow text-bg transition-colors duration-500 group-hover:bg-fg">
          <Icon name={icon} className="size-5" />
        </span>
        <span
          aria-hidden
          className="font-display text-5xl leading-none font-bold text-white/6 transition-colors duration-500 group-hover:text-glow/30"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-10 font-display text-xl font-bold text-fg uppercase">
        {title}
      </h3>
      <p className="mt-2.5 text-sm leading-relaxed text-fg-muted">
        {body}
      </p>
    </div>
  );
}
