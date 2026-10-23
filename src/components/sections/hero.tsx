"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { heroPoints } from "@/content/home";
import { site } from "@/content/site";
import { AnimatedHeadline } from "@/components/ui/animated-headline";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { TickList } from "@/components/ui/tick-list";
import { DoodleField, type DoodleSpot } from "@/components/visuals/doodles";
import { HeroComposition } from "@/components/visuals/hero-composition";

const doodles: DoodleSpot[] = [
  { name: "stethoscope", x: "3%", y: "14%", size: 64, rotate: -12 },
  { name: "cross", x: "44%", y: "12%", size: 40, rotate: 8, delay: 2 },
  { name: "heartPulse", x: "88%", y: "82%", size: 60, rotate: 6, delay: 1, mobile: true },
  { name: "calendar", x: "40%", y: "86%", size: 52, rotate: -8, delay: 3 },
  { name: "wheelchair", x: "2%", y: "84%", size: 56, rotate: 4, delay: 4 },
];

// Heartbeat line across the bottom of the hero: four beats, 1440 units wide.
const BEAT = "l14-8 10 8h12l9-52 11 86 9-34h16l12-12 14 12";
const ECG = `M0 70h120${BEAT}h253${BEAT}h253${BEAT}h253${BEAT}h133`;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // 0 while the hero fills the screen, 1 once it has scrolled away.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_55%_65%_at_8%_35%,var(--color-ivory),transparent_75%)] pt-32 pb-32 sm:pt-36 sm:pb-40 lg:pt-40 lg:pb-44 dark:bg-[radial-gradient(ellipse_60%_60%_at_80%_30%,rgb(201_162_39/0.14),transparent_70%)]"
    >
      <DoodleField spots={doodles} className="text-ink/[0.07]" />

      <svg
        aria-hidden="true"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        fill="none"
        className="pointer-events-none absolute inset-x-0 bottom-4 -z-10 h-20 w-full text-gold sm:bottom-6 sm:h-24"
      >
        <path d={ECG} pathLength={1000} stroke="currentColor" strokeOpacity={0.22} strokeWidth={1.5} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        <path
          d={ECG}
          pathLength={1000}
          stroke="currentColor"
          strokeWidth={2.5}
          strokeDasharray="70 930"
          strokeDashoffset={1000}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="motion-safe:animate-ecg"
        />
      </svg>

      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <motion.div style={reduce ? undefined : { y: textY, opacity: textOpacity }}>
          <Reveal y={10}>
            <p className="mb-7 inline-flex items-center gap-2.5 rounded-full bg-card px-4 py-2 text-[0.9375rem] font-bold text-ink shadow-[0_1px_2px_rgb(11_31_58/0.06)] ring-1 ring-line">
              <span aria-hidden="true" className="size-2 rounded-full bg-gold motion-safe:animate-live" />
              {site.status}
            </p>
          </Reveal>
          <AnimatedHeadline
            as="h1"
            trigger="mount"
            className="text-[clamp(3rem,7vw,6rem)] leading-[0.98]"
            parts={[{ text: "When you can’t be there," }, { text: "someone you can trust", highlight: true }, { text: "will be." }]}
          />
          <Reveal delay={0.7}>
            <p className="mt-8 max-w-xl text-lead">
              {site.name} sends verified, trained companions to look after the people you love: at the hospital, at
              home, and for the errands that can’t wait. You’ll know who is coming, when they arrive and how the visit
              went.
            </p>
            <div className="mt-10 flex flex-wrap gap-3.5">
              <Button href="#enquire" size="lg">
                Tell us what you need
              </Button>
              <Button href="#how-it-works" variant="ghost" size="lg" arrow={false} className="bg-canvas/70">
                See how it works
              </Button>
            </div>
            <TickList items={heroPoints} className="mt-10" />
          </Reveal>
        </motion.div>

        <HeroComposition progress={scrollYProgress} />
      </div>
    </section>
  );
}
