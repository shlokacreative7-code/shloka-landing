"use client";

import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useState } from "react";
import { navigation, site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { easeOutExpo } from "@/components/ui/reveal";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Tucks away while scrolling down, comes back as soon as you scroll up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > 12);
    setHidden(y > previous && y > 640);
  });

  return (
    <>
      <motion.div aria-hidden="true" style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gold" />
      <motion.header
        animate={{ y: hidden ? "-120%" : 0 }}
        transition={{ duration: 0.6, ease: easeOutExpo }}
        className="fixed inset-x-0 top-0 z-50 pt-3"
      >
        <div className="container-x">
          <div
            className={cn(
              "flex min-h-16 items-center justify-between gap-3 rounded-2xl border pr-2 pl-3 transition-[background-color,border-color,box-shadow] duration-500 sm:pr-2.5 sm:pl-4",
              scrolled
                ? "border-line bg-canvas/80 shadow-[0_10px_40px_-20px_rgb(11_31_58/0.35)] backdrop-blur-xl backdrop-saturate-150"
                : "border-transparent",
            )}
          >
            <a href="#top" aria-label={`${site.name}, back to top`} className="inline-flex min-h-11 items-center">
              <Logo className="h-6 sm:h-9" />
            </a>
            <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2.5 text-base font-semibold text-copy transition-colors hover:bg-ink/[0.06] hover:text-ink"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button href="#enquire" size="sm" arrow={false}>
                Enquire
              </Button>
            </div>
          </div>
        </div>
      </motion.header>
    </>
  );
}
