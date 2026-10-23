"use client";

import { ArrowRight, CalendarCheck, Hash, IdCard, MessageCircle, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { steps } from "@/content/home";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

// One look per step: the cards stack in turn, so each gets its own colour block.
const looks: { icon: LucideIcon; card: string; number: string; iconRing: string }[] = [
  { icon: CalendarCheck, card: "border border-line bg-card text-copy", number: "text-gold", iconRing: "bg-navy text-gold dark:bg-gold dark:text-navy" },
  { icon: IdCard, card: "on-dark bg-navy text-white/80 ring-1 ring-gold/25 [&_h3]:text-white", number: "text-gold", iconRing: "bg-gold text-navy" },
  { icon: Hash, card: "bg-gold text-navy/85 [&_h3]:text-navy", number: "text-navy/40", iconRing: "bg-navy text-gold" },
  { icon: MessageCircle, card: "bg-ivory text-slate [&_h3]:text-navy", number: "text-gold", iconRing: "bg-navy text-gold" },
];

function StepCard({ index, total, progress }: { index: number; total: number; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const step = steps[index]!;
  const look = looks[index]!;
  const Icon = look.icon;
  // Each card shrinks back a little as the ones after it stack on top.
  const scale = useTransform(progress, [index / total, 1], [1, 1 - (total - index) * 0.045]);

  // The <li> itself is sticky, so every card pins inside the whole list rather than its own box.
  return (
    <li className="sticky top-0 flex h-[78vh] items-start pt-28 lg:h-[82vh] lg:pt-32">
      <motion.article
        style={{ scale: reduce ? 1 : scale, top: `${index * 1.75}rem` }}
        className={cn(
          "relative grid w-full origin-top gap-6 overflow-hidden rounded-[2rem] p-8 shadow-[0_30px_80px_-40px_rgb(11_31_58/0.5)] sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16 lg:p-16",
          look.card,
        )}
      >
        <div>
          <span aria-hidden="true" className={cn("block text-[clamp(4.5rem,9vw,8rem)] leading-[0.8] type-display", look.number)}>
            0{index + 1}
          </span>
          <h3 className="mt-6 font-serif text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.02] font-normal">{step.title}</h3>
          <p className="mt-4 max-w-xl text-lead">{step.body}</p>
        </div>
        <span
          aria-hidden="true"
          className={cn("hidden size-48 place-items-center rounded-t-full rounded-b-[2.5rem] lg:grid", look.iconRing)}
        >
          <Icon className="size-20" strokeWidth={1.25} />
        </span>
      </motion.article>
    </li>
  );
}

export function HowItWorks() {
  const container = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end end"] });

  return (
    <section id="how-it-works" aria-labelledby="how-title" className="relative isolate bg-canvas pt-section pb-24 sm:pb-32">
      <div className="container-x">
        <SectionHeading
          id="how-title"
          eyebrow="How it works"
          title="Four steps. [No guesswork.]"
          description="Booking takes a couple of minutes, and you’re kept in the loop the whole way through."
          className="mb-0"
        />

        <ol ref={container} className="relative">
          {steps.map((step, index) => (
            <StepCard key={step.title} index={index} total={steps.length} progress={scrollYProgress} />
          ))}
        </ol>

        <Reveal className="mt-12 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 rounded-3xl border border-line bg-canvas-soft px-7 py-6 sm:mt-16">
          <p className="max-w-[44rem] font-medium text-ink">
            We’re opening with a small pilot in Lucknow, so your first visits will be arranged with you personally over
            a call or WhatsApp.
          </p>
          <a href="#enquire" className="group inline-flex min-h-11 items-center gap-2 font-bold whitespace-nowrap text-ink">
            Join the pilot
            <ArrowRight
              aria-hidden="true"
              className="size-5 transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
              strokeWidth={2}
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
