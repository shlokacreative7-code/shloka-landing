"use client";

import { MessageCircle, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { useState, type ReactNode } from "react";
import { introDelay } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { easeOutExpo } from "@/components/ui/reveal";
import { VisitCard } from "./visit-card";

// Same arch as the scene's backdrop (hero-care.svg), drawn as a gold outline offset behind it.
const SCENE_ARCH = "M16 372V150C16 98.16 82.24 57.84 160 6C237.76 57.84 304 98.16 304 150V372Z";

/** Pops in after `delay` (straight away with reduced motion). */
function Enter({ delay, className, children }: { delay: number; className?: string; children: ReactNode }) {
  const still = useReducedMotion();
  return (
    <motion.div
      initial={still ? false : { opacity: 0, y: 16, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.8, ease: easeOutExpo }}
      className={cn("absolute z-10", className)}
    >
      {children}
    </motion.div>
  );
}

/** Circular "verified" seal: its text turns slowly, and faster as the page scrolls. */
function Seal({ spin }: { spin?: MotionValue<number> }) {
  return (
    <motion.div
      style={spin ? { rotate: spin } : undefined}
      className="relative size-28 rounded-full bg-card shadow-card ring-1 ring-line sm:size-32"
    >
      <svg viewBox="0 0 120 120" aria-hidden="true" className="size-full motion-safe:animate-[spin_28s_linear_infinite]">
        <path id="hero-seal-ring" d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1-90 0" fill="none" />
        <text className="fill-ink text-[12.5px] font-extrabold tracking-[0.12em] uppercase">
          <textPath href="#hero-seal-ring" textLength="280" lengthAdjust="spacing">
            Verified · Trained · Trusted ·
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-0 m-auto grid size-13 place-items-center rounded-full bg-navy text-gold sm:size-14 dark:bg-gold dark:text-navy">
        <ShieldCheck aria-hidden="true" className="size-6" strokeWidth={1.75} />
      </span>
    </motion.div>
  );
}

/**
 * The hero's right-hand side: the illustrated scene, an example live visit, a WhatsApp update and a seal.
 * `progress` (0 to 1 as the hero scrolls away) tilts the scene back in 3D.
 */
export function HeroComposition({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const [offset] = useState(introDelay);
  const rotateX = useTransform(progress, [0, 1], [0, 26]);
  const scale = useTransform(progress, [0, 1], [1, 0.78]);
  const y = useTransform(progress, [0, 1], [0, 110]);
  const opacity = useTransform(progress, [0.45, 1], [1, 0.25]);
  const spin = useTransform(progress, [0, 1], [0, 220]);

  return (
    <motion.figure
      style={reduce ? undefined : { rotateX, scale, y, opacity, transformPerspective: 1100 }}
      className="relative mx-auto w-full max-w-[34rem] origin-bottom sm:pb-32"
    >
      <div className="relative mr-[3%] ml-auto w-[80%]">
        <svg
          aria-hidden="true"
          viewBox="0 0 320 380"
          fill="none"
          className="absolute inset-0 translate-x-3 -translate-y-3 sm:translate-x-5 sm:-translate-y-5"
        >
          <path d={SCENE_ARCH} className="stroke-gold" strokeWidth={1.25} strokeOpacity={0.7} />
        </svg>
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: offset, duration: 1.2, ease: easeOutExpo }}
          className="relative"
        >
          <Image src="/illustrations/hero-care.svg" alt="" width={320} height={380} priority className="h-auto w-full" />
        </motion.div>
      </div>

      <Enter delay={offset + 1.1} className="-top-2 right-0 sm:-top-4">
        <Seal spin={reduce ? undefined : spin} />
      </Enter>

      <Enter delay={offset + 2.8} className="top-[9%] left-0 hidden sm:block">
        <div
          className="flex max-w-[15rem] items-center gap-3 rounded-2xl bg-card/95 p-3 pr-4 shadow-card ring-1 ring-line backdrop-blur-sm motion-safe:animate-float"
          style={{ animationDuration: "10s" }}
        >
          <span
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center rounded-full bg-navy text-gold dark:bg-gold dark:text-navy"
          >
            <MessageCircle className="size-5" strokeWidth={1.75} />
          </span>
          <span className="leading-snug">
            <span className="block text-sm font-bold text-ink">WhatsApp update</span>
            <span className="block text-[0.8125rem] text-muted">Prescription photo sent to you.</span>
          </span>
        </div>
      </Enter>

      <VisitCard
        delayOffset={offset}
        className="relative -mt-4 w-[88%] sm:absolute sm:bottom-0 sm:left-0 sm:mt-0 sm:w-[17rem]"
      />

      <figcaption className="sr-only">An example of the updates you’d see during a visit.</figcaption>
    </motion.figure>
  );
}
