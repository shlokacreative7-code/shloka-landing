"use client";

import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/ui/logo";
import { easeOutExpo } from "@/components/ui/reveal";

export type TicketRow = { label: string; value: string };

// Decorative "barcode" at the foot of the ticket.
const BARS = [3, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 3, 1, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 2, 1, 3, 1, 2];

/** A care-request ticket that fills in live as questions are answered, and is stamped when sent. */
export function Ticket({ rows, activeLabel, sent }: { rows: TicketRow[]; activeLabel?: string; sent: boolean }) {
  return (
    <aside aria-label="Your request so far" className="relative">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-ivory text-slate shadow-[0_40px_90px_-30px_rgb(0_0_0/0.65)]">
        <div className="flex items-center justify-between gap-3 px-6 pt-6">
          <div className="flex items-center gap-3">
            <LogoMark tone="light" className="h-10 w-auto" />
            <div className="leading-tight">
              <p className="font-bold text-navy">Care request</p>
              <p className="text-sm text-slate/75">Lucknow pilot</p>
            </div>
          </div>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-bold tracking-[0.12em] uppercase transition-colors duration-500",
              sent ? "bg-navy text-gold" : "border border-navy/20 text-navy/70",
            )}
          >
            {sent ? "Sent" : "Draft"}
          </span>
        </div>

        {/* Perforation, with notches cut into the sides. */}
        <div
          aria-hidden="true"
          className="relative my-5 border-t-2 border-dashed border-navy/15 before:absolute before:top-1/2 before:-left-3 before:size-6 before:-translate-y-1/2 before:rounded-full before:bg-band after:absolute after:top-1/2 after:-right-3 after:size-6 after:-translate-y-1/2 after:rounded-full after:bg-band"
        />

        <dl className="grid gap-3.5 px-6">
          {rows.map((row) => {
            const active = row.label === activeLabel && !sent;
            return (
              <div key={row.label} className="relative pl-4">
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-1 bottom-1 left-0 w-1 rounded-full transition-colors duration-300",
                    active ? "bg-gold" : row.value ? "bg-navy/15" : "bg-transparent",
                  )}
                />
                <dt className="text-xs font-bold tracking-[0.14em] text-slate/70 uppercase">{row.label}</dt>
                <dd className="min-h-7 font-serif text-[1.375rem] leading-tight text-navy">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={row.value || "empty"}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3, ease: easeOutExpo }}
                      className={cn("block", !row.value && "text-navy/25")}
                    >
                      {row.value || (active ? "…" : "—")}
                    </motion.span>
                  </AnimatePresence>
                </dd>
              </div>
            );
          })}
        </dl>

        <div aria-hidden="true" className="mt-6 flex items-end justify-between gap-4 border-t border-navy/10 px-6 py-5">
          <div className="flex h-9 items-end gap-[3px]">
            {BARS.map((width, i) => (
              <span key={i} className="h-full bg-navy/70" style={{ width }} />
            ))}
          </div>
          <span className="text-[0.6875rem] font-bold tracking-[0.2em] text-navy/50 uppercase">Shloka Care</span>
        </div>
      </div>

      <AnimatePresence>
        {sent && (
          <motion.div
            aria-hidden="true"
            initial={{ scale: 2.4, opacity: 0, rotate: -24 }}
            animate={{ scale: 1, opacity: 1, rotate: -12 }}
            transition={{ type: "spring", stiffness: 320, damping: 16, delay: 0.25 }}
            className="absolute top-28 right-5 rounded-xl border-4 border-gold bg-ivory/60 px-4 py-1 text-2xl font-extrabold tracking-[0.25em] text-gold"
          >
            SENT
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
