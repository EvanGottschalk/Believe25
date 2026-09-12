import { COMMERCE } from "@/config/commerce";
import { formatMoney } from "@/lib/utils";

export function FreeShippingMeter({ subtotal }: { subtotal: number }) {
  const threshold = COMMERCE.freeShippingThreshold;
  if (!threshold) return null;

  const remaining = Math.max(0, threshold - subtotal);
  const pct = Math.min(100, (subtotal / threshold) * 100);
  const unlocked = remaining === 0;

  return (
    <div className="px-5 py-4">
      <p className="mb-2 font-body text-[0.8125rem] text-foreground-muted">
        {unlocked
          ? COMMERCE.copy.freeShippingUnlocked
          : COMMERCE.copy.freeShippingProgress(
              formatMoney({ amount: remaining, currencyCode: COMMERCE.currency }),
            )}
      </p>
      <div
        className="h-1 w-full overflow-hidden rounded-pill bg-surface"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progress toward free shipping"
      >
        <div
          className="h-full rounded-pill bg-iridescent bg-[length:200%_100%] transition-[width] duration-500 ease-brand motion-reduce:transition-none"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
