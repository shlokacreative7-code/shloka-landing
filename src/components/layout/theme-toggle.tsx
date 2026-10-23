"use client";

import { Moon, Sun } from "lucide-react";
import type { MouseEvent } from "react";
import { applyTheme, useTheme } from "@/lib/theme";

/** Light/dark switch. Where supported, the new theme spreads out in a circle from the button. */
export function ThemeToggle() {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  function onClick(event: MouseEvent<HTMLButtonElement>) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduce) {
      applyTheme(next);
      return;
    }
    // Keyboard clicks report (0, 0), so fall back to the button's centre.
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX || rect.left + rect.width / 2;
    const y = event.clientY || rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition = document.startViewTransition(() => applyTheme(next));
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 750, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className="grid size-11 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors hover:border-ink"
    >
      {theme === "dark" ? (
        <Sun aria-hidden="true" className="size-5" strokeWidth={1.75} />
      ) : (
        <Moon aria-hidden="true" className="size-5" strokeWidth={1.75} />
      )}
    </button>
  );
}
