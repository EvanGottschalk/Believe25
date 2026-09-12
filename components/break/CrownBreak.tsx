"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CONTENT } from "@/config/content";
import { MEDIA } from "@/config/media";
import { EASE, PARALLAX, VIEWPORT } from "@/config/motion";
import { useReducedMotionSafe } from "@/lib/hooks";

/**
 * Full-bleed image band with one centred line — the Annoushka §5 idiom.
 * This is where the brand's animal imagery earns its place, in one confident
 * moment rather than scattered across the site.
 */
export function CrownBreak() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${PARALLAX.range}%`, `${PARALLAX.range}%`],
  );

  return (
    <section
      ref={ref}
      className="relative flex h-[38svh] min-h-[280px] w-full items-center justify-center overflow-hidden bg-surface-deep"
    >
      <motion.div
        aria-hidden
        style={reduced ? undefined : { y }}
        className="absolute inset-x-0 -inset-y-[12%]"
      >
        <Image
          src={MEDIA.crown.src}
          alt={CONTENT.crown.imageAlt}
          fill
          sizes="100vw"
          className="object-cover object-[center_28%]"
        />
      </motion.div>

      <div aria-hidden className="absolute inset-0 bg-deep-scrim" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        variants={
          reduced
            ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
            : {
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
              }
        }
        className="relative z-10 px-6 text-center"
      >
        <p className="font-display text-display-lg text-on-deep drop-shadow-[0_2px_20px_rgba(43,24,54,0.5)]">
          {CONTENT.crown.line}
        </p>
        <p className="mt-3 font-body text-eyebrow uppercase tracking-[0.24em] text-on-deep/75">
          {CONTENT.crown.sub}
        </p>
      </motion.div>
    </section>
  );
}
