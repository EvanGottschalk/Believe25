"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { PriceRange } from "./Price";
import { AddToBagButton } from "./AddToBagButton";
import { MakeItYoursChip } from "./MakeItYoursChip";
import { COMMERCE } from "@/config/commerce";
import { cn } from "@/lib/utils";

/**
 * Carries both paths, clearly ranked: Add to Bag is primary and appears on
 * hover/focus; Make it yours sits beneath as a persistent secondary.
 */
export function ProductTile({
  product,
  priority = false,
  wide = false,
}: {
  product: Product;
  priority?: boolean;
  wide?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const image = product.images[0];
  const hoverImage = product.images[1] ?? image;
  // Single-variant products can be added straight from the tile; multi-variant
  // ones send the customer to the page to choose first.
  const soleVariant = product.variants.length === 1 ? product.variants[0] : null;

  return (
    <article
      className={cn("group flex flex-col", wide && "sm:col-span-2")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={`/shop/${product.handle}`}
        className={cn(
          "relative block w-full overflow-hidden rounded-sm bg-surface",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
          wide ? "aspect-[4/3] sm:aspect-[16/10]" : "aspect-square",
        )}
      >
        {image && (
          <Image
            src={hovered && hoverImage !== image ? hoverImage.url : image.url}
            alt={image.altText}
            fill
            priority={priority}
            sizes={wide ? "(max-width: 640px) 100vw, 66vw" : "(max-width: 640px) 50vw, 25vw"}
            className="object-cover transition-transform duration-700 ease-brand group-hover:scale-[1.04]"
          />
        )}

        {/* Iridescent border sweep on hover. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-sm opacity-0 ring-1 ring-inset ring-primary/40 transition-opacity duration-500 group-hover:opacity-100"
        />

        {!product.available && (
          <span className="absolute left-3 top-3 rounded-pill bg-background/90 px-3 py-1 text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-foreground-muted">
            {COMMERCE.copy.soldOut}
          </span>
        )}
        {product.madeToOrder && product.available && (
          <span className="absolute left-3 top-3 rounded-pill bg-background/90 px-3 py-1 text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-accent">
            {COMMERCE.copy.madeToOrder}
          </span>
        )}

        {/* Quick-add. Hidden until hover on pointer devices; always present for
            keyboard users via focus-within, and always visible on touch. */}
        {soleVariant && product.available && (
          <div
            className={cn(
              "absolute inset-x-3 bottom-3 transition-all duration-400 ease-brand",
              "opacity-100 translate-y-0",
              "sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0",
              "sm:group-focus-within:opacity-100 sm:group-focus-within:translate-y-0",
            )}
            onClick={(e) => e.preventDefault()}
          >
            <AddToBagButton variant={soleVariant} size="sm" full />
          </div>
        )}
      </Link>

      <div className="mt-4 flex flex-1 flex-col gap-1">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-body text-[0.9375rem] font-medium text-foreground">
            <Link
              href={`/shop/${product.handle}`}
              className="inline-block py-1 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              {product.title}
            </Link>
          </h3>
          <PriceRange
            min={product.priceRange.min}
            max={product.priceRange.max}
            className="shrink-0 text-[0.9375rem] text-foreground-muted"
          />
        </div>

        <div className="mt-2">
          <MakeItYoursChip productHandle={product.handle} />
        </div>
      </div>
    </article>
  );
}
