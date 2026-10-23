"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Current year, read in the browser so the prerendered page never goes stale. */
export function Year() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => null,
  );
  return <span>{year}</span>;
}
