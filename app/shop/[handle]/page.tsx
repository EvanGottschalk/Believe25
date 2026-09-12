import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionShell } from "@/components/ui/SectionShell";
import { Reveal } from "@/components/ui/Reveal";
import { ProductDetail } from "@/components/commerce/ProductDetail";
import { ProductGrid } from "@/components/commerce/ProductGrid";
import { getAllProducts, getProduct } from "@/lib/shopify/client";
import { CONTENT } from "@/config/content";
import { SITE } from "@/config/site";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return {};

  return {
    title: product.title,
    description: product.description.slice(0, 160),
    alternates: { canonical: `/shop/${handle}` },
    openGraph: {
      title: `${product.title} · ${SITE.businessName}`,
      description: product.description.slice(0, 160),
      url: `${SITE.url}/shop/${handle}`,
      images: product.images[0] ? [{ url: product.images[0].url }] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const all = await getAllProducts();
  const related = all
    .filter((p) => p.category === product.category && p.handle !== product.handle)
    .slice(0, 4);

  // Product JSON-LD — how jewelry SEO earns rich results. Price and
  // availability come from the same live data the page renders.
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((i) => i.url),
    brand: { "@type": "Brand", name: SITE.businessName },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: product.priceRange.min.currencyCode,
      lowPrice: product.priceRange.min.amount,
      highPrice: product.priceRange.max.amount,
      offerCount: product.variants.length,
      availability: product.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${SITE.url}/shop/${product.handle}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />

      <SectionShell standalone ground="background">
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            href="/shop"
            className="inline-flex min-h-[44px] items-center gap-2 font-body text-sm text-foreground-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span aria-hidden>←</span>
            {CONTENT.product.backToShop}
          </Link>
        </nav>

        <ProductDetail product={product} />

        {related.length > 0 && (
          <div className="mt-24">
            <Reveal>
              <h2 className="font-display text-display-md">
                {CONTENT.product.relatedHeading}
              </h2>
            </Reveal>
            <ProductGrid products={related} className="mt-8" />
          </div>
        )}
      </SectionShell>
    </>
  );
}
