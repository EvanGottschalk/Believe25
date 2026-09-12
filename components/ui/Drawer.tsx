"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "@/config/motion";
import { useEscapeKey, useReducedMotionSafe, useScrollLock } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/**
 * Accessible slide-over. Used by the cart and the mobile menu.
 * Focus is trapped while open and returned to the trigger on close.
 */
export function Drawer({
  open,
  onClose,
  title,
  children,
  side = "right",
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  side?: "right" | "top";
  className?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotionSafe();

  useScrollLock(open);
  useEscapeKey(open, onClose);

  useEffect(() => {
    if (open) {
      restoreFocusRef.current = document.activeElement as HTMLElement;
      // Move focus into the panel so the next Tab lands inside it.
      requestAnimationFrame(() => {
        const focusable = panelRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        (focusable ?? panelRef.current)?.focus();
      });
    } else {
      restoreFocusRef.current?.focus?.();
    }
  }, [open]);

  // Focus trap.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const offscreen = side === "right" ? { x: "100%" } : { y: "-100%" };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label={title}>
          <motion.div
            className="absolute inset-0 bg-surface-deep/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.15 : 0.35 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            className={cn(
              "absolute bg-background shadow-2xl outline-none",
              side === "right"
                ? "inset-y-0 right-0 flex w-full max-w-[26rem] flex-col"
                : "inset-x-0 top-0 max-h-[100dvh] overflow-y-auto",
              className,
            )}
            initial={reduced ? { opacity: 0 } : offscreen}
            animate={reduced ? { opacity: 1 } : { x: 0, y: 0 }}
            exit={reduced ? { opacity: 0 } : offscreen}
            transition={
              reduced ? { duration: 0.15 } : { duration: 0.45, ease: EASE }
            }
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
