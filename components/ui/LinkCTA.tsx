import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The understated underlined link used across the reference sites
 * (Mejuri's "SHOP NOW", Annoushka's "SHOP MOST LOVED"). Secondary to Button.
 */
export function LinkCTA({
  href,
  children,
  className,
  tone = "default",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "onDeep";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 font-body text-sm font-medium tracking-wide",
        "min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        "focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-sm",
        tone === "onDeep" ? "text-on-deep" : "text-foreground",
        className,
      )}
    >
      <span
        className={cn(
          "relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left",
          "after:scale-x-100 after:transition-transform after:duration-500 after:ease-brand",
          "group-hover:after:scale-x-0",
          tone === "onDeep" ? "after:bg-on-deep" : "after:bg-foreground",
        )}
      >
        {children}
      </span>
      <span
        aria-hidden
        className="translate-x-0 transition-transform duration-500 ease-brand group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}
