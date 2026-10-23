"use client";

import { ArrowRight, Check, Clock, Info } from "lucide-react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { comingLater, services, type Service } from "@/content/services";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { DoodleField, type DoodleSpot } from "@/components/visuals/doodles";

const doodles: DoodleSpot[] = [
  { name: "hospital", x: "84%", y: "6%", size: 64, rotate: -6 },
  { name: "wheelchair", x: "64%", y: "10%", size: 46, rotate: 6, delay: 2 },
  { name: "calendar", x: "3%", y: "90%", size: 50, rotate: -10, delay: 4 },
];

const heading = {
  id: "services-title",
  eyebrow: "Services",
  title: "Three ways we can help [from day one.]",
  description: "Book a companion by the hour. Every service comes with the same checks, visit codes and updates.",
};

function ServiceCard({ service, index, wide }: { service: Service; index: number; wide?: boolean }) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[2rem] border border-line bg-card p-7 transition-[box-shadow,border-color] duration-500 hover:border-gold/50 hover:shadow-card sm:p-9",
        wide && "h-[min(40rem,76vh)] w-[31rem] shrink-0",
      )}
    >
      <span aria-hidden="true" className="absolute top-6 right-8 text-[4.5rem] leading-none text-gold/35 type-display">
        0{index + 1}
      </span>
      <Image
        src={service.illustration}
        alt=""
        width={320}
        height={230}
        className={cn(
          "-ml-3 h-auto w-[calc(100%+1.5rem)] max-w-none transition-transform duration-700 ease-out-expo group-hover:scale-[1.04] motion-reduce:group-hover:scale-100",
          wide && "w-auto max-h-[42%] self-start",
        )}
      />
      <h3 className={cn("mt-4 font-serif text-[2.5rem] leading-none font-normal", wide && "mt-auto")}>{service.title}</h3>
      <p className="mt-3">{service.summary}</p>
      <ul className="mt-6 grid gap-2.5 text-[1.0625rem]">
        {service.includes.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <Check aria-hidden="true" className="mt-1 size-5 shrink-0 text-gold" strokeWidth={2.25} />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

function Notes({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-5", className)}>
      <div className="flex items-start gap-4 rounded-3xl border border-line bg-card px-7 py-6 text-[1.0625rem]">
        <Info aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-ink" strokeWidth={1.75} />
        <p>
          <strong>Support, not treatment.</strong> Our companions are not nurses or medical staff. They don’t give
          medicines, injections or any kind of treatment. They stay by your loved one’s side and take care of everything
          around it.
        </p>
      </div>
      <div className="flex items-start gap-4 rounded-3xl border border-line bg-card px-7 py-6 text-[1.0625rem]">
        <Clock aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-ink" strokeWidth={1.75} />
        <p>
          <strong>Coming later.</strong> {comingLater}
        </p>
      </div>
    </div>
  );
}

/** Desktop: the section pins while the cards slide sideways as you scroll down. */
function HorizontalServices() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  // The ResizeObserver also fires once on observe, which takes the first measurement.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setDistance(Math.max(0, el.scrollWidth - window.innerWidth)));
    observer.observe(el);
    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const bar = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });

  return (
    <section
      ref={section}
      id="services"
      aria-labelledby={heading.id}
      className="relative isolate bg-canvas-soft"
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <DoodleField spots={doodles} className="text-ink/[0.08]" />
        <motion.div
          ref={track}
          style={{ x }}
          className="flex w-max items-center gap-6 px-[max(1.25rem,calc((100vw-76rem)/2))] pt-16"
        >
          <div className="flex w-[27rem] shrink-0 flex-col">
            <SectionHeading {...heading} className="mb-8" />
            <p className="flex items-center gap-3 font-semibold text-ink">
              Keep scrolling
              <ArrowRight aria-hidden="true" className="size-5 motion-safe:animate-pulse" strokeWidth={2} />
            </p>
          </div>
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} wide />
          ))}
          <Notes className="w-[26rem] shrink-0" />
        </motion.div>
        <div className="container-x mt-10">
          <div className="h-[2px] overflow-hidden rounded-full bg-line">
            <motion.div style={{ scaleX: bar }} className="h-full origin-left bg-gold" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Phones, tablets and reduced motion: a simple vertical layout. */
function StackedServices() {
  return (
    <section id="services" aria-labelledby={heading.id} className="relative isolate bg-canvas-soft py-section">
      <DoodleField spots={doodles} className="text-ink/[0.08]" />
      <div className="container-x">
        <SectionHeading {...heading} />
        <div className="grid gap-5 md:grid-cols-2">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={(index % 2) * 0.08} className="h-full">
              <ServiceCard service={service} index={index} />
            </Reveal>
          ))}
          <Reveal className="md:self-center">
            <Notes />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Services() {
  const desktop = useMediaQuery("(min-width: 1024px)");
  const reduce = useReducedMotion();
  return desktop && !reduce ? <HorizontalServices /> : <StackedServices />;
}
