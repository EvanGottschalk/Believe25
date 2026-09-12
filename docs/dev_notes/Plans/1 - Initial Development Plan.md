# 1 — Initial Development Plan

**Project:** Believe25 landing page
**Status:** Plan approved for build — not yet implemented
**Author:** Claude (Opus 5)
**Date:** 2026-09-11

---

## 1. Brief

Believe25 is a handmade jewelry and accessory business. Its flagship product is the **Phone Chain** — a beaded loop that hangs from a phone so it can be worn on the wrist, hung hands-free for selfies, and styled like jewelry. Every category also carries 4–6 preset designs, and *anything* can be made as a one-of-one custom piece.

The site is a single-scroll landing page whose Hero and Body sections are each independently routable as standalone pages, per `Site Structure Outline.md` and `Site Software Architecture.md` — **and a working storefront.** It sells the preset designs through a real cart and checkout, and takes custom-design requests through a style questionnaire. Both paths are first-class; see §5.

### Positioning statement (drives all copy)

> Believe25 invented jewelry for the thing you hold all day. Phone chains, necklaces, bracelets — designed one at a time, for one person at a time.

Two ideas must land within the first two screens: **(1) the phone chain is a new category of accessory**, and **(2) anything here can be bought as-is or made for you specifically.**

### Voice

Elegant but warm. Short declarative sentences. First person singular for the maker's story ("I design every piece"), second person everywhere else ("Your phone. Your chain."). Never corporate, never salesy, never emoji-laden. The Y2K sparkle of the logo lives in the *visuals*; the *words* stay clean and confident.

---

## 2. Design direction

### 2.1 The synthesis problem

There are two brand inputs that pull in opposite directions:

- `Believe25 Logo.png` — Y2K holographic, glitter type, pink butterflies, grid mesh. Playful, youthful, maximalist.
- `Believe25 Leopard.PNG` — a painterly crowned leopard, muted rose ground. Regal, editorial, restrained.

And the reference set (`Example Sites/`) is uniformly **editorial-minimalist**: enormous whitespace, one idea per screen, full-bleed photography, high-contrast serif display type, understated underlined CTAs (Mejuri, Annoushka, Alex Monroe), tile grids for categories (Annoushka §3, Daniella Draper §2), and full-bleed image bands with a single centered line of overlay type (Annoushka §5).

**Resolution:** build the *editorial-minimalist* structure of the reference sites, then let the Y2K/iridescent brand energy come through in **color, motion, and accent only** — never in layout density. Whitespace does the luxury work; the pink-lilac iridescence and the crowned leopard do the personality work. This is what makes it look expensive *and* like Believe25, rather than like a generic Shopify jewelry theme.

### 2.2 Palette (`config/theme.ts`)

| Token | Hex | Role |
|---|---|---|
| `background` | `#FFFDFE` | Page ground — warm off-white, never pure `#fff` |
| `surface` | `#FBF2F6` | Alternating section ground, cards, tiles |
| `surfaceDeep` | `#2B1836` | Inverted sections (footer, CTA band) — near-black plum |
| `foreground` | `#2B1836` | Body text — plum-black, never `#000` |
| `foregroundMuted` | `#6E5A78` | Secondary copy, captions |
| `primary` | `#D973A8` *(pink)* | Primary CTA fill, active states |
| `primarySoft` | `#F4C6DE` | Hover washes, chips, dividers |
| `accent` | `#7B4B9E` *(purple)* | Links, focus rings, eyebrow labels |
| `accentSoft` | `#E3D4F0` | Section tints |
| `gold` | `#C9A227` | Crown/jewel accent — used at ≤2% of any screen |
| `iridescent` | `linear-gradient(110deg,#F4C6DE,#E3D4F0,#CBD9F5,#F4C6DE)` | Animated gradient for rules, marquee, hero glow |

Contrast: `foreground` on `background` is ~13:1; `primary` is used as a **fill** with white text (4.6:1), never as small text on white. All pairings must pass WCAG AA — verify during Phase 8.

### 2.3 Type (`next/font`, declared in `config/theme.ts`)

