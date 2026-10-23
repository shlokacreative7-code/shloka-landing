import { cn } from "@/lib/utils";
import {
  archPath,
  insetPath,
  lockupMarkTransform,
  lockupViewBox,
  lockupWordTransform,
  markViewBox,
  sPath,
  wordPaths,
} from "./logo-art";

type Tone = "auto" | "light" | "dark";

// Light: navy arch, gold S, navy wordmark. Dark (on navy): gold arch, navy S, white wordmark.
// Auto follows the site theme.
const tones = {
  auto: {
    arch: "fill-navy dark:fill-gold",
    s: "fill-gold dark:fill-navy",
    inset: "stroke-gold dark:stroke-navy",
    word: "fill-navy dark:fill-ivory",
  },
  light: { arch: "fill-navy", s: "fill-gold", inset: "stroke-gold", word: "fill-navy" },
  dark: { arch: "fill-gold", s: "fill-navy", inset: "stroke-navy", word: "fill-white" },
} as const;

/**
 * The mark: a Lucknowi arch (a doorway, someone trusted at your door) holding the S of Shloka.
 * `detailed` adds the inner arch line, for large sizes only.
 */
export function LogoMark({
  tone = "auto",
  detailed = false,
  className,
}: {
  tone?: Tone;
  detailed?: boolean;
  className?: string;
}) {
  const colors = tones[tone];
  return (
    <svg viewBox={markViewBox} aria-hidden="true" className={className}>
      <path d={archPath} className={colors.arch} />
      {detailed && <path d={insetPath} fill="none" strokeWidth={1.3} className={colors.inset} />}
      <path d={sPath} className={colors.s} />
    </svg>
  );
}

/** Horizontal lockup: mark plus the "Shloka Care" wordmark, drawn as outlines so it renders identically everywhere. */
export function Logo({ tone = "auto", className }: { tone?: Tone; className?: string }) {
  const colors = tones[tone];
  return (
    <svg viewBox={lockupViewBox} aria-hidden="true" className={cn("h-10 w-auto", className)}>
      <g transform={lockupMarkTransform}>
        <path d={archPath} className={colors.arch} />
        <path d={sPath} className={colors.s} />
      </g>
      <g transform={lockupWordTransform} className={colors.word}>
        {wordPaths.map((d) => (
          <path key={d.slice(0, 24)} d={d} />
        ))}
      </g>
    </svg>
  );
}
