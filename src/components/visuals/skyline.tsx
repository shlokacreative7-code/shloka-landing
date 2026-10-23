"use client";

import { motion, useReducedMotion } from "motion/react";
import { easeOutExpo } from "@/components/ui/reveal";
import { skylineClock, skylinePaths, skylineViewBox } from "./skyline-art";

const draw = (index: number) => ({
  hidden: { pathLength: 0, opacity: 0 },
  shown: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 2.2, delay: index * 0.03, ease: easeOutExpo },
      opacity: { duration: 0.2, delay: index * 0.03 },
    },
  },
});

/** Line-art Lucknow skyline (Bara Imambara, Rumi Darwaza, Husainabad Clock Tower) that draws itself in. */
export function Skyline({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.svg
      viewBox={skylineViewBox}
      fill="none"
      aria-hidden="true"
      className={className}
      initial={reduceMotion ? "shown" : "hidden"}
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -5% 0px" }}
    >
      <g stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        {skylinePaths.map((d, index) => (
          <motion.path key={d} d={d} variants={draw(index)} />
        ))}
        <motion.circle {...skylineClock} variants={draw(skylinePaths.length)} />
      </g>
    </motion.svg>
  );
}
