/**
 * Design tokens. Single source of truth for colour, type and scale.
 * These flow into tailwind.config.ts and are exposed as utilities
 * (bg-surface, text-accent, font-display). Components use the utilities —
 * never a raw hex value.
 */

export const THEME = {
  colors: {
    /** Page ground. Warm off-white, deliberately never pure #fff. */
    background: "#FFFDFE",
    /** Alternating section ground, cards, tiles. */
    surface: "#FBF2F6",
    /** Inverted sections: footer, CTA band, testimonials. */
    surfaceDeep: "#2B1836",
    /** Body text. Plum-black, deliberately never #000. */
    foreground: "#2B1836",
    /** Secondary copy, captions, meta. */
    foregroundMuted: "#6E5A78",
    /** Primary CTA fill, active states. Used as a fill with white text. */
    primary: "#D973A8",
    /** Hover washes, chips, dividers. */
    primarySoft: "#F4C6DE",
    /** Links, focus rings, eyebrow labels. */
    accent: "#7B4B9E",
    /** Section tints. */
    accentSoft: "#E3D4F0",
    /** Crown / jewel accent. Used at <=2% of any screen. */
    gold: "#C9A227",
    /** On-dark text for inverted sections. */
    onDeep: "#FBF2F6",
    onDeepMuted: "#B9A3C4",
  },

  /** Animated iridescent gradient for rules, marquee and the hero glow. */
  gradients: {
    iridescent:
      "linear-gradient(110deg, #F4C6DE 0%, #E3D4F0 28%, #CBD9F5 52%, #F4C6DE 78%, #E3D4F0 100%)",
    iridescentSoft:
      "linear-gradient(110deg, #FBF2F6 0%, #F4C6DE 35%, #E3D4F0 65%, #FBF2F6 100%)",
    deepScrim:
      "linear-gradient(180deg, rgba(43,24,54,0) 0%, rgba(43,24,54,0.35) 55%, rgba(43,24,54,0.78) 100%)",
  },

  fonts: {
    /** High-contrast didone. Headings and the hero headline. */
    display: "Bodoni Moda",
    /** Geometric sans. All copy, nav, buttons. */
    body: "Jost",
  },

  radius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "1rem",
    pill: "999px",
  },

  /** Max content width for standard sections. */
  container: "88rem",

  /** Scroll distance (px) after which the top menu solidifies. */
  navSolidifyAt: 24,

  /** Shared easing curve. Matches motion.ts. */
  ease: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

export type ThemeColor = keyof typeof THEME.colors;
