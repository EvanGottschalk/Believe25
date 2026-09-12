/**
 * CURATION ONLY.
 *
 * Shopify is the source of truth for price, stock, variants and product
 * photography. This file decides what appears where, in what order, and with
 * what editorial framing. It must never contain a price or a stock count —
 * a hardcoded price that drifts out of date is a consumer-law problem, not
 * just a bug. See Plan §5.5.
 */

export interface CategoryConfig {
  /** Matches the Shopify collection handle. */
  handle: string;
  title: string;
  /** One line, shown on the category tile. */
  blurb: string;
  /** Occupies a double-width tile in the collection grid. */
  featured?: boolean;
  /** Display order, ascending. */
  order: number;
}

export const CATEGORIES: readonly CategoryConfig[] = [
  {
    handle: "phone-chains",
    title: "Phone Chains",
    blurb: "The one that started it all. Wear your phone.",
    featured: true,
    order: 1,
  },
  {
    handle: "necklaces",
    title: "Necklaces",
    blurb: "Layerable, everyday, quietly loud.",
    order: 2,
  },
  {
    handle: "bracelets",
    title: "Bracelets",
    blurb: "Stack them or wear just the one.",
    order: 3,
  },
  {
    handle: "anklets",
    title: "Anklets",
    blurb: "For summer, and for pretending it's summer.",
    order: 4,
  },
  {
    handle: "lanyards",
    title: "Lanyards",
    blurb: "The badge holder that finally looks like jewelry.",
    order: 5,
  },
  {
    handle: "airpod-chains",
    title: "AirPod Chains",
    blurb: "Because those go missing too.",
    order: 6,
  },
  {
    handle: "car-mirror-charms",
    title: "Car Mirror Charms",
    blurb: "A little sparkle for the drive.",
    order: 7,
  },
] as const;

/**
 * Handles of the pieces featured in the landing page's curated row.
 * Anything listed here that doesn't exist in the catalog is skipped silently.
 */
export const FEATURED_PRODUCT_HANDLES: readonly string[] = [
  "phone-chains-aurora",
  "phone-chains-leopard-queen",
  "necklaces-lilac-haze",
  "phone-chains-pearl-drop",
  "bracelets-sugar-glass",
  "airpod-chains-cotton-candy",
] as const;

/** How many products the landing page's curated row shows. */
export const FEATURED_COUNT = 6;

export const CATEGORY_HANDLES = CATEGORIES.map((c) => c.handle);

export function getCategory(handle: string): CategoryConfig | undefined {
  return CATEGORIES.find((c) => c.handle === handle);
}
