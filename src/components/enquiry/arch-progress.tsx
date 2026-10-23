"use client";

import { motion } from "motion/react";
import { archPath, sPath } from "@/components/ui/logo-art";
import { easeOutExpo } from "@/components/ui/reveal";

/**
 * Progress drawn as the logo's arch: the gold outline grows with each step, and when the
 * request is sent the arch fills in and the S appears.
 */
export function ArchProgress({ step, total, done }: { step: number; total: number; done: boolean }) {
  return (
    <div className="relative h-16 w-14 shrink-0">
      <svg viewBox="-2 -2 64 76" aria-hidden="true" className="absolute inset-0 size-full overflow-visible">
        <path d={archPath} fill="none" className="stroke-white/15" strokeWidth={2.5} />
        <motion.path
          d={archPath}
          className="fill-gold stroke-gold"
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={false}
          animate={{ pathLength: done ? 1 : (step + 1) / total, fillOpacity: done ? 1 : 0 }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
        />
        <motion.path
          d={sPath}
          className="fill-navy"
          initial={false}
          animate={{ opacity: done ? 1 : 0, scale: done ? 1 : 0.6 }}
          transition={{ delay: done ? 0.4 : 0, duration: 0.5, ease: easeOutExpo }}
          style={{ transformOrigin: "30px 46px" }}
        />
      </svg>
      {!done && (
        <span className="absolute inset-x-0 bottom-1.5 text-center font-serif text-2xl leading-none text-white">{step + 1}</span>
      )}
    </div>
  );
}
