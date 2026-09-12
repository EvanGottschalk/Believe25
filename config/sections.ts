/**
 * Section registry. Drives both the landing page composition order and the
 * dynamic standalone routes at /[section].
 */

export type SectionType = "hero" | "body" | "break";

export interface SectionConfig {
  key: string;
  type: SectionType;
  /** Standalone route slug. null = never routed on its own (hero, breaks). */
  slug: string | null;
  title: string;
  /** Page <title> when rendered standalone. */
  pageTitle?: string;
  metaDescription?: string;
  enabled: boolean;
  order: number;
}

export const SECTIONS: readonly SectionConfig[] = [
  {
    key: "hero",
    type: "hero",
    slug: null,
    title: "Home",
    enabled: true,
    order: 0,
  },
  {
    key: "phoneChain",
    type: "body",
    slug: "phone-chain",
    title: "What Is a Phone Chain?",
    pageTitle: "What Is a Phone Chain?",
    metaDescription:
      "A beaded loop that hangs from your phone. Wear it on your wrist, hang it hands-free, or style it like jewelry.",
    enabled: true,
    order: 1,
  },
  {
    key: "waysToWear",
    type: "break",
    slug: null,
    title: "Three Ways to Wear It",
    enabled: true,
    order: 2,
  },
  {
    key: "collection",
    type: "body",
    slug: "collection",
    title: "The Collection",
    pageTitle: "The Collection",
    metaDescription:
      "Phone chains, necklaces, bracelets, anklets, lanyards, AirPod chains and car mirror charms — all handmade.",
    enabled: true,
    order: 3,
  },
  {
    key: "crown",
    type: "break",
    slug: null,
    title: "Wear Your Crown",
    enabled: true,
    order: 4,
  },
  {
    key: "custom",
    type: "body",
    slug: "made-for-you",
    title: "Made For You",
    pageTitle: "Made For You",
    metaDescription:
      "Answer a few questions about your style and get a one-of-one piece designed for you. Free to ask.",
    enabled: true,
    order: 5,
  },
  {
    key: "testimonials",
    type: "break",
    slug: null,
    title: "In Their Words",
    enabled: true,
    order: 6,
  },
  {
    key: "story",
    type: "body",
    slug: "about",
    title: "The Believe25 Story",
    pageTitle: "About Believe25",
    metaDescription:
      "Believe25 is one person making jewelry one piece at a time — including the phone chain.",
    enabled: true,
    order: 7,
  },
  {
    key: "newsletter",
    type: "break",
    slug: null,
    title: "Join the List",
    enabled: true,
    order: 8,
  },
] as const;

/**
 * Real pages that must never be shadowed by a section slug.
 * Validated at module load so a future section named "shop" fails loudly
 * at build time rather than silently stealing the route.
 */
export const RESERVED_SLUGS = [
  "shop",
  "custom",
  "cart",
  "api",
  "privacy",
  "terms",
  "shipping-returns",
  "images",
] as const;

const collisions = SECTIONS.filter(
  (s) => s.slug && (RESERVED_SLUGS as readonly string[]).includes(s.slug),
);
if (collisions.length > 0) {
  throw new Error(
    `config/sections.ts: section slug(s) collide with reserved routes: ${collisions
      .map((s) => s.slug)
      .join(", ")}`,
  );
}

export const ENABLED_SECTIONS = SECTIONS.filter((s) => s.enabled).sort(
  (a, b) => a.order - b.order,
);

/** Sections that can be opened as their own page. */
export const ROUTABLE_SECTIONS = ENABLED_SECTIONS.filter(
  (s): s is SectionConfig & { slug: string } => Boolean(s.slug),
);

export function getSectionBySlug(slug: string): SectionConfig | undefined {
  return ROUTABLE_SECTIONS.find((s) => s.slug === slug);
}
