"use client";

import { motion } from "motion/react";
import { Fragment, useState } from "react";
import { introDelay } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { easeOutExpo } from "./reveal";

type Part = { text: string; highlight?: boolean };

const STAGGER = 0.06;

/**
 * Heading whose words rise into place one by one, on load (`trigger="mount"`) or when scrolled
 * into view. Highlighted parts are set in italic with a gold underline that draws in afterwards.
 */
export function AnimatedHeadline({
  parts,
  as: Tag = "h2",
  trigger = "view",
  id,
  className,
}: {
  parts: Part[];
  as?: "h1" | "h2";
  trigger?: "mount" | "view";
  id?: string;
  className?: string;
}) {
  // On a first visit the intro curtain covers the page for a moment, so the hero waits for it.
  const [startDelay] = useState(() => (trigger === "mount" ? introDelay() : 0));
  const wordsByPart = parts.map((part) => part.text.split(" "));
  const firstIndex = wordsByPart.map((_, i) => wordsByPart.slice(0, i).reduce((count, words) => count + words.length, 0));
  const totalWords = wordsByPart.reduce((count, words) => count + words.length, 0);
  const play = trigger === "mount" ? { animate: "shown" } : { whileInView: "shown", viewport: { once: true, margin: "0px 0px -12% 0px" } };

  const renderWords = (words: string[], start: number) =>
    words.map((word, i) => (
      <Fragment key={`${word}-${i}`}>
        <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%" },
              shown: { y: 0, transition: { delay: startDelay + 0.1 + (start + i) * STAGGER, duration: 0.9, ease: easeOutExpo } },
            }}
          >
            {word}
          </motion.span>
        </span>
        {i < words.length - 1 && " "}
      </Fragment>
    ));

  return (
    <motion.div initial="hidden" {...play}>
      <Tag id={id} className={className}>
        {parts.map((part, i) => (
          <Fragment key={part.text}>
            {part.highlight ? (
              <motion.em
                className={cn(
                  "bg-[linear-gradient(var(--color-gold),var(--color-gold))] bg-[position:0_92%] bg-no-repeat pr-[0.04em] italic [box-decoration-break:clone] dark:text-gold",
                )}
                variants={{
                  hidden: { backgroundSize: "0% 0.06em" },
                  shown: {
                    backgroundSize: "100% 0.06em",
                    transition: { delay: startDelay + 0.25 + totalWords * STAGGER, duration: 0.9, ease: easeOutExpo },
                  },
                }}
              >
                {renderWords(wordsByPart[i]!, firstIndex[i]!)}
              </motion.em>
            ) : (
              renderWords(wordsByPart[i]!, firstIndex[i]!)
            )}
            {i < parts.length - 1 && " "}
          </Fragment>
        ))}
      </Tag>
    </motion.div>
  );
}
