/** Navigation, announcement marquee and footer link structure. */

export interface NavLink {
  label: string;
  href: string;
}

export const NAV = {
  /** Primary nav, left-to-right. */
  links: [
    { label: "Shop", href: "/shop" },
    { label: "Phone Chains", href: "/shop?category=phone-chains" },
    { label: "Made For You", href: "/custom" },
    { label: "About", href: "/about" },
  ] satisfies NavLink[],

  /** Sticky top strip. Loops; pauses on hover; hidden under reduced motion. */
  announcements: [
    "Handmade one at a time",
    "Free shipping over $75",
    "Any piece can be made just for you",
    "Designed and made in-house",
  ],

  cta: { label: "Design Your Own", href: "/custom" },
} as const;

export const FOOTER_COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "All Pieces", href: "/shop" },
      { label: "Phone Chains", href: "/shop?category=phone-chains" },
      { label: "Necklaces", href: "/shop?category=necklaces" },
      { label: "Bracelets", href: "/shop?category=bracelets" },
      { label: "AirPod Chains", href: "/shop?category=airpod-chains" },
    ],
  },
  {
    title: "Custom",
    links: [
      { label: "How It Works", href: "/made-for-you" },
      { label: "Start Your Design", href: "/custom" },
      { label: "What Is a Phone Chain?", href: "/phone-chain" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "The Story", href: "/about" },
      { label: "Contact", href: "mailto:hello@believe25.com" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Shipping & Returns", href: "/shipping-returns" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
] as const satisfies readonly { title: string; links: readonly NavLink[] }[];
