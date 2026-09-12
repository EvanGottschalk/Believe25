"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { Price } from "./Price";
import { AddToBagButton } from "./AddToBagButton";
import { MakeItYoursChip } from "./MakeItYoursChip";
import { COMMERCE } from "@/config/commerce";
import { CONTENT } from "@/config/content";
import { getCategory } from "@/config/products";
import { cn } from "@/lib/utils";

export function ProductDetail({ product }: { product: Product }) {
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    // Default to the first available variant rather than the first variant,
    // so a product whose first combination is sold out still opens buyable.
    const first = product.variants.find((v) => v.available) ?? product.variants[0];
    return Object.fromEntries(
      (first?.selectedOptions ?? []).map((o) => [o.name, o.value]),
    );
  });
  const [activeImage, setActiveImage] = useState(0);

  const variant = useMemo(() => {
    return (
      product.variants.find((v) =>
        v.selectedOptions.every((o) => selected[o.name] === o.value),
      ) ?? null
    );
  }, [product.variants, selected]);

  const category = getCategory(product.category);
  const stock = variant?.quantityAvailable;

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Gallery */}
      <div className="flex flex-col gap-3">
        <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-surface">
          {product.images[activeImage] && (
            <Image
              src={product.images[activeImage].url}
              alt={product.images[activeImage].altText}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          )}
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={img.url}
                onClick={() => setActiveImage(i)}
                aria-label={`View image ${i + 1}`}
                aria-current={i === activeImage}
                className={cn(
                  "relative h-20 w-20 overflow-hidden rounded-sm bg-surface transition-opacity",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                  i === activeImage ? "ring-1 ring-accent" : "opacity-60 hover:opacity-100",
                )}
              >
                <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail */}
      <div className="flex flex-col">
        {category && (
          <Link
            href={`/shop?category=${category.handle}`}
            className="font-body text-eyebrow font-medium uppercase text-accent hover:underline"
          >
            {category.title}
          </Link>
        )}

        <h1 className="mt-3 font-display text-display-lg">{product.title}</h1>

        <div className="mt-4 flex items-center gap-4">
          {variant ? (
            <Price
              amount={variant.price}
              compareAt={variant.compareAtPrice}
              className="text-xl"
            />
          ) : (
            <span className="font-body text-xl text-foreground-muted">—</span>
          )}
          <span className="font-body text-sm text-foreground-muted">
            {product.madeToOrder ? COMMERCE.copy.madeToOrder : COMMERCE.copy.inStock}
          </span>
        </div>

        <p className="mt-5 max-w-prose font-body leading-relaxed text-foreground-muted">
          {product.description}
        </p>

        {/* Variants */}
        {product.options.map((option) => (
          <fieldset key={option.name} className="mt-7">
            <legend className="font-body text-eyebrow font-medium uppercase tracking-[0.18em] text-foreground-muted">
              {option.name}
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {option.values.map((value) => {
                const candidate = { ...selected, [option.name]: value };
                const match = product.variants.find((v) =>
                  v.selectedOptions.every((o) => candidate[o.name] === o.value),
                );
                const disabled = !match || !match.available;
                const active = selected[option.name] === value;
                return (
                  <button
                    key={value}
                    onClick={() => setSelected(candidate)}
                    disabled={disabled}
                    aria-pressed={active}
                    className={cn(
                      "min-h-[44px] rounded-pill border px-5 font-body text-sm transition-all duration-300 ease-brand",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                      active
                        ? "border-accent bg-accent-soft/50 text-accent"
                        : "border-foreground/15 text-foreground hover:border-foreground/40",
                      disabled &&
                        "cursor-not-allowed border-foreground/10 text-foreground-muted/50 line-through hover:border-foreground/10",
                    )}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}

        {/* Both paths, clearly ranked. */}
        <div className="mt-8 flex flex-col gap-3">
          <AddToBagButton variant={variant} size="lg" full />
          {typeof stock === "number" && stock > 0 && stock <= 3 && (
            <p className="font-body text-sm text-primary">{COMMERCE.copy.lowStock(stock)}</p>
          )}
          <p className="font-body text-sm text-foreground-muted">
            {product.madeToOrder
              ? COMMERCE.copy.dispatchMadeToOrder
              : COMMERCE.copy.dispatchInStock}
          </p>
        </div>

        <ul className="mt-6 flex flex-col gap-1.5">
          {COMMERCE.assurances.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 font-body text-sm text-foreground-muted"
            >
              <span aria-hidden className="text-gold">✦</span>
              {item}
            </li>
          ))}
        </ul>

        {/* The custom path */}
        <div className="mt-8 rounded-lg border border-accent/20 bg-accent-soft/25 p-6">
          <h2 className="font-display text-display-sm">
            {CONTENT.product.customCard.heading}
          </h2>
          <p className="mt-2 max-w-prose font-body text-sm leading-relaxed text-foreground-muted">
            {CONTENT.product.customCard.body}
          </p>
          <MakeItYoursChip productHandle={product.handle} className="mt-4" />
        </div>

        {/* Details — the transparency that removes pre-purchase anxiety. */}
        <dl className="mt-10 divide-y divide-foreground/10 border-t border-foreground/10">
          {[
            [CONTENT.product.materialsHeading, product.details.materials],
            [CONTENT.product.dimensionsHeading, product.details.dimensions],
            [CONTENT.product.careHeading, product.details.care],
          ]
            .filter(([, value]) => Boolean(value))
            .map(([label, value]) => (
              <div key={label} className="py-4">
                <dt className="font-body text-eyebrow font-medium uppercase tracking-[0.18em] text-foreground-muted">
                  {label}
                </dt>
                <dd className="mt-1.5 max-w-prose font-body text-sm leading-relaxed">
                  {value}
                </dd>
              </div>
            ))}
        </dl>
      </div>
    </div>
  );
}
