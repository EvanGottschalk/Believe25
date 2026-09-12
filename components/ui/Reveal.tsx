"use client";

import { motion, type Variants } from "framer-motion";
import { riseIn, staggerChildren, VIEWPORT, resolveMotion } from "@/config/motion";
import { useReducedMotionSafe } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/**
 * The default scroll reveal. Every animated block on the site goes through
 * here or through motion.ts directly, so prefers-reduced-motion is handled
 * in one place rather than remembered at 30 call sites.
 */
export function Reveal({
  children,
  className,
  variants = riseIn,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  as?: "div" | "section" | "li" | "article" | "span";
}) {
  const reduced = useReducedMotionSafe();
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={resolveMotion(variants, reduced)}
      transition={reduced ? undefined : { delay }}
    >
      {children}
    </Component>
  );
}

/** Container that cascades its <Reveal> children. */
export function RevealGroup({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul" | "section";
}) {
  const reduced = useReducedMotionSafe();
  const Component = motion[as];

  return (
    <Component
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={reduced ? undefined : staggerChildren}
    >
      {children}
    </Component>
  );
}

/** Child of RevealGroup — inherits the parent's stagger timing. */
export function RevealItem({
  children,
  className,
  variants = riseIn,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  as?: "div" | "li" | "article";
}) {
  const reduced = useReducedMotionSafe();
  const Component = motion[as];

  return (
    <Component className={className} variants={resolveMotion(variants, reduced)}>
      {children}
    </Component>
  );
}
