"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { THEME } from "@/config/theme";

/**
 * prefers-reduced-motion, resolved safely for SSR.
 *
 * Returns `true` until hydration completes, so the first paint is always the
 * still version. A visitor who asked for less motion never sees a frame of
 * animation before the preference is applied.
 */
export function useReducedMotionSafe(): boolean {
  const reduced = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return !hydrated || Boolean(reduced);
}

/** True once the page has scrolled past `threshold` px. */
export function useScrollPast(threshold: number = THEME.navSolidifyAt): boolean {
  const [past, setPast] = useState(false);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      setPast(window.scrollY > threshold);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return past;
}

/** Locks body scroll while a drawer or overlay is open. */
export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    const { overflow, paddingRight } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [locked]);
}

/** Calls `onClose` on Escape. */
export function useEscapeKey(active: boolean, onClose: () => void): void {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, onClose]);
}

/** True once mounted. For client-only rendering. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
