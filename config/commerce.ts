/**
 * Commerce behaviour and copy.
 *
 * NOTE: prices and stock are NEVER configured here. They come from the
 * commerce API on every render (see lib/shopify/). This file owns how
 * commerce *behaves* and what it *says*, not what anything costs.
 */

export const COMMERCE = {
  currency: "USD",
  locale: "en-US",

  /** Free shipping above this amount, in major units. null disables the meter. */
  freeShippingThreshold: 75,

  /**
   * Custom design requests take no payment. Flipping this to true enables a
   * refundable design deposit at request time — see Tasks for Humans #15.
   */
  customDepositEnabled: false,
  customDepositAmount: 20,

  /** Open the cart drawer automatically after adding an item. */
  openDrawerOnAdd: true,

  /** Shopify Storefront API version. Pinned deliberately. */
  apiVersion: process.env.SHOPIFY_API_VERSION ?? "2026-07",

  copy: {
    addToBag: "Add to Bag",
    adding: "Adding…",
    added: "Added",
    soldOut: "Sold out",
    notifyMe: "Notify me",
    makeItYours: "Make it yours",
    viewDetails: "View details",
    bag: "Bag",
    bagWithCount: (n: number) => `Bag, ${n} ${n === 1 ? "item" : "items"}`,
    bagEmptyTitle: "Your bag is empty.",
    bagEmptyBody: "Every piece is made by hand — start with the phone chain.",
    bagEmptyCta: "Shop the collection",
    keepLooking: "Keep looking",
    checkout: "Checkout",
    checkoutNote: "Shipping and taxes calculated at checkout.",
    subtotal: "Subtotal",
    remove: "Remove",
    quantity: "Quantity",
    freeShippingProgress: (remaining: string) =>
      `You're ${remaining} away from free shipping.`,
    freeShippingUnlocked: "You've unlocked free shipping.",
    madeToOrder: "Made to order",
    inStock: "In stock",
    lowStock: (n: number) => `Only ${n} left`,
    dispatchInStock: "Dispatched in 2–3 business days.",
    dispatchMadeToOrder: "Made for you and dispatched in 7–10 business days.",
    /** Shown on every product surface next to the custom path. */
    customPrompt: "Want this in your colours?",
  },

  /** Trust points shown beneath the add-to-bag button. */
  assurances: [
    "Handmade one at a time",
    "Free shipping over $75",
    "30-day returns on ready-made pieces",
  ],
} as const;