| Role | Face | Usage |
|---|---|---|
| Display | **Bodoni Moda** | Section headings, hero headline. High-contrast didone = fashion-luxury. `clamp()` sized, tight tracking, never all-caps. |
| Body / UI | **Jost** | All copy, nav, buttons. Geometric sans — friendly and modern without being generic. |
| Eyebrow | Jost 500, `uppercase`, `tracking-[0.18em]`, 12px | Small kicker labels above headings ("THE FLAGSHIP", "MADE FOR YOU") |

Two families only. No third font load.

### 2.4 Motion language (`config/motion.ts`)

Every animation is one of five named, shared variants — this is what keeps the site coherent instead of looking like a demo reel:

1. `riseIn` — 24px up + fade, `whileInView`, `once: true`, 0.6s, custom ease `[0.16,1,0.3,1]`. The default reveal for every text block.
2. `staggerChildren` — 0.08s cascade for grids and lists.
3. `imageReveal` — clip-path wipe + 1.06→1.0 scale, 0.9s. For any full-bleed image entering.
4. `parallaxDrift` — `useScroll` + `useTransform`, ±8% Y. Hero and break-band imagery only.
5. `swing` — `useSpring` physics, used only by the Hero phone chain.

**`prefers-reduced-motion` is a hard requirement, not a nicety.** A single `useReducedMotion()` hook collapses every variant to an instant opacity fade and disables parallax and the marquee. Given the iridescent gradients and swinging hero, skipping this would be genuinely unpleasant for motion-sensitive visitors.

---

## 3. Site structure

Order obeys the alternation rule from `Site Structure Outline.md` — Body and Break alternate, and **no two Break sections are ever adjacent.**

| # | Type | Name | Component | Standalone slug |
|---|---|---|---|---|
| 0 | Layout | Top Menu | `layout/TopMenu.tsx` | — |
| 1 | Hero | The Phone Chain | `hero/HeroSection.tsx` | `/` |
| 2 | Body | What Is a Phone Chain? | `body/PhoneChainSection.tsx` | `/phone-chain` |
| 3 | Break | Three Ways to Wear It | `break/WaysToWearBreak.tsx` | — |
| 4 | Body | The Collection | `body/CollectionSection.tsx` | `/collection` |
| 5 | Break | Wear Your Crown (leopard band) | `break/CrownBreak.tsx` | — |
| 6 | Body | Made For You | `body/CustomSection.tsx` | `/custom` |
| 7 | Break | In Their Words (testimonials) | `break/TestimonialsBreak.tsx` | — |
| 8 | Body | The Believe25 Story | `body/StorySection.tsx` | `/about` |
| 9 | Break | Join the List (newsletter) | `break/NewsletterBreak.tsx` | — |
| 10 | Layout | Footer | `layout/Footer.tsx` | — |

Alongside these, the site has five routes that are **not** section projections: `/shop`, `/shop/[handle]`, `/custom`, `/custom/thank-you`, and the legal pages. See §4.2 and §5.

### 3.0 Top Menu

Sticky. Two rows on desktop: a thin **iridescent announcement marquee** (looping, pausable, hidden under reduced-motion) above a transparent nav bar that gains a blurred `background/80` backdrop and a hairline border once `scrollY > 24`. Logo left, links center, search + **bag** right. The bag icon carries a count badge that pops on add and opens the cart drawer (§5.4). Collapses to a hamburger at `md:` and below opening a full-screen overlay panel with staggered link entrance; the bag stays visible in the collapsed bar rather than hiding inside the menu. Pattern source: Mejuri and Ana Luisa top strips.

### 3.1 Hero — "The Phone Chain"

Full viewport. **This is the most important screen on the site and gets the heaviest engineering.**

- **Left (or bottom on mobile):** eyebrow `AN ACCESSORY THAT DIDN'T EXIST` → display headline **"Jewelry for the thing you never put down."** → one-sentence subhead → two CTAs: filled `Shop Phone Chains` + underlined-link `Design Your Own` (Mejuri/Annoushka CTA idiom).
- **Right:** a phone rendered in CSS with a **bead chain looping from its corner that physically swings** — `useSpring` responding to pointer movement on desktop and `deviceorientation` tilt on mobile, settling to a gentle idle sway. The beads are SVG circles along a quadratic path, so no image asset is required to ship this and it stays crisp at any size.
- **Ground:** slow-drifting iridescent radial glow, `parallaxDrift` on scroll.
- Mobile: stacks to a single column, chain scales to ~60% and swings on tilt only.

