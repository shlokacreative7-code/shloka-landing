import { archPath, sPath } from "@/components/ui/logo-art";

/** First-visit curtain: the arch draws itself, the S appears, then the curtain lifts. Animated in globals.css. */
export function Intro() {
  return (
    <div className="intro" aria-hidden="true">
      <svg viewBox="-2 -2 64 76" className="h-28 w-auto">
        <path className="intro-arch" d={archPath} pathLength={1} fill="none" stroke="#C9A227" strokeWidth={1.2} />
        <path className="intro-s" d={sPath} fill="#C9A227" />
      </svg>
    </div>
  );
}
