/** Every UI string, heading, paragraph, label and alt text. */

export const CONTENT = {
  hero: {
    eyebrow: "An accessory that didn't exist",
    headline: "Jewelry for the thing you never put down.",
    subhead:
      "The phone chain hangs from your phone like a necklace — loop it on your wrist so you never drop it, hang it up to shoot hands-free, and wear it because it's beautiful.",
    primaryCta: { label: "Shop Phone Chains", href: "/shop?category=phone-chains" },
    secondaryCta: { label: "Design your own", href: "/custom" },
    scrollHint: "What is a phone chain?",
    chainAlt: "A beaded phone chain hanging from a phone and swaying gently",
  },

  phoneChain: {
    eyebrow: "The flagship",
    heading: "It's a necklace. For your phone.",
    intro:
      "A loop of beads, charms and stones that fastens to your phone and does three things at once.",
    steps: [
      {
        id: "wrist",
        title: "Loop it on your wrist",
        body: "Your hand goes through the loop. Your phone stops being something you can drop — on the street, over the balcony, into the bath. It just hangs there.",
        caption: "Never drop it again",
      },
      {
        id: "hang",
        title: "Hang it anywhere",
        body: "Hook it over a coat hanger, a branch, a door handle. Now your phone is a tripod and both your hands are free for photos, video and everything else.",
        caption: "Hands-free in one second",
      },
      {
        id: "wear",
        title: "Wear it as jewelry",
        body: "It isn't a case and it isn't a lanyard. It's a piece of jewelry that happens to attach to the thing you're already holding all day.",
        caption: "An accessory, not a gadget",
      },
    ],
    cta: { label: "Shop phone chains", href: "/shop?category=phone-chains" },
  },

  waysToWear: {
    heading: "Three ways to wear it",
    items: [
      { icon: "wrist", title: "On your wrist", body: "Secured, hands-free, impossible to drop." },
      { icon: "hook", title: "On a hook", body: "Your phone becomes a tripod anywhere." },
      { icon: "sparkle", title: "On show", body: "Beads, charms and stones you actually chose." },
    ],
  },

  collection: {
    eyebrow: "Ready to wear",
    heading: "The collection",
    intro:
      "Every piece here is made by hand and ready to ship. Every piece here can also be remade in your colours.",
    featuredHeading: "Picked to start with",
    categoriesHeading: "Shop by category",
    cta: { label: "See everything", href: "/shop" },
    emptyState:
      "The catalog is being loaded. Check back shortly — or start a custom design in the meantime.",
  },

  crown: {
    line: "Wear your crown.",
    sub: "Believe25",
    imageAlt: "A leopard wearing a jewelled gold crown",
  },

  custom: {
    eyebrow: "Made for you",
    heading: "Or have one made that's only yours.",
    intro:
      "Tell me how you dress, what you're drawn to and what you'd never wear. I'll design a piece around it — one of one, made by hand, yours.",
    steps: [
      { n: "01", title: "Tell me your style", body: "Six quick questions. Two minutes, no account, no payment." },
      { n: "02", title: "I design your piece", body: "I put together a design around your answers and send it to you." },
      { n: "03", title: "You approve the design", body: "Change anything you want. Nothing is made until you love it." },
      { n: "04", title: "You're sent an invoice", body: "You only pay once the design is agreed. No deposit to ask." },
      { n: "05", title: "It's made by hand", body: "Then it ships to you, and no one else has one." },
    ],
    quizTeaser: {
      heading: "Start here",
      body: "Three of the six questions — see what happens.",
      cta: { label: "Start your design", href: "/custom" },
    },
    freeNote: "Asking is free. You'll never be charged before you've approved a design.",
  },

  testimonials: {
    heading: "In their words",
    /**
     * PLACEHOLDER CONTENT — MUST BE REPLACED BEFORE LAUNCH.
     * These are written as obvious placeholders on purpose. Real quotes with
     * written permission are Tasks for Humans #3. Publishing invented reviews
     * as if they were real is both a legal and a trust problem, so the section
     * hides itself in production until `placeholder` is set to false.
     */
    placeholder: true,
    items: [
      { quote: "Sample testimonial — replace with a real customer quote before launch.", name: "Placeholder", location: "" },
      { quote: "Sample testimonial — replace with a real customer quote before launch.", name: "Placeholder", location: "" },
      { quote: "Sample testimonial — replace with a real customer quote before launch.", name: "Placeholder", location: "" },
    ],
  },

  story: {
    eyebrow: "The story",
    heading: "One person. One piece at a time.",
    paragraphs: [
      "I started making jewelry because I wanted things that felt like me and couldn't find them. The phone chain came later, out of a much simpler problem — I kept dropping my phone, and nothing that fixed it looked like anything I'd want to wear.",
      "So I made one. Then people kept asking where I got it. Every piece I sell is still made by hand, one at a time, and the best ones are still the ones designed for a specific person.",
    ],
    cta: { label: "Have something made", href: "/custom" },
    imageAlts: [
      "Believe25 pieces laid out on a work surface",
      "A phone chain being assembled by hand",
    ],
  },

  newsletter: {
    heading: "New pieces, first.",
    body: "Occasional emails when something new is made. Nothing else.",
    placeholder: "your@email.com",
    submit: "Join",
    submitting: "Joining…",
    success: "You're on the list.",
    error: "That didn't work. Try again?",
    invalidEmail: "Enter a valid email address.",
    consent: "No spam. Unsubscribe any time.",
  },

  footer: {
    tagline: "Handmade jewelry and phone chains, designed one at a time.",
    rightsSuffix: "All rights reserved.",
    madeBy: "Designed and made by hand.",
  },

  shop: {
    title: "Shop",
    intro: "Everything ready to ship. Anything here can also be made in your colours.",
    allLabel: "All",
    countLabel: (n: number) => `${n} ${n === 1 ? "piece" : "pieces"}`,
    emptyCategory: "Nothing here yet. Try another category.",
  },

  product: {
    backToShop: "Back to shop",
    materialsHeading: "Materials",
    dimensionsHeading: "Dimensions",
    careHeading: "Care",
    relatedHeading: "You might also like",
    customCard: {
      heading: "Want this, but yours?",
      body: "Same piece, your colours, your charms. Designed around you and made to order.",
      cta: "Make it yours",
    },
  },

  notFound: {
    heading: "This page doesn't exist.",
    body: "The link may be old, or the piece may have sold.",
    cta: { label: "Back to the collection", href: "/shop" },
  },
} as const;
