/**
 * Five named variants, shared by every animated element on the site.
 * This is what keeps the motion coherent rather than looking like a demo reel.
 *
 * Every consumer must pass variants through `resolveMotion()` (or use the
 * <Reveal> primitive) so prefers-reduced-motion collapses them to a plain fade.
 */

import type { Variants } from "framer-motion";

export const EASE = [0.16, 1, 0.3, 1] as const;

export const DURATION = {
  fast: 0.3,
  base: 0.6,
  slow: 0.9,
} as const;

export const STAGGER = 0.08;

/** 1. Default reveal for every text block. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE },
  },
};

/** 2. Cascade for grids and lists. Apply to the container. */
export const staggerChildren: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER, delayChildren: 0.05 },
  },
};

/** 3. Clip-path wipe + settle. For any full-bleed image entering. */
export const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.06, clipPath: "inset(0 0 18% 0)" },
  visible: {
    opacity: 1,
    scale: 1,
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: DURATION.slow, ease: EASE },
  },
};

/** 4. Parallax drift range, consumed via useScroll/useTransform. */
export const PARALLAX = { range: 8 } as const;

/** 5. Hero chain physics. */
export const SWING_SPRING = {
  stiffness: 90,
  damping: 12,
  mass: 1.1,
} as const;

/** Reduced-motion replacement: instant, no transform. */
export const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

export const noop: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};

/**
 * Shared viewport config so reveals fire consistently everywhere.
 *
 * Deliberately margin-based rather than `amount`-based: an `amount` threshold
 * is a fraction of the ELEMENT, so any block taller than the viewport (the
 * product grid, the story section) can never satisfy it and would stay
 * invisible forever. A bottom margin fires once the element's leading edge is
 * comfortably inside the viewport, whatever its height.
 */
export const VIEWPORT = { once: true, margin: "0px 0px -80px 0px" } as const;

export function resolveMotion(variants: Variants, reduced: boolean): Variants {
  return reduced ? fadeOnly : variants;
}
