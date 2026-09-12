/**
 * Fixture catalog — the mock store used whenever SHOPIFY_STORE_DOMAIN is unset.
 *
 * Shapes match what normalize.ts produces from the real Storefront API, so
 * every commerce component can be built and reviewed before the store exists.
 * Pointing at the real Shopify store is a credential change, not a code change.
 *
 * Prices here are working estimates for development only. Real prices are
 * entered in the Shopify admin (Tasks for Humans #2 and #16).
 */

import type { Product, ProductVariant } from "@/lib/types";
import { COMMERCE } from "@/config/commerce";
import { gradientPlaceholder } from "@/lib/utils";

interface PresetSpec {
  name: string;
  /** Working price estimate, major units. */
  price: number;
  madeToOrder?: boolean;
  soldOut?: boolean;
  tags?: string[];
}

interface CategorySpec {
  handle: string;
  options: { name: string; values: string[] }[];
  materials: string;
  dimensions: string;
  care: string;
  blurb: (name: string) => string;
  presets: PresetSpec[];
}

const CARE_DEFAULT =
  "Keep it dry and away from perfume. Store it flat in the pouch it arrived in. A soft cloth brings the shine back.";

const SPECS: CategorySpec[] = [
  {
    handle: "phone-chains",
    options: [
      { name: "Length", values: ["Wrist", "Crossbody"] },
      { name: "Metal", values: ["Gold", "Silver"] },
    ],
    materials:
      "Glass and acrylic beads, freshwater pearls, 18k gold-plated or rhodium-plated findings, reinforced nylon core.",
    dimensions: "Wrist loop 22cm · Crossbody 120cm. Adjustable tether pad fits any case.",
    care: CARE_DEFAULT,
    blurb: (n) =>
      `${n} is a phone chain — a loop of beads that fastens to your phone so you can wear it on your wrist, hang it up for hands-free photos, or just enjoy looking at it. Made by hand, one at a time.`,
    presets: [
      { name: "Aurora", price: 68, tags: ["bestseller"] },
      { name: "Leopard Queen", price: 78, tags: ["bestseller"] },
      { name: "Pearl Drop", price: 72 },
      { name: "Sugar Rush", price: 58 },
      { name: "Midnight Jewel", price: 82, madeToOrder: true },
      { name: "Clear Skies", price: 54, soldOut: true },
    ],
  },
  {
    handle: "necklaces",
    options: [
      { name: "Length", values: ['16"', '18"', '20"'] },
      { name: "Metal", values: ["Gold", "Silver"] },
    ],
    materials:
      "Glass beads and freshwater pearls on 18k gold-plated or sterling silver chain, lobster clasp.",
    dimensions: 'Available at 16", 18" and 20". Extender chain included.',
    care: CARE_DEFAULT,
    blurb: (n) =>
      `${n} — a handmade necklace built to layer with everything else you already wear.`,
    presets: [
      { name: "Lilac Haze", price: 64, tags: ["bestseller"] },
      { name: "Petal", price: 52 },
      { name: "Crown Jewel", price: 78, madeToOrder: true },
      { name: "Little Star", price: 48 },
      { name: "Opaline", price: 68 },
    ],
  },
  {
    handle: "bracelets",
    options: [{ name: "Size", values: ["Small", "Medium", "Large"] }],
    materials: "Glass and acrylic beads on elastic or gold-plated chain, sterling findings.",
    dimensions: "Small 16cm · Medium 18cm · Large 20cm.",
    care: CARE_DEFAULT,
    blurb: (n) => `${n} — made to stack, or to wear on its own.`,
    presets: [
      { name: "Sugar Glass", price: 42, tags: ["bestseller"] },
      { name: "Rosewater", price: 38 },
      { name: "Gold Rush", price: 56 },
      { name: "Confetti", price: 44 },
    ],
  },
  {
    handle: "anklets",
    options: [{ name: "Size", values: ["Standard", "Long"] }],
    materials: "Glass seed beads and shell charms on waterproof cord.",
    dimensions: "Standard 24cm · Long 27cm, with 3cm adjuster.",
    care: "Waterproof cord — swim in it. Rinse with fresh water afterwards.",
    blurb: (n) => `${n} — an anklet for summer, and for pretending it's summer.`,
    presets: [
      { name: "Seashell", price: 38 },
      { name: "Sunset Strip", price: 42 },
      { name: "Tiger Lily", price: 46 },
      { name: "Barefoot", price: 34 },
    ],
  },
  {
    handle: "lanyards",
    options: [{ name: "Attachment", values: ["Clip", "Ring"] }],
    materials: "Beaded cord with reinforced core, gold-plated or silver clasp and badge clip.",
    dimensions: "80cm loop. Breakaway safety clasp on request.",
    care: CARE_DEFAULT,
    blurb: (n) =>
      `${n} — the badge holder that finally looks like something you'd choose to wear.`,
    presets: [
      { name: "Office Hours", price: 52 },
      { name: "Pearl Pass", price: 62, madeToOrder: true },
      { name: "Candy Stripe", price: 48 },
      { name: "Backstage", price: 58 },
    ],
  },
  {
    handle: "airpod-chains",
    options: [{ name: "Fit", values: ["AirPods Pro", "AirPods 3", "Universal"] }],
    materials: "Beaded strap with silicone case loop, gold-plated or silver findings.",
    dimensions: "Neck loop 70cm. Case loop fits most wireless earbud cases.",
    care: CARE_DEFAULT,
    blurb: (n) => `${n} — because those go missing too.`,
    presets: [
      { name: "Cotton Candy", price: 44, tags: ["bestseller"] },
      { name: "Frost", price: 38 },
      { name: "Honey", price: 42 },
      { name: "Violet Hour", price: 46 },
    ],
  },
  {
    handle: "car-mirror-charms",
    options: [{ name: "Drop", values: ["Short", "Long"] }],
    materials: "Faceted crystals and glass beads on gold-plated chain with mirror loop.",
    dimensions: "Short 14cm drop · Long 20cm drop.",
    care: "Wipe with a dry cloth. Remove before a car wash.",
    blurb: (n) => `${n} — a little sparkle for the drive.`,
    presets: [
      { name: "Prism", price: 32 },
      { name: "Lucky Charm", price: 36 },
      { name: "Disco", price: 38 },
      { name: "Crown", price: 42, madeToOrder: true },
    ],
  },
];

