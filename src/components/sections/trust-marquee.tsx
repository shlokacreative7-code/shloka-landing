"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useRef, type ReactNode } from "react";
import { marqueeItems } from "@/content/home";
import { services } from "@/content/services";

const wrap = (min: number, max: number, value: number) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

const Star = () => (
  <svg aria-hidden="true" viewBox="0 0 12 12" className="size-[0.45em] shrink-0 fill-gold">
    <path d="M6 0 7.6 4.4 12 6 7.6 7.6 6 12 4.4 7.6 0 6 4.4 4.4Z" />
  </svg>
);

/**
 * An endless row that drifts at `speed` (% of its width per second) and speeds up with the page's
 * scroll velocity, reversing when you scroll back up.
 */
function VelocityRow({ speed, children }: { speed: number; children: ReactNode }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (value) => `${wrap(-50, 0, value)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    let move = direction.current * speed * (delta / 1000);
    const factor = boost.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;
    move += direction.current * move * factor;
    baseX.set(baseX.get() + move);
  });

  return (
    <div className="overflow-hidden">
      <motion.div style={{ x }} className="flex w-max">
        <div className="flex shrink-0 items-center">{children}</div>
        <div aria-hidden="true" className="flex shrink-0 items-center">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

/** Navy band with two ticker rows running in opposite directions: the services, then the safety promises. */
export function TrustMarquee() {
  const reduce = useReducedMotion();
  const serviceRow = [...services.map((service) => service.title), "Lucknow"];

  if (reduce) {
    return (
      <section aria-label="Why families can trust us" className="on-dark bg-band py-8">
        <ul className="container-x flex flex-wrap justify-center gap-x-8 gap-y-3 text-[1.0625rem] font-semibold text-white">
          {marqueeItems.map((item) => (
            <li key={item} className="flex items-center gap-3">
              <Star />
              {item}
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section aria-label="Why families can trust us" className="on-dark overflow-hidden border-y border-gold/25 bg-band py-7 sm:py-9">
      <div aria-hidden="true">
        <VelocityRow speed={-2.2}>
          {serviceRow.map((item, i) => (
            <span
              key={item}
              className="flex items-center gap-[0.45em] pr-[0.45em] text-[clamp(2.75rem,7vw,6rem)] leading-[1.1] whitespace-nowrap type-display"
            >
              <span className={i % 2 ? "text-gold italic" : "text-ivory"}>{item}</span>
              <Star />
            </span>
          ))}
        </VelocityRow>
        <div className="mt-4 sm:mt-6">
          <VelocityRow speed={1.6}>
            {marqueeItems.map((item) => (
              <span
                key={item}
                className="flex items-center gap-8 pr-8 text-[1.0625rem] font-semibold whitespace-nowrap text-white/85 sm:gap-12 sm:pr-12"
              >
                {item}
                <span className="size-1.5 rounded-full bg-gold" />
              </span>
            ))}
          </VelocityRow>
        </div>
      </div>
      {/* The moving rows are decorative; screen readers get the list once. */}
      <ul className="sr-only">
        {marqueeItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
