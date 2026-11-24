import { Icon } from "@/components/ui/icons";
import type { IconName } from "@/lib/content";

/**
 * A short commitment (assurances, reasons): icon tile, number, title, body.
 * On hover the card lifts and its icon tile turns navy and tips, the same
 * move as the division rows. Put it inside a <Reveal>, never on one.
 */
export function FloodCard({ index, icon, title, body }: { index: number; icon: IconName; title: string; body: string }) {
  return (
    <div className="group card relative h-full p-5 transition-[translate] duration-500 ease-out-expo hover:-translate-y-1 lift sm:p-7 lg:p-8">
      <div className="flex items-center justify-between">
        <span className="grid size-12 place-items-center rounded-2xl bg-ice text-steel transition-[background-color,color,rotate] duration-500 ease-out-expo group-hover:-rotate-6 group-hover:bg-navy group-hover:text-sky">
          <Icon name={icon} className="size-5" />
        </span>
        <span aria-hidden className="font-display text-sm font-bold text-steel tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-8 text-h4 text-navy">{title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-text-2">{body}</p>
    </div>
  );
}
