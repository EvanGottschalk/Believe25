/** Form endpoints, validation copy, and the custom-design questionnaire. */

export interface QuizOption {
  value: string;
  label: string;
  /** Swatch colours for the live preview. */
  swatch?: readonly string[];
  hint?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  help?: string;
  type: "choice" | "multi" | "text";
  options?: readonly QuizOption[];
  optional?: boolean;
  maxLength?: number;
  /** Included in the 3-question teaser on the landing page. */
  inTeaser?: boolean;
}

/**
 * Declared with an explicit type rather than inferred inside FORMS: an
 * `as const` object narrows each option to its own literal shape, which
 * drops `swatch` from the union for questions that don't use it.
 */
export const QUIZ: readonly QuizQuestion[] = [
  {
    id: "piece",
    question: "What are we making?",
    type: "choice",
    inTeaser: true,
    options: [
      { value: "phone-chain", label: "Phone chain", hint: "The flagship" },
      { value: "necklace", label: "Necklace" },
      { value: "bracelet", label: "Bracelet" },
      { value: "anklet", label: "Anklet" },
      { value: "lanyard", label: "Lanyard" },
      { value: "airpod-chain", label: "AirPod chain" },
      { value: "car-charm", label: "Car mirror charm" },
      { value: "unsure", label: "Not sure yet — surprise me" },
    ],
  },
  {
    id: "palette",
    question: "Which colours feel like you?",
    type: "choice",
    inTeaser: true,
    options: [
      { value: "blush", label: "Blush & pearl", swatch: ["#F4C6DE", "#FBF2F6", "#E8D9E4"] },
      { value: "lilac", label: "Lilac & silver", swatch: ["#E3D4F0", "#C9C6D6", "#7B4B9E"] },
      { value: "candy", label: "Candy & gold", swatch: ["#D973A8", "#C9A227", "#F4C6DE"] },
      { value: "iridescent", label: "Iridescent", swatch: ["#F4C6DE", "#CBD9F5", "#E3D4F0"] },
      { value: "midnight", label: "Midnight & jewel", swatch: ["#2B1836", "#7B4B9E", "#C9A227"] },
      { value: "neutral", label: "Neutral & clear", swatch: ["#FBF2F6", "#E8E2E6", "#B9A3C4"] },
    ],
  },
  {
    id: "vibe",
    question: "How do you want it to feel?",
    type: "multi",
    help: "Pick as many as fit.",
    inTeaser: true,
    options: [
      { value: "elegant", label: "Elegant" },
      { value: "playful", label: "Playful" },
      { value: "bold", label: "Bold" },
      { value: "delicate", label: "Delicate" },
      { value: "sparkly", label: "Sparkly" },
      { value: "understated", label: "Understated" },
      { value: "maximal", label: "More is more" },
    ],
  },
  {
    id: "metal",
    question: "Gold or silver?",
    type: "choice",
    options: [
      { value: "gold", label: "Gold" },
      { value: "silver", label: "Silver" },
      { value: "rose", label: "Rose gold" },
      { value: "mixed", label: "Mix them" },
      { value: "either", label: "No preference" },
    ],
  },
  {
    id: "length",
    question: "How should it sit?",
    type: "choice",
    options: [
      { value: "short", label: "Short and close" },
      { value: "mid", label: "Mid-length" },
      { value: "long", label: "Long and loose" },
      { value: "unsure", label: "Help me decide" },
    ],
  },
  {
    id: "notes",
    question: "Anything else I should know?",
    help: "Things you'd never wear, an occasion, a colour you love, a charm that means something. Optional.",
    type: "text",
    optional: true,
    maxLength: 1000,
  },
];

export const FORMS = {
  endpoints: {
    newsletter: "/api/newsletter",
    customRequest: "/api/custom-request",
  },

  validation: {
    required: "This one's needed.",
    invalidEmail: "Enter a valid email address.",
    tooLong: "That's a little too long.",
    rateLimited: "That's a lot of requests. Give it a minute and try again.",
    serverError: "Something went wrong on our end. Try again?",
  },

  customRequest: {
    title: "Made for you",
    intro:
      "Six questions, about two minutes. It's free to ask, and you'll never be charged before you've approved a design.",
    submit: "Send my request",
    submitting: "Sending…",
    backLabel: "Back",
    nextLabel: "Next",
    progressLabel: (current: number, total: number) => `${current} of ${total}`,
    successTitle: "Got it.",
    successBody:
      "I'll design something around your answers and email you a proof, usually within a few days. Nothing is made — and nothing is charged — until you've approved it.",
    successCta: { label: "Back to the collection", href: "/shop" },
  },

  quiz: QUIZ,

  contactFields: {
    nameLabel: "Your name",
    namePlaceholder: "First name is fine",
    emailLabel: "Email",
    emailPlaceholder: "your@email.com",
    consentLabel: "You can email me about this design.",
  },

  /** Requests per IP per window on /api/custom-request. */
  rateLimit: { max: 5, windowMs: 60 * 60 * 1000 },
} as const;

export const TEASER_QUESTIONS = QUIZ.filter((q) => q.inTeaser);
