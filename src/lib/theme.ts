import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

export function useTheme(): Theme {
  return useSyncExternalStore(
    subscribe,
    () => (document.documentElement.dataset.theme === "dark" ? "dark" : "light"),
    () => "light",
  );
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Storage blocked (private mode): the theme still applies for this page view.
  }
}

/** Seconds to hold entrance animations while the intro curtain is still covering the page. */
export function introDelay() {
  if (typeof document === "undefined") return 0;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return document.documentElement.dataset.intro === "skip" || reduce ? 0 : 1.2;
}
