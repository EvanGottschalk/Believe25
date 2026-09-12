import type { Product } from "@/lib/types";
import { ProductTile } from "./ProductTile";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function ProductGrid({
  products,
  className,
  featureFirst = false,
  priorityCount = 0,
}: {
  products: Product[];
  className?: string;
  /** Gives the first tile double width, as the collection hero. */
  featureFirst?: boolean;
  priorityCount?: number;
}) {
  return (
    <RevealGroup
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8",
        className,
      )}
    >
      {products.map((product, i) => (
        <RevealItem key={product.handle} as="div" className={cn(featureFirst && i === 0 && "col-span-2")}>
          <ProductTile
            product={product}
            wide={featureFirst && i === 0}
            priority={i < priorityCount}
          />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
