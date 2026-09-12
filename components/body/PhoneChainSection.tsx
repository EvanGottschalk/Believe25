"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { SectionShell, Eyebrow } from "@/components/ui/SectionShell";
import { Reveal } from "@/components/ui/Reveal";
import { LinkCTA } from "@/components/ui/LinkCTA";
import { CONTENT } from "@/config/content";
import { EASE } from "@/config/motion";
import { useReducedMotionSafe } from "@/lib/hooks";
import type { SectionProps } from "@/lib/types";
import { cn } from "@/lib/utils";

const STEPS = CONTENT.phoneChain.steps;

/**
 * Sticky-scroll explainer: the diagram pins while three captioned states
 * advance. Collapses to three stacked cards on mobile and under reduced
 * motion, where a scroll-hijacked sequence would be hostile.
 */
export function PhoneChainSection({ standalone = false }: SectionProps) {
  const reduced = useReducedMotionSafe();

  return (
    <SectionShell id="phone-chain" standalone={standalone} ground="background">
      <Reveal className="max-w-2xl">
        <Eyebrow>{CONTENT.phoneChain.eyebrow}</Eyebrow>
        <h2 className="mt-4 font-display text-display-lg">{CONTENT.phoneChain.heading}</h2>
        <p className="mt-5 font-body text-lg leading-relaxed text-foreground-muted">
          {CONTENT.phoneChain.intro}
        </p>
      </Reveal>

      {reduced ? <StackedSteps /> : <StickySteps />}

      <Reveal className="mt-12">
        <LinkCTA href={CONTENT.phoneChain.cta.href}>{CONTENT.phoneChain.cta.label}</LinkCTA>
      </Reveal>
    </SectionShell>
  );
}

function StickySteps() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length));
    setActive(next);
  });

  return (
    <div ref={ref} className="mt-16 lg:mt-20">
      {/* Mobile keeps the stacked layout — pinning on a small screen is worse. */}
      <div className="lg:hidden">
        <StackedSteps />
      </div>

      <div className="hidden gap-16 lg:grid lg:grid-cols-2">
        <div className="sticky top-32 flex h-[60svh] items-center justify-center">
          <Diagram active={active} />
        </div>

        <div className="flex flex-col">
          {STEPS.map((step, i) => (
            <div
              key={step.id}
              className="flex min-h-[60svh] flex-col justify-center"
              aria-current={i === active}
            >
              <motion.div
                animate={{ opacity: i === active ? 1 : 0.28 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <span className="font-body text-eyebrow font-medium uppercase tracking-[0.18em] text-accent">
                  {String(i + 1).padStart(2, "0")} — {step.caption}
                </span>
                <h3 className="mt-4 font-display text-display-md">{step.title}</h3>
                <p className="mt-4 max-w-prose font-body leading-relaxed text-foreground-muted">
                  {step.body}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StackedSteps() {
  return (
    <div className="mt-12 grid gap-8 sm:grid-cols-3 lg:mt-16">
      {STEPS.map((step, i) => (
        <Reveal key={step.id} delay={i * 0.08} className="flex flex-col">
          <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-surface">
            <Diagram active={i} small />
          </div>
          <span className="mt-5 font-body text-eyebrow font-medium uppercase tracking-[0.18em] text-accent">
            {step.caption}
          </span>
          <h3 className="mt-2 font-display text-display-sm">{step.title}</h3>
          <p className="mt-2 font-body text-sm leading-relaxed text-foreground-muted">
            {step.body}
          </p>
        </Reveal>
      ))}
    </div>
  );
}

/** Three annotated states of the same phone-and-loop drawing. */
function Diagram({ active, small = false }: { active: number; small?: boolean }) {
  const reduced = useReducedMotionSafe();

  return (
    <svg
      viewBox="0 0 320 320"
      className={cn("w-full", small ? "max-w-[180px]" : "max-w-[380px]")}
      aria-hidden
    >
      <defs>
        <linearGradient id="dScreen" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#F4C6DE" />
          <stop offset="100%" stopColor="#CBD9F5" />
        </linearGradient>
      </defs>

      {/* State 1 — wrist */}
      <motion.g
        initial={false}
        animate={{ opacity: active === 0 ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
      >
        <path
          d="M96 208 q-26 -14 -26 -42 q0 -26 22 -26 q16 0 22 16"
          fill="none"
          stroke="#6E5A78"
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.45"
        />
        <rect x="118" y="86" width="84" height="150" rx="14" fill="#2B1836" />
        <rect x="123" y="91" width="74" height="140" rx="10" fill="url(#dScreen)" />
        <ellipse cx="132" cy="256" rx="26" ry="34" fill="none" stroke="#D973A8" strokeWidth="5" />
        <circle cx="132" cy="290" r="6" fill="#C9A227" />
      </motion.g>

      {/* State 2 — hanging */}
      <motion.g
        initial={false}
        animate={{ opacity: active === 1 ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
      >
        <path d="M60 58 h200" stroke="#6E5A78" strokeWidth="5" strokeLinecap="round" opacity="0.4" />
        <ellipse cx="160" cy="92" rx="24" ry="32" fill="none" stroke="#D973A8" strokeWidth="5" />
        <rect x="118" y="120" width="84" height="150" rx="14" fill="#2B1836" />
        <rect x="123" y="125" width="74" height="140" rx="10" fill="url(#dScreen)" />
        <circle cx="160" cy="195" r="15" fill="none" stroke="#FFFDFE" strokeWidth="4" />
        <circle cx="160" cy="195" r="5" fill="#FFFDFE" />
      </motion.g>

      {/* State 3 — worn */}
      <motion.g
        initial={false}
        animate={{ opacity: active === 2 ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
      >
        <rect x="118" y="60" width="84" height="150" rx="14" fill="#2B1836" />
        <rect x="123" y="65" width="74" height="140" rx="10" fill="url(#dScreen)" />
        <ellipse cx="132" cy="248" rx="30" ry="40" fill="none" stroke="#C9A227" strokeWidth="2.5" />
        {Array.from({ length: 16 }, (_, i) => {
          const t = (i / 16) * Math.PI * 2 - Math.PI / 2;
          const colors = ["#F4C6DE", "#E3D4F0", "#FFFFFF", "#D973A8"];
          return (
            <circle
              key={i}
              cx={132 + 30 * Math.cos(t)}
              cy={248 + 40 * Math.sin(t)}
              r={5.5}
              fill={colors[i % colors.length]}
              stroke="#C9628F"
              strokeWidth="0.6"
            />
          );
        })}
        <path d="M126 292 l-1.5 -10 l5 4 l4.5 -7 l4.5 7 l5 -4 l-1.5 10 z" fill="#C9A227" />
      </motion.g>
    </svg>
  );
}
