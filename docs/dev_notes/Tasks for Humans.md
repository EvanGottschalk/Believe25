# Tasks for Humans

Things I can't do myself. Each one names what's needed, why, and where it lands in the codebase.

Status legend: 🔴 blocks launch · 🟡 needed for a complete site · 🟢 nice to have · ✅ resolved

**Start here:** tasks **7a** (Shopify store), **2** (products in Shopify), and **16** (pricing) are the critical path — the shop can't take money without them. Everything else can proceed in parallel, and I can build the entire storefront against a mock catalog in the meantime.

---

## Content & Assets

### 🔴 1. Product photography
The site is built against branded gradient placeholders at the exact final aspect ratios, so photos are a drop-in swap with no layout shift. Needed:

| Shot | Count | Ratio | Destination |
|---|---|---|---|
| Phone chain on-model (hand through the loop) | 2–3 | 4:5 | `public/images/hero/` |
| Phone chain hanging hands-free (in use) | 1 | 4:5 | `public/images/phone-chain/` |
| Maker at work / workspace | 2 | 3:2 | `public/images/story/` |
| **Every product, on-white** | 1–3 each | 1:1 | **Uploaded to Shopify** |
| One lifestyle shot per category | 7 | 1:1 | **Uploaded to Shopify** |

Note the split: **product photos go into the Shopify admin** alongside the product (task #2) and are served from Shopify's CDN — they never touch the repo, and you can swap them yourself later. Only the brand/editorial shots above live in `public/images/` and are registered in `config/media.ts`.

Prefer ≥2000px on the long edge, consistent lighting, and a warm off-white or blush ground so shots sit correctly on the site's `#FFFDFE` background.

### 🔴 2. Product data — entered into Shopify, not into code
Since the site sells, **Shopify is the source of truth for everything commercial** and I don't hardcode it. For each of the 4–6 presets in each of the 7 categories, the Shopify admin needs: product name, price, variants (length, metal, bead colour), stock quantity, materials, dimensions, care instructions, and photos.

The reference sites all treat material/dimension transparency as a top trust driver — it's worth being thorough, and it's the copy that most reduces "will it last?" hesitation before checkout.

Once this is entered, it's yours to change any time from the Shopify admin with no developer involvement. What I keep in `config/products.ts` is only curation: display order, which pieces are featured on the landing page, and editorial copy.

### 🟡 3. Testimonials
3–5 real customer quotes with first name and (optionally) city, plus written permission to publish. Lands in `config/content.ts`. **I will not invent these** — fabricated reviews are both a legal and a trust problem.

### 🟡 4. The Believe25 story copy
A few sentences in your own voice: how the phone chain idea started, how long you've been making jewelry, what makes a piece yours. I'll draft a version from `Content Overview.md`, but it should ultimately be your words.

### 🟡 5. Logo file quality
`Believe25 Logo.png` is a square social-media-style image with a holographic background. For the nav I need a **transparent-background wordmark** (SVG preferred, or PNG at ≥1000px wide) that reads at ~140px wide. Also needed: a 512×512 app icon and a 32×32 favicon source.

### 🟢 6. Additional leopard/big-cat imagery
`Believe25 Leopard.PNG` is used for the "Wear Your Crown" break band. One or two more crowned-animal images would let that motif appear in the story section without repeating.

---

## Accounts & Credentials

All values go into a real `.env` file, copied from `.env - Example`. Never commit `.env`.

### 🔴 7a. Shopify store
Create a **Shopify Basic** store. Then, in the admin:

1. **Settings → Payments** — connect Shopify Payments (or PayPal). Nothing can be sold until this is done.
2. **Settings → Shipping and delivery** — set ship-from address, destination zones, and rates.
3. **Settings → Taxes and duties** — confirm the tax treatment for your region.
4. **Apps → Develop apps → Create an app** — enable these Storefront API scopes: `unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`, `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`. Install it, then reveal and send me the Storefront API access token.
5. **Settings → Notifications → Webhooks** — add a `products/update` webhook pointing at `https://<your-domain>/api/revalidate` (I'll supply the exact URL and secret).

→ `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`, `SHOPIFY_REVALIDATION_SECRET`

I can build the entire shop against a mock catalog before any of this exists, so it isn't blocking — but nothing can take real money until it's done.

**Note on the store's own theme:** customers never see it. The Shopify storefront stays unpublished/password-protected; this Next.js site is the storefront. The only Shopify-hosted page they'll see is checkout, so it's worth setting **Settings → Checkout → Branding** to the site's colors and logo.

### 🟡 7b. Checkout branding assets
For the Shopify checkout branding screen: logo (the transparent wordmark from task #5), and confirmation that the palette from the plan (§2.2) is right — background `#FFFDFE`, button `#D973A8`, accent `#7B4B9E`.

### 🔴 8. Newsletter provider
Pick one (Klaviyo, Mailchimp, or ConvertKit — Klaviyo is the standard for this category) and supply the API key and list/audience ID.
→ `NEWSLETTER_PROVIDER`, `NEWSLETTER_API_KEY`, `NEWSLETTER_LIST_ID`

### 🔴 9. Custom-design request destination
Where should completed style questionnaires go? Simplest is a Formspree form ID or a dedicated inbox; anything more is a build decision worth discussing. Requests take no payment — the piece is invoiced later through a Shopify draft order, which needs no extra setup.
→ `CUSTOM_FORM_ENDPOINT`

### 🟡 10. Domain and canonical URL
Confirm the production domain so canonical URLs, sitemap, and Open Graph tags are correct.
→ `NEXT_PUBLIC_SITE_URL`

### 🟡 11. Social profile URLs
Instagram, TikTok, Pinterest, Etsy — whichever are live. Used in the nav and footer.
→ `config/site.ts`

### 🟡 12. Analytics
Google Analytics measurement ID, or Plausible/Fathom domain if you prefer a privacy-first option (recommended — it also avoids a cookie banner). If you want purchase tracking, GA4 pairs with Shopify's own analytics; Shopify reports revenue on its own regardless.
→ `NEXT_PUBLIC_GA_MEASUREMENT_ID` *or* `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`

### 🟢 13. Deployment account
A Vercel account connected to this repo, plus the same env vars set in the Vercel project settings.

---

## Business Decisions

### ✅ 14. Commerce model — ANSWERED
**Both.** Preset designs sell through a real cart and checkout; the phone chain and everything else can also be commissioned through a custom-design request. Reflected in the plan as of 2026-09-11 (§5, "buy it or build it"). No further input needed.

### 🔴 15. Deposit on custom requests?
Should submitting a custom-design request take a small refundable deposit (say $15–25), or be completely free?

- **Free** (what the plan currently builds) — maximum request volume, but you'll field some non-serious enquiries and spend design time on them.
- **Deposit** — filters hard for intent and compensates your design time, but measurably fewer requests.

Free is the right default for launch; it can be switched on later behind a flag without a rebuild. Worth revisiting once you see real request volume.

### 🔴 16. Pricing for the preset designs
Needed for task #2. If helpful, the reference brands sit at: Ana Luisa $50–120, Mejuri $98–200, Gorjana $50–150. Phone chains are a new category with no direct comparison, which is a pricing advantage — you aren't anchored against anything.

### 🟡 17. Made-to-order vs. in-stock
For each preset: do you hold stock, or make each one to order? This changes the product page copy (a dispatch estimate vs. a stock count) and whether Shopify inventory tracking is switched on. Mixed is fine — it just needs to be per-product.

### 🟡 18. Legal copy
Privacy policy, terms of service, and — now that the site takes payment — **shipping and returns policy**, which becomes legally required rather than just good practice. Template generators are fine for a business this size; Shopify also generates serviceable drafts under Settings → Policies. I'll wire the text into `config/legal.ts` and the `/privacy`, `/terms`, and `/shipping-returns` pages.

### 🟡 19. Shipping, returns and turnaround specifics
Ship-from region, destinations served, flat rate or calculated, free-shipping threshold (drives the cart progress meter), typical dispatch time for in-stock pieces, typical turnaround for custom pieces, and the return window — including whether custom pieces are returnable, which needs stating explicitly on the custom page. Every reference site surfaces these early because they remove the top pre-purchase objection.

### 🟢 20. Contact email
A branded address (e.g. `hello@believe25.com`) rather than a personal one, for the footer, order replies, and custom-design correspondence.
