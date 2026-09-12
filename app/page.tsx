import { ENABLED_SECTIONS } from "@/config/sections";
import { SectionRenderer } from "@/components/SectionRenderer";
import { getCategoriesWithCounts, getFeaturedProducts } from "@/lib/shopify/client";

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategoriesWithCounts(),
  ]);

  const data = { products, categories };

  return (
    <>
      {ENABLED_SECTIONS.map((section) => (
        <SectionRenderer key={section.key} sectionKey={section.key} data={data} />
      ))}
    </>
  );
}
