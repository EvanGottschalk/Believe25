/**
 * Brand and editorial imagery only.
 *
 * Product photography lives in Shopify and is served from its CDN — it never
 * enters this repo. See Plan §6.
 *
 * Entries with an empty `src` render a branded gradient placeholder at the
 * exact final aspect ratio, so dropping the real photograph in later causes
 * zero layout shift.
 */

export interface MediaAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

export const MEDIA = {
  logo: {
    src: "/images/brand/believe25-logo.png",
    alt: "Believe25",
    width: 500,
    height: 500,
  },

  /** Full-bleed band behind "Wear your crown". */
  crown: {
    src: "/images/brand/believe25-leopard.png",
    alt: "A leopard wearing a jewelled gold crown",
    width: 543,
    height: 499,
  },

  /** Story section image pair. Awaiting photography — see Tasks for Humans #1. */
  story: [
    { src: "", alt: "Believe25 pieces laid out on a work surface", width: 1200, height: 800 },
    { src: "", alt: "A phone chain being assembled by hand", width: 1200, height: 800 },
  ],

  /** Open Graph fallback. */
  ogImage: {
    src: "/images/brand/believe25-logo.png",
    alt: "Believe25",
    width: 500,
    height: 500,
  },
} as const satisfies Record<string, MediaAsset | readonly MediaAsset[]>;

/** Hosts allowed through next/image. Shopify's CDN serves product photos. */
export const REMOTE_IMAGE_HOSTS = ["cdn.shopify.com"] as const;
