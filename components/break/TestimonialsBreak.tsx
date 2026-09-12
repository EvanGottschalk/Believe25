"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionShell } from "@/components/ui/SectionShell";
import { CONTENT } from "@/config/content";
import { EASE } from "@/config/motion";
import { useReducedMotionSafe } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const ROTATE_MS = 7000;

/**
 * Quiet testimonial band with a slow auto-advancing cross-fade.
 *
 * Renders nothing while CONTENT.testimonials.placeholder is true. Publishing
 * invented reviews as though they were real is a legal and trust problem, so
 * the section stays hidden until real quotes with permission replace the
 * placeholders (Tasks for Humans #3).
 */
export function TestimonialsBreak() {
  const { items, heading, placeholder } = CONTENT.testimonials;
  const reduced = useReducedMotionSafe();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (placeholder || reduced || paused || items.length < 2) return;
    const t = setInterval(advance, ROTATE_MS);
    return () => clearInterval(t);
  }, [advance, paused, reduced, items.length, placeholder]);

  if (placeholder) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[content] Testimonials are placeholders and the section is hidden. " +
          "Add real quotes to config/content.ts and set `placeholder: false`. " +
          "See docs/dev_notes/Tasks for Humans.md #3.",
      );
    }
    return null;
  }

  const current = items[index];

  return (
    <SectionShell ground="deep" size="break">
      <h2 className="text-center font-body text-eyebrow uppercase tracking-[0.18em] text-on-deep-muted">
        {heading}
      </h2>

      <div
        className="relative mx-auto mt-8 flex min-h-[9rem] max-w-3xl items-center justify-center"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.figure
            key={index}
            initial={{ opacity: 0, y: reduced ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -10 }}
            transition={{ duration: reduced ? 0.2 : 0.6, ease: EASE }}
            className="text-center"
          >
            <blockquote className="font-display text-display-md text-on-deep">
              “{current.quote}”
            </blockquote>
            <figcaption className="mt-5 font-body text-sm text-on-deep-muted">
              {current.name}
              {current.location ? `, ${current.location}` : ""}
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      {items.length > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {items.map((item, i) => (
            <button
              key={item.quote.slice(0, 16)}
              onClick={() => setIndex(i)}
              aria-label={`Show testimonial ${i + 1}`}
              aria-current={i === index}
              className={cn(
                "h-11 w-11 rounded-pill focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-soft",
                "relative before:absolute before:left-1/2 before:top-1/2 before:h-1.5 before:w-1.5",
                "before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-pill before:transition-all before:duration-300",
                i === index
                  ? "before:w-5 before:bg-primary-soft"
                  : "before:bg-on-deep/30 hover:before:bg-on-deep/60",
              )}
            />
          ))}
        </div>
      )}
    </SectionShell>
  );
}
