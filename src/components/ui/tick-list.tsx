import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** Short list of promises, each with a gold tick on a navy dot (gold on navy in the dark theme). */
export function TickList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("grid gap-3.5 font-semibold text-ink", className)}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-3.5">
          <span
            aria-hidden="true"
            className="grid size-[1.875rem] shrink-0 place-items-center rounded-full bg-navy text-gold dark:bg-gold dark:text-navy"
          >
            <Check className="size-4" strokeWidth={2.5} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
