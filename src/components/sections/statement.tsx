"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

// Words in [brackets] are set in italic: gold-underlined navy in the light theme, gold in the dark theme.
const STATEMENT =
  "Distance shouldn’t decide who looks after the people you love. We’re building the most [trusted] way to [be there,] even when you can’t.";

function Word({ word, highlight, progress, range }: { word: string; highlight: boolean; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className={cn(highlight && "italic underline decoration-gold decoration-[0.05em] underline-offset-[0.14em] dark:text-gold")}>
      {word}
    </motion.span>
  );
}

/** A giant sentence whose words light up one by one as it scrolls through the screen. */
export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });

  const words: { word: string; highlight: boolean }[] = [];
  let inHighlight = false;
  for (const raw of STATEMENT.split(" ")) {
    const opens = raw.startsWith("[");
    const closes = raw.includes("]");
    words.push({ word: raw.replace(/[[\]]/g, ""), highlight: inHighlight || opens });
    inHighlight = (inHighlight || opens) && !closes;
  }

  return (
    <section aria-label="Our promise" className="relative isolate overflow-hidden bg-canvas py-section">
      <div className="container-x">
        <p
          ref={ref}
          className="mx-auto max-w-[64rem] text-center text-[clamp(2.25rem,5.2vw,4.75rem)] type-display text-ink"
        >
          {words.map(({ word, highlight }, i) => (
            <span key={`${word}-${i}`}>
              {reduce ? (
                <span className={cn(highlight && "italic underline decoration-gold decoration-[0.05em] underline-offset-[0.14em] dark:text-gold")}>{word}</span>
              ) : (
                <Word word={word} highlight={highlight} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
              )}
              {i < words.length - 1 && " "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
