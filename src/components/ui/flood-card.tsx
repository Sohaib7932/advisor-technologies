import { Icon } from "@/components/ui/icons";
import type { IconName } from "@/lib/content";

/**
 * Light card that floods navy from the bottom up on hover, flipping its copy
 * to white. Used for short lists of commitments: values, assurances, reasons.
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
    <div className="group relative isolate h-full overflow-hidden rounded-card bg-canvas p-7 ring-1 ring-navy-900/8 transition-[translate,box-shadow] duration-500 ease-out-soft hover:-translate-y-1 hover:shadow-lift sm:p-8">
      <span
        aria-hidden
        className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-navy-950 transition-transform duration-600 ease-out-soft group-hover:scale-y-100"
      />
      <div className="flex items-center justify-between">
        <span className="grid size-12 place-items-center rounded-full bg-navy-950 text-white transition-colors duration-500 group-hover:bg-white group-hover:text-navy-900">
          <Icon name={icon} className="size-5" />
        </span>
        <span
          aria-hidden
          className="font-display text-5xl leading-none font-bold text-navy-900/6 transition-colors duration-500 group-hover:text-white/10"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-10 font-display text-xl font-semibold text-ink transition-colors duration-500 group-hover:text-white">
        {title}
      </h3>
      <p className="mt-2.5 text-sm leading-relaxed text-graphite-600 transition-colors duration-500 group-hover:text-navy-200">
        {body}
      </p>
    </div>
  );
}
