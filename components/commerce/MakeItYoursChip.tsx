import Link from "next/link";
import { COMMERCE } from "@/config/commerce";
import { cn } from "@/lib/utils";

/**
 * The custom path's entry point, present on every product surface.
 *
 * Always secondary to Add to Bag and never carries a price — the rule from
 * Plan §5.2 is that the visible price is the buyable thing. Modelled on
 * Daniella Draper's "Personalise this" band beneath each product tile.
 */
export function MakeItYoursChip({
  productHandle,
  className,
  full = false,
}: {
  productHandle?: string;
  className?: string;
  full?: boolean;
}) {
  const href = productHandle ? `/custom?from=${productHandle}` : "/custom";

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-pill",
        "border border-accent/25 bg-accent-soft/40 px-4 text-[0.8125rem] font-medium text-accent",
        "transition-colors duration-300 ease-brand hover:border-accent/60 hover:bg-accent-soft",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        full && "w-full",
        className,
      )}
    >
      <span aria-hidden className="text-gold">✦</span>
      {COMMERCE.copy.makeItYours}
    </Link>
  );
}
