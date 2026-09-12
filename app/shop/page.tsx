import type { Metadata } from "next";
import Link from "next/link";
import { SectionShell, Eyebrow } from "@/components/ui/SectionShell";
import { Reveal } from "@/components/ui/Reveal";
import { ProductGrid } from "@/components/commerce/ProductGrid";
import { MakeItYoursChip } from "@/components/commerce/MakeItYoursChip";
import { getAllProducts, getCategoriesWithCounts } from "@/lib/shopify/client";
import { CONTENT } from "@/config/content";
import { getCategory } from "@/config/products";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: CONTENT.shop.title,
  description: CONTENT.shop.intro,
  alternates: { canonical: "/shop" },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [all, categories] = await Promise.all([
    getAllProducts(),
    getCategoriesWithCounts(),
  ]);

  const active = category && getCategory(category) ? category : null;
  const products = active ? all.filter((p) => p.category === active) : all;
  const activeConfig = active ? getCategory(active) : null;

  return (
    <SectionShell standalone ground="background">
      <Reveal className="max-w-2xl">
        <Eyebrow>{CONTENT.collection.eyebrow}</Eyebrow>
        <h1 className="mt-4 font-display text-display-lg">
          {activeConfig ? activeConfig.title : CONTENT.shop.title}
        </h1>
        <p className="mt-5 font-body text-lg leading-relaxed text-foreground-muted">
          {activeConfig ? activeConfig.blurb : CONTENT.shop.intro}
        </p>
      </Reveal>

      {/* Category filter */}
      <nav aria-label="Categories" className="mt-10">
        <ul className="flex flex-wrap gap-2">
          <li>
            <FilterLink href="/shop" active={!active}>
              {CONTENT.shop.allLabel}
            </FilterLink>
          </li>
          {categories.map((c) => (
            <li key={c.handle}>
              <FilterLink href={`/shop?category=${c.handle}`} active={active === c.handle}>
                {c.title}
              </FilterLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Names the grid so headings run H1 -> H2 -> H3 without skipping a level. */}
      <h2 className="sr-only">
        {activeConfig ? activeConfig.title : CONTENT.shop.allLabel}
      </h2>
      <p className="mt-6 font-body text-sm text-foreground-muted">
        {CONTENT.shop.countLabel(products.length)}
      </p>

      {products.length > 0 ? (
        <ProductGrid products={products} className="mt-8" priorityCount={4} />
      ) : (
        <div className="mt-10 rounded-lg border border-foreground/10 bg-surface p-8">
          <p className="font-body text-foreground-muted">
            {all.length === 0 ? CONTENT.collection.emptyState : CONTENT.shop.emptyCategory}
          </p>
          <MakeItYoursChip className="mt-4" />
        </div>
      )}
    </SectionShell>
  );
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex min-h-[44px] items-center rounded-pill border px-5 font-body text-sm",
        "transition-all duration-300 ease-brand",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        active
          ? "border-accent bg-accent-soft/50 text-accent"
          : "border-foreground/15 text-foreground hover:border-foreground/40",
      )}
    >
      {children}
    </Link>
  );
}
