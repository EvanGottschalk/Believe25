"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV } from "@/config/nav";
import { SITE } from "@/config/site";
import { Marquee } from "@/components/ui/Marquee";
import { BagButton } from "./BagButton";
import { MobileMenu } from "./MobileMenu";
import { useScrollPast } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export function TopMenu() {
  const scrolled = useScrollPast();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // The hero is the only page where the nav starts transparent; everywhere
  // else it needs its own ground from the first pixel.
  const overHero = pathname === "/";
  const solid = scrolled || !overHero || menuOpen;

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-pill focus:bg-background focus:px-5 focus:py-3 focus:font-body focus:text-sm focus:ring-2 focus:ring-accent"
      >
        Skip to content
      </a>

      <header className="fixed inset-x-0 top-0 z-50">
        {/* Announcement strip */}
        <div className="bg-iridescent bg-[length:200%_100%] animate-shimmer motion-reduce:animate-none">
          <div className="py-2 font-body text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-foreground/80">
            <Marquee items={NAV.announcements} />
          </div>
        </div>

        {/* Nav bar */}
        <div
          className={cn(
            "transition-all duration-500 ease-brand",
            solid
              ? "border-b border-foreground/10 bg-background/85 backdrop-blur-md"
              : "border-b border-transparent bg-transparent",
          )}
        >
          <nav
            aria-label="Primary"
            className="mx-auto flex h-16 w-full max-w-container items-center justify-between gap-4 px-5 sm:px-8 lg:h-20 lg:px-12"
          >
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center font-display text-xl tracking-tight text-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 lg:text-2xl"
            >
              {SITE.businessName}
            </Link>

            <ul className="hidden items-center gap-8 md:flex">
              {NAV.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "inline-flex min-h-[44px] items-center font-body text-[0.9375rem]",
                      "transition-colors duration-300",
                      "hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4",
                      pathname === link.href ? "text-accent" : "text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-1">
              <BagButton />
              <button
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                className="flex h-11 w-11 items-center justify-center rounded-pill transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </nav>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
