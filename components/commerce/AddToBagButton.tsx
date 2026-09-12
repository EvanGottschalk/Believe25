"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/cart/CartContext";
import { COMMERCE } from "@/config/commerce";
import type { ProductVariant } from "@/lib/types";
import { cn } from "@/lib/utils";

export function AddToBagButton({
  variant,
  size = "md",
  full = false,
  className,
  label,
}: {
  variant: ProductVariant | null;
  size?: "sm" | "md" | "lg";
  full?: boolean;
  className?: string;
  label?: string;
}) {
  const { add, isBusy } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(false), 1800);
    return () => clearTimeout(t);
  }, [justAdded]);

  const unavailable = !variant || !variant.available;

  if (unavailable) {
    return (
      <Button
        variant="secondary"
        size={size}
        disabled
        className={cn(full && "w-full", className)}
      >
        {COMMERCE.copy.soldOut}
      </Button>
    );
  }

  return (
    <Button
      variant="primary"
      size={size}
      className={cn(full && "w-full", className)}
      disabled={isBusy}
      onClick={async () => {
        await add(variant.id, 1);
        setJustAdded(true);
      }}
    >
      {justAdded
        ? COMMERCE.copy.added
        : isBusy
          ? COMMERCE.copy.adding
          : (label ?? COMMERCE.copy.addToBag)}
    </Button>
  );
}
