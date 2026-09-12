import Link from "next/link";
import { SectionShell, Eyebrow } from "@/components/ui/SectionShell";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { LinkCTA } from "@/components/ui/LinkCTA";
import { ProductGrid } from "@/components/commerce/ProductGrid";
import { CONTENT } from "@/config/content";
import type { CategoryConfig } from "@/config/products";
import type { Product, SectionProps } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props extends SectionProps {
  products: Product[];
  categories: (CategoryConfig & { count: number })[];
}

/**
 * Shoppable. On the landing page this is a curated row plus a category strip;
 * the full grid lives at /shop. Every tile carries both paths (Plan §5.2).
 */
export function CollectionSection({ products, categories, standalone = false }: Props) {
  const hasProducts = products.length > 0;

  return (
    <SectionShell id="collection" standalone={standalone} ground="surface">
      <Reveal className="max-w-2xl">
        <Eyebrow>{CONTENT.collection.eyebrow}</Eyebrow>
        <h2 className="mt-4 font-display text-display-lg">{CONTENT.collection.heading}</h2>
        <p className="mt-5 font-body text-lg leading-relaxed text-foreground-muted">
          {CONTENT.collection.intro}
        </p>
      </Reveal>

      {hasProducts ? (
        <div className="mt-14">
          <Reveal>
            <h3 className="font-body text-eyebrow font-medium uppercase tracking-[0.18em] text-foreground-muted">
              {CONTENT.collection.featuredHeading}
            </h3>
          </Reveal>
          <ProductGrid products={products} className="mt-6" featureFirst />
        </div>
      ) : (
        <Reveal className="mt-12 rounded-lg border border-foreground/10 bg-background p-8">
          <p className="font-body text-foreground-muted">{CONTENT.collection.emptyState}</p>
        </Reveal>
      )}

      {/* Category strip */}
      <div className="mt-20">
        <Reveal>
          <h3 className="font-body text-eyebrow font-medium uppercase tracking-[0.18em] text-foreground-muted">
            {CONTENT.collection.categoriesHeading}
          </h3>
        </Reveal>

        <RevealGroup as="ul" className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <RevealItem as="li" key={category.handle}>
              <Link
                href={`/shop?category=${category.handle}`}
                className={cn(
                  "group flex h-full flex-col justify-between rounded-lg border border-foreground/10 bg-background p-5",
                  "transition-all duration-400 ease-brand hover:-translate-y-0.5 hover:border-accent/40",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                  category.featured && "sm:col-span-2 lg:col-span-2",
                )}
              >
                <div>
                  <h4
                    className={cn(
                      "font-display",
                      category.featured ? "text-display-sm" : "text-lg",
                    )}
                  >
                    {category.title}
                  </h4>
                  <p className="mt-1.5 font-body text-sm leading-snug text-foreground-muted">
                    {category.blurb}
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 font-body text-xs uppercase tracking-[0.14em] text-accent">
                  {CONTENT.shop.countLabel(category.count)}
                  <span
                    aria-hidden
                    className="transition-transform duration-400 ease-brand group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      <Reveal className="mt-12">
        <LinkCTA href={CONTENT.collection.cta.href}>{CONTENT.collection.cta.label}</LinkCTA>
      </Reveal>
    </SectionShell>
  );
}
