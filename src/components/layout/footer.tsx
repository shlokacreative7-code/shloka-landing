"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { navigation, site } from "@/content/site";
import { Logo } from "@/components/ui/logo";
import { wordPaths, wordViewBox } from "@/components/ui/logo-art";
import { Skyline } from "@/components/visuals/skyline";
import { Year } from "./year";

const links = [...navigation, { label: "Enquire", href: "#enquire" }];

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const wordY = useTransform(scrollYProgress, [0, 1], [140, 0]);

  return (
    <footer ref={ref} className="on-dark relative overflow-hidden border-t border-gold/15 bg-band pb-10 text-white/80">
      {/* Lucknow skyline: Bara Imambara, Rumi Darwaza and the Husainabad Clock Tower. Cropped to the centre on phones. */}
      <div aria-hidden="true" className="overflow-hidden pt-14">
        <Skyline className="relative left-1/2 block h-auto w-[54rem] max-w-none -translate-x-1/2 text-gold/55 md:w-[calc(100%-2.5rem)] md:max-w-[76rem]" />
      </div>

      <div className="container-x grid gap-8 pt-10 pb-12 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <a href="#top" aria-label={`${site.name}, back to top`} className="inline-flex min-h-11 items-center">
            <Logo tone="dark" className="h-10" />
          </a>
          <p className="mt-3.5">Verified care companions for families in Lucknow.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-7 gap-y-1">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="inline-flex min-h-11 items-center font-semibold transition-colors hover:text-gold">
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Giant wordmark that rises into place as the footer comes into view. */}
      <div aria-hidden="true" className="container-x overflow-hidden">
        <motion.svg viewBox={wordViewBox} style={reduce ? undefined : { y: wordY }} className="block h-auto w-full">
          <defs>
            <linearGradient id="footer-word" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#C9A227" stopOpacity="0.9" />
              <stop offset="1" stopColor="#C9A227" stopOpacity="0.04" />
            </linearGradient>
          </defs>
          {wordPaths.map((d) => (
            <path key={d.slice(0, 24)} d={d} fill="url(#footer-word)" />
          ))}
        </motion.svg>
      </div>

      <div className="container-x grid gap-2 border-t border-white/12 pt-7 text-[0.9375rem] md:grid-cols-[1fr_auto]">
        <p>
          © <Year /> {site.name}. Companions provide support, not medical treatment.
        </p>
        <p>In a medical emergency, call 108 or 112 first.</p>
      </div>
    </footer>
  );
}
