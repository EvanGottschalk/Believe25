# Believe25

Landing page and storefront for Believe25 — handmade phone chains, jewelry and accessories.

Next.js 15 (App Router) · TypeScript · Tailwind · Framer Motion · Shopify Storefront API.

## Run it

```bash
npm install
npm run dev
```

The site runs immediately with **no configuration**. With no Shopify credentials set it
falls back to a built-in mock catalog ("fixture mode"), so the whole storefront —
grid, product pages, cart, checkout handoff — is browsable and reviewable before the
real store exists. Pointing at Shopify is a credential change, not a code change.

```bash
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run lint
```

## Configuration

Copy `.env - Example` to `.env` and fill in what you have. Everything else —
copy, colours, navigation, sections, products curation — lives in `config/*.ts`.
No literal values in components.

| File | Owns |
|---|---|
| `config/site.ts` | Business identity, socials, canonical URL |
| `config/theme.ts` | Colour tokens and fonts (feeds `tailwind.config.ts`) |
| `config/content.ts` | Every UI string |
| `config/sections.ts` | Section registry — order, slugs, enable flags |
| `config/commerce.ts` | Cart behaviour, currency, shipping threshold |
| `config/products.ts` | Curation only — never prices or stock |
| `config/motion.ts` | The five shared animation variants |
| `config/forms.ts` | Endpoints and the custom-design questionnaire |
| `config/legal.ts` | Privacy, terms, shipping and returns |
| `config/nav.ts`, `config/media.ts` | Navigation, brand imagery |

**Prices and stock always come from the commerce API, never from config.** See
`docs/dev_notes/Plans/1 - Initial Development Plan.md` §5.5.

## Docs

- `docs/dev_notes/Plans/1 - Initial Development Plan.md` — design direction, architecture, commerce model
- `docs/dev_notes/Additional Pages.md` — every route and what it does
- `docs/dev_notes/Tasks for Humans.md` — what's still needed from the business owner
