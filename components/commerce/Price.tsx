import type { Money } from "@/lib/types";
import { cn, formatMoney, formatPriceRange } from "@/lib/utils";

/**
 * Every price on the site renders through here, and every value passed in
 * originates from the commerce API — never from config. See Plan §5.5.
 */
export function Price({
  amount,
  compareAt,
  className,
}: {
  amount: Money;
  compareAt?: Money | null;
  className?: string;
}) {
  const onSale = compareAt && compareAt.amount > amount.amount;
  return (
    <span className={cn("font-body tabular-nums", className)}>
      <span className={cn(onSale && "text-primary")}>{formatMoney(amount)}</span>
      {onSale && (
        <span className="ml-2 text-foreground-muted line-through">
          {formatMoney(compareAt)}
        </span>
      )}
    </span>
  );
}

export function PriceRange({
  min,
  max,
  className,
}: {
  min: Money;
  max: Money;
  className?: string;
}) {
  return (
    <span className={cn("font-body tabular-nums", className)}>
      {formatPriceRange(min, max)}
    </span>
  );
}
