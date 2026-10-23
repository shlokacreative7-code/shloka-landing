"use client";

import { Lock } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { easeOutExpo } from "@/components/ui/reveal";

const timeline = [
  { time: "9:02 am", text: "Visit started with your code" },
  { time: "12:15 pm", text: "Doctor seen, reports collected" },
  { time: "Next", text: "Pharmacy, then home", upcoming: true },
];

/**
 * Example live visit. Updates arrive one by one, the way they would during a real visit.
 * With reduced motion everything is shown straight away.
 */
export function VisitCard({ className, delayOffset = 0 }: { className?: string; delayOffset?: number }) {
  const still = useReducedMotion();
  return (
    <motion.div
      initial={still ? false : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delayOffset + 0.5, duration: 0.9, ease: easeOutExpo }}
      className={cn("rounded-3xl bg-card p-5 shadow-card ring-1 ring-line", className)}
    >
      <div className="flex items-start justify-between gap-3 border-b border-line pb-4">
        <div>
          <p className="font-serif text-2xl leading-tight text-ink">Hospital Assist</p>
          <p className="mt-0.5 text-sm text-muted">Today · 9 am to 5 pm</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-navy px-3 py-1.5 text-xs font-bold tracking-[0.08em] text-white uppercase dark:bg-gold dark:text-navy">
          <span aria-hidden="true" className="size-2 rounded-full bg-gold motion-safe:animate-live dark:bg-navy" />
          Live
        </span>
      </div>

      <ol className="grid gap-3.5 pt-4 pb-2">
        {timeline.map((item, index) => (
          <motion.li
            key={item.time}
            initial={still ? false : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delayOffset + 1.1 + index * 0.7, duration: 0.6, ease: easeOutExpo }}
            className={cn(
              "relative pl-7 text-[0.9375rem] leading-snug text-copy",
              "before:absolute before:top-1 before:left-0 before:size-3 before:rounded-full",
              item.upcoming ? "text-muted before:border-2 before:border-gold before:bg-card" : "before:bg-ink",
              "not-last:after:absolute not-last:after:top-5 not-last:after:-bottom-4.5 not-last:after:left-[calc(0.375rem-1px)] not-last:after:w-0.5 not-last:after:bg-line",
            )}
          >
            <time className="block text-[0.8125rem] font-bold text-ink">{item.time}</time>
            {item.text}
          </motion.li>
        ))}
      </ol>

      <div className="mt-2 flex items-center justify-between gap-3 rounded-2xl bg-canvas-soft py-2.5 pr-2.5 pl-3.5 text-[0.8125rem] leading-snug font-semibold text-ink">
        <span className="flex items-center gap-2">
          <Lock aria-hidden="true" className="size-4.5 shrink-0" strokeWidth={1.75} />
          Ends when you share the end code
        </span>
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-navy text-[0.6875rem] font-extrabold tracking-[0.06em] text-gold dark:bg-gold dark:text-navy">
          SOS
        </span>
      </div>
    </motion.div>
  );
}
