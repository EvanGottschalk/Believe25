"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PhoneChain } from "./PhoneChain";
import { Button } from "@/components/ui/Button";
import { LinkCTA } from "@/components/ui/LinkCTA";
import { Eyebrow } from "@/components/ui/SectionShell";
import { CONTENT } from "@/config/content";
import { EASE, PARALLAX } from "@/config/motion";
import { useReducedMotionSafe } from "@/lib/hooks";
import type { SectionProps } from "@/lib/types";
import { cn } from "@/lib/utils";

export function HeroSection({ standalone = false }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", `${PARALLAX.range}%`]);
  const chainY = useTransform(scrollYProgress, [0, 1], ["0%", `${PARALLAX.range * 1.5}%`]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const rise = (delay: number) =>
    reduced
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.8, ease: EASE },
        };

  return (
    <section
      ref={ref}
      className={cn(
        "relative flex min-h-[100svh] w-full items-center overflow-hidden bg-background",
        standalone && "min-h-[90svh]",
      )}
    >
      {/* Iridescent ground */}
      <motion.div
        aria-hidden
        style={reduced ? undefined : { y: glowY }}
        className="pointer-events-none absolute inset-0"
      >
        <div
          className={cn(
            "absolute -right-[15%] top-[8%] h-[70vmin] w-[70vmin] rounded-full opacity-70 blur-3xl",
            "bg-[radial-gradient(circle_at_35%_35%,#F4C6DE_0%,#E3D4F0_45%,transparent_70%)]",
            !reduced && "animate-drift",
          )}
        />
        <div
          className={cn(
            "absolute -left-[10%] bottom-[5%] h-[55vmin] w-[55vmin] rounded-full opacity-50 blur-3xl",
            "bg-[radial-gradient(circle_at_60%_40%,#CBD9F5_0%,#F4C6DE_50%,transparent_72%)]",
            !reduced && "animate-drift [animation-delay:-8s]",
          )}
        />
      </motion.div>

      <div className="relative mx-auto grid w-full max-w-container grid-cols-1 items-center gap-10 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-2 lg:gap-8 lg:px-12 lg:pb-24 lg:pt-32">
        {/* Copy */}
        <motion.div
          style={reduced ? undefined : { opacity: copyOpacity }}
          className="order-2 flex flex-col items-start lg:order-1"
        >
          <motion.div {...rise(0.1)}>
            <Eyebrow>{CONTENT.hero.eyebrow}</Eyebrow>
          </motion.div>

          <motion.h1
            {...rise(0.2)}
            className="mt-5 max-w-[17ch] font-display text-display-xl text-foreground"
          >
            {CONTENT.hero.headline}
          </motion.h1>

          <motion.p
            {...rise(0.32)}
            className="mt-6 max-w-[52ch] font-body text-base leading-relaxed text-foreground-muted sm:text-lg"
          >
            {CONTENT.hero.subhead}
          </motion.p>

          <motion.div
            {...rise(0.44)}
            className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6"
          >
            <Button href={CONTENT.hero.primaryCta.href} variant="primary" size="lg">
              {CONTENT.hero.primaryCta.label}
            </Button>
            <LinkCTA href={CONTENT.hero.secondaryCta.href}>
              {CONTENT.hero.secondaryCta.label}
            </LinkCTA>
          </motion.div>
        </motion.div>

        {/* Chain */}
        <motion.div
          {...(reduced
            ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
            : {
                initial: { opacity: 0, scale: 0.94 },
                animate: { opacity: 1, scale: 1 },
                transition: { duration: 1, ease: EASE },
              })}
          style={reduced ? undefined : { y: chainY }}
          className="order-1 flex justify-center lg:order-2 lg:justify-end"
        >
          <PhoneChain className="h-[46svh] w-auto max-w-full sm:h-[54svh] lg:h-[78svh]" />
        </motion.div>
      </div>

      {/* Scroll hint */}
      {!standalone && (
        <motion.a
          href="#phone-chain"
          {...rise(0.7)}
          className="absolute inset-x-0 bottom-6 mx-auto hidden w-fit items-center gap-2 font-body text-xs uppercase tracking-[0.18em] text-foreground-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:flex"
        >
          {CONTENT.hero.scrollHint}
          <span aria-hidden className={cn(!reduced && "animate-bounce")}>↓</span>
        </motion.a>
      )}
    </section>
  );
}
