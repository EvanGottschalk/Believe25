import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ROUTABLE_SECTIONS, getSectionBySlug } from "@/config/sections";
import { SectionRenderer } from "@/components/SectionRenderer";
import {
  getAllProducts,
  getCategoriesWithCounts,
  getFeaturedProducts,
} from "@/lib/shopify/client";
import { SITE } from "@/config/site";

export function generateStaticParams() {
  return ROUTABLE_SECTIONS.map((s) => ({ section: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section: slug } = await params;
  const section = getSectionBySlug(slug);
  if (!section) return {};

  const title = section.pageTitle ?? section.title;
  return {
    title,
    description: section.metaDescription ?? SITE.description,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title: `${title} · ${SITE.businessName}`,
      description: section.metaDescription ?? SITE.description,
      url: `${SITE.url}/${slug}`,
    },
  };
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: slug } = await params;
  const section = getSectionBySlug(slug);
  if (!section) notFound();

  // The collection page shows the whole catalog; elsewhere the curated row
  // is enough and costs less to render.
  const [products, categories] = await Promise.all([
    section.key === "collection" ? getAllProducts() : getFeaturedProducts(),
    getCategoriesWithCounts(),
  ]);

  return (
    <SectionRenderer sectionKey={section.key} data={{ products, categories }} standalone />
  );
}
