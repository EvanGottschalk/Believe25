/**
 * Legal copy.
 *
 * DRAFT — reviewed and replaced by the owner before launch (Tasks for Humans
 * #18). These are working drafts written to match how the business actually
 * operates; they are not legal advice and have not been reviewed by a lawyer.
 */

export interface LegalSection {
  heading: string;
  body: readonly string[];
}

export interface LegalPage {
  slug: string;
  title: string;
  effective: string;
  intro: string;
  sections: readonly LegalSection[];
}

/** Set false once the owner has reviewed and approved these. */
export const LEGAL_IS_DRAFT = true;
export const LEGAL_DRAFT_NOTICE =
  "Draft — pending review by the business owner. Not yet legally binding.";

export const PRIVACY: LegalPage = {
  slug: "privacy",
  title: "Privacy Policy",
  effective: "2026-09-11",
  intro:
    "Believe25 collects the smallest amount of information it can while still shipping you a parcel and answering your email.",
  sections: [
    {
      heading: "What we collect",
      body: [
        "When you buy something: your name, email, shipping address and order contents. Payment is handled by Shopify — card details never reach Believe25 and are never stored by us.",
        "When you request a custom design: your name, email and your answers to the style questionnaire.",
        "When you join the mailing list: your email address.",
        "If analytics are enabled, aggregate page-view data that does not identify you personally.",
      ],
    },
    {
      heading: "What we do with it",
      body: [
        "Fulfil your order, design your piece, and reply to you. That's it.",
        "We do not sell your information, and we do not share it with anyone except the services needed to run the shop — currently Shopify for orders and payment, and our email provider for the mailing list.",
      ],
    },
    {
      heading: "How long we keep it",
      body: [
        "Order records are kept as long as tax and accounting rules require. Custom design correspondence is kept while your piece is in progress and for a reasonable period after. Mailing list entries are kept until you unsubscribe.",
      ],
    },
    {
      heading: "Your choices",
      body: [
        "You can unsubscribe from any email using the link in it.",
        "You can ask what we hold about you, ask for it to be corrected, or ask for it to be deleted, by emailing hello@believe25.com. We'll respond within 30 days.",
      ],
    },
    {
      heading: "Cookies",
      body: [
        "The site uses a small amount of browser storage to remember your bag between visits. That data stays in your browser. Checkout is hosted by Shopify and uses its own cookies, described in Shopify's privacy policy.",
      ],
    },
  ],
};

export const TERMS: LegalPage = {
  slug: "terms",
  title: "Terms of Service",
  effective: "2026-09-11",
  intro:
    "The short version: everything is made by hand, prices and availability can change, and if something is wrong we'll make it right.",
  sections: [
    {
      heading: "Orders",
      body: [
        "Placing an order is an offer to buy. We accept it when we confirm it by email. If a piece has sold or a price is listed in error, we'll tell you and refund you in full rather than fulfil it at the wrong price.",
        "Because every piece is made by hand, small variations between the photograph and the piece you receive are normal and are part of what you're buying.",
      ],
    },
    {
      heading: "Custom pieces",
      body: [
        "Requesting a custom design is free and commits you to nothing. You'll be sent a design and a price. Nothing is made and nothing is charged until you approve both.",
        "Once you've approved a custom design and paid, it goes into production and cannot be cancelled, because it is made specifically for you.",
      ],
    },
    {
      heading: "Payment",
      body: [
        "Payment is processed by Shopify. Believe25 does not receive or store your card details.",
        "Prices are shown in US dollars and exclude any import duties, which are the recipient's responsibility.",
      ],
    },
    {
      heading: "Intellectual property",
      body: [
        "The designs, photographs and text on this site belong to Believe25. Please don't reproduce them commercially without asking.",
      ],
    },
    {
      heading: "Liability",
      body: [
        "A phone chain is an accessory, not a safety device. It reduces the chance of dropping your phone; it does not guarantee it. Believe25 isn't liable for damage to a phone or any other device.",
      ],
    },
  ],
};

export const SHIPPING_RETURNS: LegalPage = {
  slug: "shipping-returns",
  title: "Shipping & Returns",
  effective: "2026-09-11",
  intro:
    "Made by hand, packed carefully, and sent as quickly as one person can manage.",
  sections: [
    {
      heading: "Dispatch",
      body: [
        "Ready-made pieces are dispatched within 2–3 business days.",
        "Made-to-order pieces are made for you and dispatched within 7–10 business days.",
        "Custom designs are quoted individually — you'll be given a timeline with your design.",
      ],
    },
    {
      heading: "Shipping",
      body: [
        "Shipping is free on orders over $75. Below that, rates are calculated at checkout based on your address.",
        "Tracking is emailed to you as soon as the parcel is on its way.",
      ],
    },
    {
      heading: "Returns",
      body: [
        "Ready-made pieces can be returned within 30 days of delivery, unworn and in their original packaging, for a full refund of the item price. Return postage is the customer's, unless the piece arrived faulty.",
        "Custom pieces cannot be returned, because they're made specifically for you and can't be resold. This is why nothing is made until you've approved the design.",
        "If anything arrives damaged or faulty, email hello@believe25.com with a photo within 14 days and it will be replaced or refunded, including postage.",
      ],
    },
  ],
};

export const LEGAL_PAGES = [PRIVACY, TERMS, SHIPPING_RETURNS] as const;