function money(amount: number) {
  return { amount, currencyCode: COMMERCE.currency };
}

function cartesian(options: { name: string; values: string[] }[]) {
  return options.reduce<{ name: string; value: string }[][]>(
    (acc, opt) =>
      acc.flatMap((combo) =>
        opt.values.map((value) => [...combo, { name: opt.name, value }]),
      ),
    [[]],
  );
}

function buildProduct(spec: CategorySpec, preset: PresetSpec): Product {
  const handle = `${spec.handle}-${preset.name.toLowerCase().replace(/\s+/g, "-")}`;
  const combos = cartesian(spec.options);

  const variants: ProductVariant[] = combos.map((selectedOptions, i) => {
    // A deterministic sprinkle of sold-out variants keeps the disabled-state
    // UI honest during development.
    const variantSoldOut = preset.soldOut || (i > 0 && i % 7 === 0);
    const premium = selectedOptions.some(
      (o) => o.value === "Crossbody" || o.value === '20"' || o.value === "Large",
    );
    return {
      id: `gid://fixture/ProductVariant/${handle}-${i}`,
      title: selectedOptions.map((o) => o.value).join(" / "),
      available: !variantSoldOut,
      quantityAvailable: variantSoldOut ? 0 : preset.madeToOrder ? null : ((i * 3) % 5) + 1,
      price: money(preset.price + (premium ? 8 : 0)),
      compareAtPrice: null,
      selectedOptions,
    };
  });

  const prices = variants.map((v) => v.price.amount);

  return {
    id: `gid://fixture/Product/${handle}`,
    handle,
    title: preset.name,
    description: spec.blurb(preset.name),
    category: spec.handle,
    images: [
      {
        url: gradientPlaceholder(handle, 1200, 1200),
        altText: `${preset.name} — ${spec.handle.replace(/-/g, " ")}`,
        width: 1200,
        height: 1200,
      },
      {
        url: gradientPlaceholder(`${handle}-2`, 1200, 1200),
        altText: `${preset.name}, detail`,
        width: 1200,
        height: 1200,
      },
    ],
    options: spec.options,
    variants,
    priceRange: { min: money(Math.min(...prices)), max: money(Math.max(...prices)) },
    available: variants.some((v) => v.available),
    details: {
      materials: spec.materials,
      dimensions: spec.dimensions,
      care: spec.care,
    },
    madeToOrder: Boolean(preset.madeToOrder),
    tags: preset.tags ?? [],
  };
}

export const FIXTURE_PRODUCTS: Product[] = SPECS.flatMap((spec) =>
  spec.presets.map((preset) => buildProduct(spec, preset)),
);

export function fixtureProductByHandle(handle: string): Product | undefined {
  return FIXTURE_PRODUCTS.find((p) => p.handle === handle);
}

export function fixtureProductsByCategory(category: string): Product[] {
  return FIXTURE_PRODUCTS.filter((p) => p.category === category);
}

export function fixtureVariantById(id: string) {
  for (const product of FIXTURE_PRODUCTS) {
    const variant = product.variants.find((v) => v.id === id);
    if (variant) return { product, variant };
  }
  return undefined;
}
