"use client";

import { TriangleAlert } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useState } from "react";
import { trustPoints } from "@/content/home";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { easeOutExpo, Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { DoodleField, type DoodleSpot } from "@/components/visuals/doodles";
import { phoneScreens } from "@/components/visuals/phone-screens";

const doodles: DoodleSpot[] = [
  { name: "shield", x: "86%", y: "4%", size: 72, rotate: 8, mobile: true },
  { name: "heartPulse", x: "62%", y: "10%", size: 46, rotate: -10, delay: 2 },
  { name: "stethoscope", x: "4%", y: "92%", size: 60, rotate: 14, delay: 4 },
  { name: "cross", x: "94%", y: "94%", size: 40, rotate: -4, delay: 1 },
];

/** A phone frame. On desktop it tilts in 3D with the section's scroll progress. */
function Phone({ screen, tilt, className }: { screen: number; tilt?: MotionValue<number>; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      style={tilt && !reduce ? { rotateY: tilt, transformPerspective: 1200 } : undefined}
      className={cn(
        "relative mx-auto aspect-[9/18.5] w-full max-w-[19rem] rounded-[3rem] border-[10px] border-navy-raised bg-canvas shadow-[0_0_0_1px_rgb(201_162_39/0.35),0_40px_90px_-30px_rgb(201_162_39/0.35)]",
        className,
      )}
    >
      <div className="flex h-11 items-center justify-between px-6 pt-1 text-xs font-bold text-ink">
        <span>9:02</span>
        <span aria-hidden="true" className="h-6 w-24 rounded-full bg-navy-raised" />
        <span>5G</span>
      </div>
      <div className="relative h-[calc(100%-2.75rem)] overflow-hidden rounded-b-[2.3rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={screen}
            initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduce ? undefined : { opacity: 0, y: -24, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: easeOutExpo }}
            className="h-full"
          >
            {phoneScreens[screen]}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function Safety() {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] });
  const tilt = useTransform(scrollYProgress, [0.15, 0.85], [-16, 16]);

  return (
    <section
      ref={section}
      id="safety"
      aria-labelledby="safety-title"
      className="on-dark relative isolate overflow-clip bg-band py-section text-white/80"
    >
      <DoodleField spots={doodles} className="text-gold/[0.13]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-[15%] -z-10 size-[36rem] rounded-full bg-gold/10 blur-[120px]"
      />

      <div className="container-x">
        <SectionHeading
          id="safety-title"
          tone="dark"
          eyebrow="Safety"
          title="Trust is [the whole job.]"
          description="Letting someone into your family’s life is a big decision. Every part of a visit is designed so you never have to wonder who is there or what is happening."
        />

        <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Desktop: the phone stays in view and changes screen with the point in focus. */}
          <div className="hidden lg:block">
            <div className="sticky top-0 flex h-screen items-center justify-center py-24">
              <Phone screen={active} tilt={tilt} className="h-[min(40rem,calc(100vh-10rem))] w-auto max-w-none" />
            </div>
          </div>

          <ol className="grid gap-6 lg:gap-0">
            {trustPoints.map(({ title, body, icon: Icon }, index) => (
              <motion.li
                key={title}
                onViewportEnter={() => setActive(index)}
                viewport={{ margin: "-45% 0px -45% 0px" }}
                className="lg:flex lg:min-h-[78vh] lg:items-center"
              >
                <motion.article
                  animate={{ opacity: active === index ? 1 : 0.35 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 max-lg:opacity-100! sm:p-9 lg:border-0 lg:bg-transparent lg:p-0"
                >
                  <span
                    aria-hidden="true"
                    className="grid size-14 place-items-center rounded-2xl bg-gold/12 text-gold ring-1 ring-gold/35"
                  >
                    <Icon className="size-7" strokeWidth={1.6} />
                  </span>
                  <span aria-hidden="true" className="mt-6 block text-sm font-bold tracking-[0.16em] text-gold uppercase">
                    {String(index + 1).padStart(2, "0")} / {String(trustPoints.length).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-serif text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.04] font-normal text-white">{title}</h3>
                  <p className="mt-4 max-w-lg text-lead">{body}</p>
                  {/* Phones: each point shows its own screen. */}
                  <div className="mt-8 lg:hidden">
                    <Phone screen={index} className="max-w-[17rem]" />
                  </div>
                </motion.article>
              </motion.li>
            ))}
          </ol>
        </div>

        <Reveal className="mt-12 flex items-center gap-3.5 rounded-2xl border border-gold/30 bg-gold/[0.07] px-5 py-4 font-semibold text-white">
          <TriangleAlert aria-hidden="true" className="size-6 shrink-0 text-gold" strokeWidth={1.75} />
          <p>{site.emergency}</p>
        </Reveal>
      </div>
    </section>
  );
}
