import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AnimatedHeadline } from "./animated-headline";
import { Reveal } from "./reveal";

type Tone = "auto" | "dark";

/** Small uppercase label with a gold rule, shown above section headings. */
export function Eyebrow({ children, tone = "auto" }: { children: ReactNode; tone?: Tone }) {
  return (
    <p
      className={cn(
        "mb-5 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.16em]",
        tone === "dark" ? "text-gold" : "text-ink dark:text-gold",
      )}
    >
      <span aria-hidden="true" className="h-0.5 w-8 bg-gold" />
      {children}
    </p>
  );
}

/**
 * Section heading. `title` is plain text; wrap the words to emphasise in [brackets],
 * e.g. "Trust is [the whole job.]", to set them in gold-underlined italic.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  tone = "auto",
  className,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const parts = title
    .split(/(\[[^\]]+\])/)
    .filter(Boolean)
    .map((text) => (text.startsWith("[") ? { text: text.slice(1, -1), highlight: true } : { text: text.trim() }))
    .filter((part) => part.text);

  return (
    <div className={cn("mb-12 max-w-[48rem] sm:mb-16", className)}>
      <Reveal y={10}>
        <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      </Reveal>
      <AnimatedHeadline
        id={id}
        parts={parts}
        className={cn("text-[clamp(2.5rem,5.4vw,4.5rem)]", tone === "dark" && "text-white")}
      />
      {description && (
        <Reveal delay={0.2}>
          <p className="mt-6 text-[1.1875rem]">{description}</p>
        </Reveal>
      )}
    </div>
  );
}
