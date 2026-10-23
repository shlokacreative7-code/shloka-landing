import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Healthcare line doodles (48 x 48), drawn in currentColor for faint section backgrounds. */
const doodles = {
  stethoscope: (
    <>
      <path d="M13 6h-3v10a10 10 0 0 0 20 0V6h-3" />
      <path d="M20 26v4a9 9 0 0 0 18 0v-5" />
      <circle cx="38" cy="21" r="4" />
    </>
  ),
  heartPulse: (
    <>
      <path d="M24 41C13 34 6 27.5 6 19.5A8.5 8.5 0 0 1 24 14a8.5 8.5 0 0 1 18 5.5C42 27.5 35 34 24 41Z" />
      <path d="M11 24h8l3-6 4 11 3-5h8" />
    </>
  ),
  cross: <path d="M19 7h10v12h12v10H29v12H19V29H7V19h12Z" />,
  wheelchair: (
    <>
      <circle cx="17" cy="8" r="3.5" />
      <path d="M17 14v13h12l5 11" />
      <path d="M17 20h9" />
      <path d="M12 22a11 11 0 1 0 16 15" />
    </>
  ),
  calendar: (
    <>
      <rect x="7" y="10" width="34" height="31" rx="4" />
      <path d="M7 19h34M16 6v8M32 6v8" />
      <path d="m17 30 5 5 9-9" />
    </>
  ),
  shield: (
    <>
      <path d="M24 5l15 6v11c0 10-6.5 17-15 21-8.5-4-15-11-15-21V11Z" />
      <path d="m17 24 5 5 9-10" />
    </>
  ),
  hands: (
    <>
      <path d="M24 23c-4.5-3.2-8-5.8-8-9.4a4 4 0 0 1 8-1.2 4 4 0 0 1 8 1.2c0 3.6-3.5 6.2-8 9.4Z" />
      <path d="m4 26 6 2 7 8h7M44 26l-6 2-7 8h-7" />
      <path d="M10 28v13M38 28v13" />
    </>
  ),
  phone: (
    <>
      <rect x="13" y="5" width="22" height="38" rx="4" />
      <path d="M21 37h6" />
      <path d="M19 15h10a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-6l-3 3v-3h-1a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2Z" />
    </>
  ),
  clipboard: (
    <>
      <rect x="10" y="9" width="28" height="34" rx="3" />
      <rect x="18" y="5" width="12" height="7" rx="2" />
      <path d="m16 22 3 3 5-5M28 23h5M16 33l3 3 5-5M28 34h5" />
    </>
  ),
  home: (
    <>
      <path d="M6 23 24 8l18 15" />
      <path d="M11 19v22h26V19" />
      <path d="M24 35c-3.5-2.5-6-4.6-6-7.3a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 2.7-2.5 4.8-6 7.3Z" />
    </>
  ),
  hospital: (
    <>
      <path d="M9 42V13h30v29M5 42h38" />
      <path d="M24 18v9M19.5 22.5h9" />
      <path d="M15 33h4M29 33h4M21 42v-6h6v6" />
    </>
  ),
  clock: (
    <>
      <circle cx="24" cy="24" r="17" />
      <path d="M24 14v10l7 4" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type DoodleName = keyof typeof doodles;

export type DoodleSpot = {
  name: DoodleName;
  /** Position inside the field, e.g. "8%" or "calc(100% - 6rem)". */
  x: string;
  y: string;
  size: number;
  rotate?: number;
  /** Seconds, so neighbouring doodles drift out of step. */
  delay?: number;
  duration?: number;
  /** Doodles are hidden on phones unless marked, to keep small screens calm. */
  mobile?: boolean;
};

/** A field of slowly drifting doodles. Sits behind its section, so the parent needs `relative isolate`. */
export function DoodleField({ spots, className }: { spots: DoodleSpot[]; className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
      {spots.map((spot) => (
        <svg
          key={`${spot.name}-${spot.x}-${spot.y}`}
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("absolute motion-safe:animate-float", !spot.mobile && "hidden sm:block")}
          style={
            {
              left: spot.x,
              top: spot.y,
              width: spot.size,
              height: spot.size,
              rotate: `${spot.rotate ?? 0}deg`,
              animationDelay: `${spot.delay ?? 0}s`,
              animationDuration: `${spot.duration ?? 9}s`,
            } as CSSProperties
          }
        >
          {doodles[spot.name]}
        </svg>
      ))}
    </div>
  );
}
