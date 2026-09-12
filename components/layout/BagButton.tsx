"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart/CartContext";
import { COMMERCE } from "@/config/commerce";
import { useReducedMotionSafe } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export function BagButton({ className }: { className?: string }) {
  const { cart, open } = useCart();
  const reduced = useReducedMotionSafe();
  const count = cart?.totalQuantity ?? 0;

  return (
    <button
      onClick={open}
      aria-label={count > 0 ? COMMERCE.copy.bagWithCount(count) : COMMERCE.copy.bag}
      className={cn(
        "relative flex h-11 w-11 items-center justify-center rounded-pill",
        "transition-colors duration-300 hover:text-accent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-[22px] w-[22px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        aria-hidden
      >
        <path d="M5.5 7.5h13l-1 12.5h-11l-1-12.5Z" strokeLinejoin="round" />
        <path d="M9 7.5V6a3 3 0 0 1 6 0v1.5" strokeLinecap="round" />
      </svg>

      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={reduced ? { opacity: 0 } : { scale: 0.4, opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { scale: 1, opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { scale: 0.4, opacity: 0 }}
            transition={reduced ? { duration: 0.15 } : { type: "spring", stiffness: 500, damping: 22 }}
            className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-pill bg-primary px-1 font-body text-[0.625rem] font-semibold tabular-nums text-white"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
