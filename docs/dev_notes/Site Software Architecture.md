## Platform Architecture: Business Website System

### Technology Stack

**Core:** Next.js 14+ (App Router), TypeScript, React, Tailwind CSS
**Animation:** Framer Motion
**Fonts:** next/font
**Deployment:** Vercel (assumed)

---

### Directory Structure

```
/
├── app/
│   ├── layout.tsx                  # Root layout (Top Menu + Footer)
│   ├── page.tsx                    # Homepage (Hero + Body + Break sections composed)
│   └── [section-slug]/
│       └── page.tsx                # Standalone section page
│
├── components/
│   ├── layout/
│   │   ├── TopMenu.tsx
│   │   └── Footer.tsx
│   ├── hero/
│   │   └── HeroSection.tsx
│   ├── body/
│   │   └── [SectionName]Section.tsx
│   ├── break/
│   │   └── [SectionName]Break.tsx
│   └── ui/                         # Shared primitives (Button, Badge, etc.)
│
├── config/
│   ├── site.ts                     # Business identity (name, address, phone, tagline)
│   ├── nav.ts                      # Menu links, CTA targets
│   ├── sections.ts                 # Section registry: slugs, metadata, feature flags
│   ├── content.ts                  # All UI strings, copy, labels
│   ├── theme.ts                    # Color tokens, font choices, spacing scale
│   └── legal.ts                    # Privacy policy URL, legal copy
│
├── lib/
│   ├── types.ts                    # Shared TypeScript interfaces
│   └── utils.ts                    # Classname helpers, formatters
│
└── public/
    └── images/
```

---

### The Config Paradigm

Every literal value — strings, URLs, colors, flags, thresholds — lives in `config/*.ts`. Components never contain hardcoded values. This means spinning up a new business site is primarily a config-editing exercise, not a component-editing one.

```ts
// config/site.ts
export const SITE = {
  businessName: "Sunrise Bakery",
  tagline: "Fresh from our oven every morning.",
  phone: "(631) 555-0182",
  address: "14 Main St, Southampton, NY 11968",
  email: "hello@sunrisebakery.com",
} as const;
```

```ts
// config/sections.ts
export const SECTIONS = {
  hero: { slug: null, title: "Home" },
  menu: { slug: "menu", title: "Our Menu", enabled: true },
  story: { slug: "story", title: "Our Story", enabled: true },
  catering: { slug: "catering", title: "Catering", enabled: false }, // feature flag
} as const;
```

---

### Routing Model

Next.js App Router handles both the full homepage composition and standalone section pages.

**Homepage** (`app/page.tsx`): imports and sequences all enabled sections — Hero, then alternating Body and Break sections — reading order from `config/sections.ts`.

**Standalone section pages** (`app/[section-slug]/page.tsx`): a single dynamic route resolves any registered slug against the section registry, renders the corresponding section component full-screen with the shared Top Menu and Footer, and returns a 404 for unknown or disabled slugs.

This means every Body Section component is written to function both as a page scroll-section and as a standalone routed page, without modification.

---

### Section Component Contract

All section components share a consistent interface:

```ts
// lib/types.ts
export interface SectionProps {
  standalone?: boolean; // true when rendered as its own page
}
```

The `standalone` prop lets a section adjust its layout slightly — e.g. adding more vertical padding, or showing a heading that would otherwise be redundant on the homepage.

**Section types and their design constraints:**

| Type | Height | Animation Weight | Responsive Requirement |
|---|---|---|---|
| Hero | Full viewport | Heavy — keyframes, parallax, interactive | Critical |
| Body | ~100vh | Medium — scroll-triggered reveals, hover states | Critical |
| Break | ~30–40vh | Light — simple transitions, subtle motion | Critical |
| Footer | Auto | None | Critical |

---

### Responsive Design Convention

All sections are built mobile-first. Tailwind's `sm:` / `md:` / `lg:` breakpoints are the only responsive mechanism — no custom media queries in component files. Layout decisions (stack vs. side-by-side, font scale, image sizing) are expressed entirely through Tailwind utility classes. The Top Menu collapses to a hamburger at `md:` and below.

---

### Theme System

Color tokens and font selections live in `config/theme.ts` and flow into `tailwind.config.ts` as custom tokens. This means swapping a business's brand palette is a single-file change.

```ts
// config/theme.ts
export const THEME = {
  colors: {
    primary: "#C8A96E",
    primaryForeground: "#1A1208",
    accent: "#E8F4EA",
    background: "#FDFAF5",
    foreground: "#1A1208",
  },
  fonts: {
    display: "Playfair Display",   // injected via next/font
    body: "Source Serif 4",
  },
} as const;
```

---

### Reuse Model for New Clients

Spinning up a new business site means:

1. Fork the base repository
2. Edit `config/*.ts` files with the new business's identity, copy, and color palette
3. Swap images in `public/images/`
4. Toggle `enabled` flags in `config/sections.ts` for sections relevant to that business
5. Optionally add or remove Body/Break section components for business-specific needs

No component code changes required for a standard deployment. Custom sections are additive — new files in `components/body/` or `components/break/`, registered in `config/sections.ts`.

---

### Key Architectural Principles Summary

- **Config is the product surface.** Components are reusable infrastructure; configs define each client's site.
- **Sections are self-contained and route-aware.** Each renders correctly both inline and standalone.
- **Design tokens flow from config → Tailwind → components.** No hardcoded colors or font names in JSX.
- **Animation is layered, not scattered.** Framer Motion handles scroll-triggered reveals and Hero interactions; CSS handles hover micro-interactions.
- **Mobile-first, always.** Every section is designed from the narrowest viewport outward.