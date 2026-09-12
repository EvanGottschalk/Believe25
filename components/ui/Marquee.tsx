"use client";

import { useReducedMotionSafe } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/**
 * Looping announcement strip.
 *
 * Under reduced motion it renders as a static row rather than scrolling —
 * a moving band of text is exactly what that preference is asking us not to do.
 */
export function Marquee({
  items,
  className,
}: {
  items: readonly string[];
  className?: string;
}) {
  const reduced = useReducedMotionSafe();

  if (reduced) {
    return (
      <div
        className={cn(
          "flex w-full items-center justify-center gap-8 overflow-hidden whitespace-nowrap",
          className,
        )}
      >
        {items.slice(0, 2).map((item) => (
          <span key={item} className="shrink-0">
            {item}
          </span>
        ))}
      </div>
    );
  }

  // Duplicated once so the -50% translate loops seamlessly.
  const doubled = [...items, ...items];

  return (
    <div
      className={cn("group relative w-full overflow-hidden", className)}
      // Decorative repetition: announce the list once to assistive tech.
      aria-label={items.join(". ")}
    >
      <div
        aria-hidden
        className="flex w-max animate-marquee items-center group-hover:[animation-play-state:paused]"
      >
        {doubled.map((item, i) => (
          <span key={`${item}-${i}`} className="flex shrink-0 items-center">
            <span className="px-6">{item}</span>
            <span className="text-primary/70">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