The swinging chain *demonstrates the product's core benefit in the first second* — it's the one interaction on the site that is genuinely load-bearing rather than decorative.

### 3.2 Body — What Is a Phone Chain?

The explainer. A sticky-scroll sequence: the phone graphic pins while three captioned states advance — **Loop it on your wrist** (never drop it) → **Hang it anywhere** (hands-free photos and video) → **Wear it as jewelry** (it's an accessory, not a case). Each state cross-fades an annotated SVG diagram. Falls back to three stacked cards on mobile and under reduced motion.

### 3.3 Break — Three Ways to Wear It

Short horizontal band, `surface` ground. Three icon + one-line-benefit columns with a `staggerChildren` reveal. Light by design — it's a breath after the sticky sequence.

### 3.4 Body — The Collection

**Shoppable.** Tile grid modeled on Annoushka §3 / Daniella Draper §2: square tiles, generous gutters, name and price beneath, subtle scale-on-hover with an iridescent border sweep. Seven categories from `Content Overview.md`: Phone Chains, Necklaces, Bracelets, Anklets, Lanyards, AirPod Chains, Car Mirror Charms. Phone Chains occupies a double-width hero tile.

On the landing page this renders a **curated row of best-selling preset designs** (chosen in `config/products.ts`, priced live from the commerce API) plus a category strip; `/collection` renders the full grid. Every tile carries the dual path described in §5.2 — a quick-add **Add to Bag** revealed on hover/focus, and a secondary **Make it yours** chip beneath. Daniella Draper does exactly this with its "Personalise this" band under each best-seller tile, and it's the cleanest precedent in the reference set for offering both without the two CTAs competing.

### 3.5 Break — Wear Your Crown

Full-bleed `Believe25 Leopard.PNG` band at ~38vh with a slow `parallaxDrift`, a plum-to-transparent scrim, and a single centered display line — **"Wear your crown."** Exactly the Annoushka §5 idiom. This is where the brand's animal imagery earns its place, in one confident moment rather than scattered everywhere.

### 3.6 Body — Made For You

The custom-design pitch, and the second of the site's two conversion paths. Five numbered steps (Tell me your style → I design your piece → You approve the design → You're sent an invoice → It's made by hand) laid out on a connected iridescent timeline that draws itself in on scroll. The step about *when you pay* is deliberately on the timeline: naming it up front removes the main hesitation about commissioning something open-ended.

Beside it, a **live 3-question style-quiz preview** (color mood / vibe / piece type) whose selections animate a small preview swatch — a taste of the real flow, ending in `Start Your Design →` which routes to `/custom`. Interactive proof beats a paragraph describing the process. Requesting a design is free and takes no payment details; the flow is specified in §5.3.

### 3.7 Break — In Their Words

A low, quiet testimonial band: one quote at a time with a slow auto-advancing cross-fade and dot controls, on `surfaceDeep`. Pauses on hover and under reduced motion.

### 3.8 Body — The Believe25 Story

Asymmetric editorial split (Mejuri §1 idiom): oversized display heading on the left, two short paragraphs in the right column with an underlined `More about me` link, above a two-up image pair that reveals with `imageReveal`. Personal, first-person, handmade-credibility copy.

### 3.9 Break — Join the List

Inverted `surfaceDeep` band. One line of copy, one email field, one button. Posts to the newsletter endpoint from `config/forms.ts`. Inline success/error states, no modal.

### 3.10 Footer

No animation, per the outline. Four link columns (Shop / Custom / About / Help), social row, payment/handmade badges, newsletter repeat, legal line with Privacy Policy and Terms links. Structure modeled on Mejuri §5.

---

## 4. Architecture

Per `Site Software Architecture.md`, extended for commerce. Next.js 15 (App Router) · TypeScript strict · Tailwind CSS · Framer Motion · `next/font` · Shopify Storefront API.

```
app/
  layout.tsx              # fonts, TopMenu, CartProvider, CartDrawer, Footer, JSON-LD
  page.tsx                # composes enabled sections in registry order
  [section]/page.tsx      # dynamic standalone section route + generateStaticParams
  shop/
    page.tsx              # full catalog, filterable by category
    [handle]/page.tsx     # product detail page
  custom/
    page.tsx              # full style questionnaire
    thank-you/page.tsx    # request received
  api/
    cart/route.ts         # cart mutations (server-side, token never exposed)
    custom-request/route.ts
    newsletter/route.ts
    revalidate/route.ts   # Shopify product-update webhook
  privacy/page.tsx  terms/page.tsx  shipping-returns/page.tsx
  not-found.tsx
components/
  layout/    TopMenu.tsx  Footer.tsx  MobileMenu.tsx  BagButton.tsx
  hero/      HeroSection.tsx  PhoneChain.tsx
  body/      PhoneChainSection.tsx  CollectionSection.tsx
             CustomSection.tsx  StorySection.tsx
  break/     WaysToWearBreak.tsx  CrownBreak.tsx
             TestimonialsBreak.tsx  NewsletterBreak.tsx
  commerce/  ProductTile.tsx  ProductGrid.tsx  ProductDetail.tsx
             VariantPicker.tsx  AddToBagButton.tsx  Price.tsx
             CartDrawer.tsx  CartLine.tsx  FreeShippingMeter.tsx
             MakeItYoursChip.tsx
  custom/    StyleQuiz.tsx  QuizStep.tsx  QuizPreview.tsx
  ui/        Button.tsx  LinkCTA.tsx  Eyebrow.tsx  Reveal.tsx
             SectionShell.tsx  IridescentRule.tsx  Marquee.tsx  Drawer.tsx
config/
  site.ts  nav.ts  sections.ts  content.ts  theme.ts  motion.ts
  commerce.ts  products.ts  media.ts  forms.ts  legal.ts
lib/
  shopify/  client.ts  queries.ts  mutations.ts  normalize.ts  types.ts
  cart/     CartContext.tsx  useCart.ts
  types.ts  utils.ts  useReducedMotionSafe.ts  useScrollPast.ts
public/images/
```

### 4.1 The Config Paradigm (non-negotiable)

Every string, URL, color, flag, and threshold lives in `config/*.ts` as an exported `as const` object and is imported at the usage site. No literal values in components — this includes the scroll threshold that solidifies the nav, the testimonial rotation interval, and image alt text.

| File | Owns |
|---|---|
| `site.ts` | Business name, tagline, email, socials, canonical URL |
| `nav.ts` | Menu links, mobile menu, CTA targets, announcement marquee items |
| `sections.ts` | Section registry — slug, title, type, `enabled` flag, order |
| `content.ts` | Every UI string, heading, paragraph, label, alt text |
| `theme.ts` | Color tokens, font selections, spacing/radius scale |
| `motion.ts` | Named variants, durations, easings, stagger values |
| `commerce.ts` | Currency + locale, free-shipping threshold, cart/checkout copy, bag behaviour flags, API version |
| `products.ts` | **Curation only** — category definitions, Shopify collection handles, display order, which presets are featured, editorial copy. *Never prices or stock* (§5.5) |
| `media.ts` | Image paths, dimensions, aspect ratios, priority flags |
| `forms.ts` | Endpoint names, field configs, validation messages, quiz questions and options |
| `legal.ts` | Privacy/terms/shipping copy and effective dates |

`theme.ts` is the single source of truth for color and feeds `tailwind.config.ts`, which exposes tokens as utilities (`bg-surface`, `text-accent`). Components use token utilities only — never `bg-[#D973A8]`.

### 4.2 Section contract and dual routing

```ts
export interface SectionProps { standalone?: boolean }
```

Every Body section renders correctly both inline and as its own page. `app/[section]/page.tsx` resolves the slug against `SECTIONS`, 404s on unknown or disabled slugs, statically generates all enabled slugs via `generateStaticParams`, and passes `standalone` so the section adds vertical padding and shows its heading without duplication. Per-slug metadata (title, description, OG image) comes from the registry.

Commerce routes (`/shop`, `/shop/[handle]`, `/custom`) sit **outside** the section registry — they are real pages, not section projections, and the dynamic `[section]` route must not shadow them. `SECTIONS` slugs are validated against a reserved-slug list at module load so a future section named `shop` fails loudly at build rather than silently stealing the route.

Each page beyond the landing page gets an entry in `docs/dev_notes/Additional Pages.md`, written as it is built (Phases 7–8).

### 4.3 Responsive

Mobile-first. Tailwind `sm:`/`md:`/`lg:`/`xl:` breakpoints only — **no custom media queries in component files.** Every section is designed from 360px outward. Verify at 360 / 390 / 768 / 1024 / 1440 / 1920. Fluid type via `clamp()` in the Tailwind scale. Touch targets ≥44px. Hero, sticky-scroll sequence, and tile grids each get an explicitly designed mobile layout rather than a squeezed desktop one.

---

## 5. Commerce

The site does two jobs that are usually done by two different sites: it **sells finished pieces** and it **takes commissions**. Getting these to coexist without either one muddying the other is the central product problem of the build.

### 5.1 Platform: headless Shopify

**Recommendation: Shopify Basic, used headlessly via the Storefront API, with Shopify's hosted checkout.**

Why this and not a lighter option:

- It gives a **merchant admin a non-developer can actually run** — adding a product, changing a price, marking something sold out, printing a shipping label. Without this, every catalog change becomes a code change and a deploy, which is untenable for a one-person handmade business.
- Inventory, shipping zones and rates, tax calculation, discount codes, abandoned-cart email, and the order/fulfilment workflow all come for free. Each is unglamorous, each is genuinely hard to get right, and none of them are where this project's effort should go.
- **Draft orders** let a bespoke piece be invoiced through the same checkout once its price is agreed (§5.3) — this is precisely what the custom path needs and it's the deciding factor over Stripe.
- Hosted checkout means **card data never touches our code**, PCI scope is effectively zero, and Shop Pay / Apple Pay / Google Pay work out of the box on a conversion-tuned flow that would take months to match.
- Headless keeps 100% design control in Next.js. The bespoke design *is* the product here — a Shopify theme would undo the entire point of the build.
- It matches the category: Mejuri, Gorjana, Ring Concierge, and Ana Luisa all run Shopify; Daniella Draper runs Magento.

**The lighter alternative,** if the monthly fee is unwelcome: Stripe Checkout against a hand-maintained catalog in `config/products.ts`. Cheaper and simpler, but there is no admin, no inventory tracking, no draft-order invoicing, and every product edit is a deploy. I'd take Shopify unless cost is decisive — the commerce layer is isolated behind `lib/shopify/`, so swapping providers later touches one directory, but it is still a rewrite of that directory.

### 5.2 The two paths — "buy it or build it"

Both paths appear on every product surface, **clearly ranked rather than side-by-side as equals.** Two same-weight CTAs is the classic way to convert neither.

| | **Preset design** | **Custom design** |
|---|---|---|
| Entry | `Add to Bag` — primary, filled `primary` | `Make it yours` — secondary chip/underline |
| Price | Live from the API, shown up front | Quoted after the design is agreed |
| Payment | Immediately, at checkout | On invoice, after approval |
| Flow | Tile/PDP → bag → checkout | Quiz → request → proof → invoice → made |
| Fulfilment | Ships from stock or made-to-order | Made by hand per piece |

The rule for every surface: **the visible price is the buyable thing.** Where a price is shown, `Add to Bag` is the primary action. `Make it yours` is always present, always secondary, and never carries a price.

### 5.3 The custom flow in detail

1. **Quiz** (`/custom`) — the 3-question preview from §3.6 expands to ~6 questions: piece type, colour mood, vibe, metal, length/fit, and a free-text "anything else". Progress indicator, back navigation, answers persisted to `sessionStorage` so a refresh doesn't lose the work. Contact details are asked **last**, after investment is already made.
2. **Submit** — posts to `/api/custom-request`, which validates server-side, rate-limits by IP, and forwards to the configured destination. **No payment details are collected and no account is required.** The request is free; saying so plainly on the form materially raises completion.
3. **Design & proof** — offline. The maker designs the piece and sends the customer a proof.
4. **Invoice** — on approval, the maker raises a **Shopify draft order** at the agreed price and sends the invoice link. The customer pays through the same checkout, and the order lands in the same admin with the same shipping and tax treatment as a preset sale.
5. **Made and shipped.**

Steps 3–5 are deliberately human and happen outside the site. Automating a bespoke design conversation would be worse than not automating it, and the build should not pretend otherwise.

> **Open business decision:** whether to take a small refundable design deposit at step 2. It filters out non-serious requests but measurably reduces volume. Logged as a human task; the build ships without a deposit and can add one behind a flag in `config/commerce.ts`.

### 5.4 Cart and checkout

- **Cart drawer**, slide-over from the right, opening on add and on bag click. Line items with thumbnail, variant, quantity stepper and remove; subtotal; a config-driven **free-shipping progress meter**; `Checkout` primary and `Keep looking` dismiss. Focus-trapped, `Esc` to close, scroll-locked behind it, `aria-modal`, focus returned to the bag button on close.
- **Cart state** lives in a `CartContext` backed by the Shopify Cart API. The cart ID persists in `localStorage`; a `storage` listener keeps multiple tabs in sync. Mutations are optimistic with rollback on failure, so the drawer never feels laggy.
- **All Storefront API calls go through route handlers** in `app/api/cart/` — the access token stays server-side.
- **Checkout** redirects to Shopify's hosted checkout, branded to the palette in §2.2 as far as Shopify's settings allow. We do not build a custom checkout.
- **Add-to-bag feedback:** the bag badge pops, the drawer opens, and the added line briefly highlights. No toast, no interstitial, no redirect away from browsing.

### 5.5 Non-negotiables

- **Price and inventory come from the API on every render — never from `config/products.ts`.** A hardcoded price that drifts out of date isn't a bug, it's a consumer-law problem. This is the one deliberate carve-out from the Config Paradigm: config owns *curation*, the commerce API owns *commercial truth*. Product copy, ordering, and which tiles are featured stay in config.
- Sold-out variants render disabled with a `Notify me` link, never silently unavailable.
- The cart survives reload, navigation, and standalone-section routes.
- No card data is ever stored, logged, or proxied through our own server.
- Currency and price formatting come from `config/commerce.ts` via `Intl.NumberFormat`.
- Product data is fetched server-side with tag-based caching; the `/api/revalidate` webhook purges tags on Shopify product updates, so a price change is live within seconds without a deploy.
- `Product` JSON-LD on every PDP (name, image, price, availability) — this is how jewelry SEO earns rich results.

---

## 6. Imagery strategy

Only two real assets exist today (`Believe25 Logo.png`, `Believe25 Leopard.PNG`), and product photography is a human dependency (§8). The build must not stall on it.

Note that once Shopify is live, **product imagery is served from Shopify's CDN**, not `public/images/` — photos are uploaded once in the admin alongside the product rather than committed to the repo. `next/image` is configured with the Shopify CDN as a remote pattern. Only editorial and brand imagery (hero, leopard band, story) lives in the repo.

- Everything the site *can* draw itself, it draws: the hero phone and bead chain, the ways-to-wear diagrams, icons, and all decorative flourishes are **SVG/CSS**. These are final, not placeholders.
- Everything that needs a real photograph ships against a **branded gradient placeholder** at the exact final aspect ratio, wired to a path in `config/media.ts` or to a mock product in the commerce layer. Replacing photography is then a drop-in swap with zero layout shift.
- All raster images go through `next/image` with explicit dimensions, `sizes`, AVIF/WebP, `priority` on the hero only, and blur placeholders.

---

## 7. Build phases

| Phase | Work | Exit criteria |
|---|---|---|
| **0** | Scaffold: Next.js + TS strict + Tailwind + Framer Motion, fonts, full `config/` skeleton, `.env - Example`, ESLint/Prettier | `npm run dev` serves a themed blank page; tokens resolve |
| **1** | Design system: tokens → Tailwind, `ui/` primitives, `motion.ts` variants, `useReducedMotionSafe`, `Drawer` | Primitives render in both motion modes |
| **2** | Layout: TopMenu (scroll state, marquee, mobile overlay, bag button) + Footer | Nav correct at all breakpoints; footer links resolve |
| **3** | Hero, including the spring-physics phone chain and its tilt/pointer inputs | Chain swings smoothly on desktop and mobile; static under reduced motion |
| **4** | **Commerce core:** `lib/shopify/` client + typed queries, `CartContext`, cart API routes, `ProductTile`, `ProductGrid`, `Price`, `AddToBagButton`, `CartDrawer` | A product can be added, quantity changed, and the cart survives reload |
| **5** | **Shop routes:** `/shop`, `/shop/[handle]` with variant picker, materials/dimensions/care, `Product` JSON-LD, checkout handoff | A real test order completes end to end through Shopify checkout |
| **6** | Body sections 2, 4, 6, 8 — Collection consumes Phase 4 components | Each reads correctly inline and standalone |
| **7** | Break sections 3, 5, 7, 9 | Alternation rule holds; break motion stays visibly lighter than body motion |
| **8** | **Custom flow:** `/custom` quiz, `sessionStorage` persistence, `/api/custom-request` with validation + rate limiting, thank-you page, `Make it yours` entry points wired across every product surface | A submitted request arrives at the configured destination with all answers intact |
| **9** | Routing & content: `[section]` route + reserved-slug guard, metadata, sitemap, robots, Organization JSON-LD, 404, legal + shipping/returns pages, newsletter | Every enabled slug renders and 404s when disabled; no route collisions |
| **10** | QA: responsive sweep, WCAG AA contrast + keyboard + focus-visible + screen reader, reduced motion, cart/checkout edge cases (sold out, network failure, stale cart), Lighthouse ≥95 all four, cross-browser | All gates pass |
| **11** | Deploy prep: Vercel env vars, Shopify webhook registration, image checklist, final `Tasks for Humans.md` and `Additional Pages.md` pass | Ready to hand off |

Commerce comes before the body sections because `CollectionSection` consumes `ProductTile` and the cart — building it first avoids writing that section twice. Phases 6 and 7 are the bulk of the design work and can interleave. **Phases 5 and 10 are gates, not cleanup passes**: a storefront that takes money is held to a higher bar than a landing page, and a broken checkout is worse than no checkout.

### Working without Shopify credentials

Phase 4 can begin before the store exists. `lib/shopify/client.ts` ships with a **fixture mode** — a typed mock catalog matching the real Storefront API response shape, enabled when `SHOPIFY_STORE_DOMAIN` is unset. Every commerce component is built and reviewed against fixtures, and pointing at the real store is a credential change, not a code change. This also keeps the commerce layer testable in CI without network access.

---

## 8. Human dependencies

Recorded in full in `docs/dev_notes/Tasks for Humans.md`. Those that block a *complete* launch — none block starting the build, thanks to fixture mode:

1. **Shopify store**, with payments connected and shipping/tax configured.
2. **Products loaded into Shopify** — names, prices, variants, stock, materials, dimensions, care, and photos, for the 4–6 presets in each of the 7 categories.
3. **Product and editorial photography** — see §6.
4. **Custom-request destination + newsletter credentials** — see `.env - Example`.
5. **Legal copy** — privacy, terms, shipping and returns.
6. **Deposit decision** for custom requests (§5.3).

---

## 9. Success criteria

- A first-time visitor understands what a phone chain is, that they can buy one now, and that they can have one made, **without scrolling past the second section.**
- A visitor can go from landing to Shopify checkout in **three taps** — tile → Add to Bag → Checkout — on a phone.
- **Both paths are reachable from every product surface**, and it is never ambiguous which one a given button starts.
- No displayed price or stock state is ever stale: both come from the commerce API, and a change in the Shopify admin is live within seconds without a deploy.
- The cart survives reload, navigation, and a second tab.
- Nothing else is hardcoded: changing the brand's pink or the business name is a one-file edit.
- Every section is deliberately designed at 360px, not merely non-broken.
- Lighthouse ≥95 across Performance, Accessibility, Best Practices, SEO.
- The site is fully usable, and still looks considered, with animation disabled.
- It reads as peer to the reference sites in `Example Sites/` — while being unmistakably Believe25.
