"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { NAV } from "@/config/nav";
import { SITE } from "@/config/site";
import { CATEGORIES } from "@/config/products";
import { EASE } from "@/config/motion";
import { useReducedMotionSafe } from "@/lib/hooks";

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const reduced = useReducedMotionSafe();

  const item = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.08 + i * 0.05, duration: 0.4, ease: EASE },
        };

  return (
    <Drawer open={open} onClose={onClose} title="Menu" side="top" className="pb-8">
      <div className="mx-auto w-full max-w-container px-5 sm:px-8">
        <div className="flex h-16 items-center justify-between">
          <span className="font-display text-xl">{SITE.businessName}</span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-pill text-foreground-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav aria-label="Mobile" className="mt-4 flex flex-col">
          {NAV.links.map((link, i) => (
            <motion.div key={link.href} {...item(i)}>
              <Link
                href={link.href}
                onClick={onClose}
                className="block border-b border-foreground/10 py-4 font-display text-display-sm transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        <motion.div {...item(NAV.links.length)} className="mt-6">
          <p className="font-body text-eyebrow font-medium uppercase tracking-[0.18em] text-foreground-muted">
            Categories
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <li key={c.handle}>
                <Link
                  href={`/shop?category=${c.handle}`}
                  onClick={onClose}
                  className="inline-flex min-h-[44px] items-center rounded-pill border border-foreground/15 px-4 font-body text-sm transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div {...item(NAV.links.length + 1)} className="mt-8">
          <Button href={NAV.cta.href} variant="primary" size="lg" className="w-full" onClick={onClose}>
            {NAV.cta.label}
          </Button>
        </motion.div>
      </div>
    </Drawer>
  );
}
