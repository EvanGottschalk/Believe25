/** Business identity. */

export const SITE = {
  businessName: "Believe25",
  /** Used in <title> templates and the nav wordmark fallback. */
  shortName: "Believe25",
  tagline: "Jewelry for the thing you never put down.",
  description:
    "Handmade phone chains, necklaces and accessories. Shop the collection, or have a one-of-one piece designed for you.",
  email: "hello@believe25.com",
  /** Overridden by NEXT_PUBLIC_SITE_URL in production. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://believe25.com",
  locale: "en_US",

  /** Only entries with a url render. Fill these in as profiles go live. */
  socials: [
    { label: "Instagram", url: "https://instagram.com/believe25" },
    { label: "TikTok", url: "https://tiktok.com/@believe25" },
    { label: "Pinterest", url: "" },
    { label: "Etsy", url: "" },
  ],

  /** Founding year, shown in the footer copyright line. */
  foundedYear: 2025,
} as const;
