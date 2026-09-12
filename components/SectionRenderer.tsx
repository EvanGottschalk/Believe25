import { HeroSection } from "@/components/hero/HeroSection";
import { PhoneChainSection } from "@/components/body/PhoneChainSection";
import { CollectionSection } from "@/components/body/CollectionSection";
import { CustomSection } from "@/components/body/CustomSection";
import { StorySection } from "@/components/body/StorySection";
import { WaysToWearBreak } from "@/components/break/WaysToWearBreak";
import { CrownBreak } from "@/components/break/CrownBreak";
import { TestimonialsBreak } from "@/components/break/TestimonialsBreak";
import { NewsletterBreak } from "@/components/break/NewsletterBreak";
import type { CategoryConfig } from "@/config/products";
import type { Product } from "@/lib/types";

export interface SectionData {
  products: Product[];
  categories: (CategoryConfig & { count: number })[];
}

/**
 * Single mapping from section key to component, shared by the landing page and
 * the standalone /[section] routes — so a section always renders the same way
 * in both places, and `standalone` is the only difference.
 */
export function SectionRenderer({
  sectionKey,
  data,
  standalone = false,
}: {
  sectionKey: string;
  data: SectionData;
  standalone?: boolean;
}) {
  switch (sectionKey) {
    case "hero":
      return <HeroSection standalone={standalone} />;
    case "phoneChain":
      return <PhoneChainSection standalone={standalone} />;
    case "waysToWear":
      return <WaysToWearBreak />;
    case "collection":
      return (
        <CollectionSection
          products={data.products}
          categories={data.categories}
          standalone={standalone}
        />
      );
    case "crown":
      return <CrownBreak />;
    case "custom":
      return <CustomSection standalone={standalone} />;
    case "testimonials":
      return <TestimonialsBreak />;
    case "story":
      return <StorySection standalone={standalone} />;
    case "newsletter":
      return <NewsletterBreak />;
    default:
      return null;
  }
}
