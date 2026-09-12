import type { Config } from "tailwindcss";
import { THEME } from "./config/theme";

/**
 * Tokens flow from config/theme.ts into Tailwind. Swapping the brand palette
 * is a one-file change in theme.ts — nothing here needs editing.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./config/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: THEME.colors.background,
        surface: THEME.colors.surface,
        "surface-deep": THEME.colors.surfaceDeep,
        foreground: THEME.colors.foreground,
        "foreground-muted": THEME.colors.foregroundMuted,
        primary: THEME.colors.primary,
        "primary-soft": THEME.colors.primarySoft,
        accent: THEME.colors.accent,
        "accent-soft": THEME.colors.accentSoft,
        gold: THEME.colors.gold,
        "on-deep": THEME.colors.onDeep,
        "on-deep-muted": THEME.colors.onDeepMuted,
      },
      backgroundImage: {
        iridescent: THEME.gradients.iridescent,
        "iridescent-soft": THEME.gradients.iridescentSoft,
        "deep-scrim": THEME.gradients.deepScrim,
      },
      fontFamily: {
        display: ["var(--font-display)", "Didot", "Georgia", "serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        pill: THEME.radius.pill,
      },
      maxWidth: {
        container: THEME.container,
      },
      fontSize: {
        // Fluid display scale. Sized with clamp() so every breakpoint between
        // the designed ones is also correct.
        "display-xl": ["clamp(2.5rem, 5.4vw, 4.75rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2rem, 4vw, 3.25rem)", { lineHeight: "1.08", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(1.625rem, 2.8vw, 2.25rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        "display-sm": ["clamp(1.25rem, 1.9vw, 1.625rem)", { lineHeight: "1.25" }],
        eyebrow: ["0.75rem", { lineHeight: "1", letterSpacing: "0.18em" }],
      },
      transitionTimingFunction: {
        brand: THEME.ease,
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(2%, -3%, 0) scale(1.06)" },
        },
      },
      animation: {
        marquee: "marquee 42s linear infinite",
        shimmer: "shimmer 9s linear infinite",
        drift: "drift 24s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
