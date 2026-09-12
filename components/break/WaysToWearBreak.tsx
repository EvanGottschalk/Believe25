import { SectionShell, IridescentRule } from "@/components/ui/SectionShell";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CONTENT } from "@/config/content";

/** Light horizontal band — a breath after the sticky sequence. */
export function WaysToWearBreak() {
  return (
    <SectionShell ground="surface" size="break">
      <IridescentRule className="mb-12" />

      <h2 className="sr-only">{CONTENT.waysToWear.heading}</h2>

      <RevealGroup as="ul" className="grid gap-10 sm:grid-cols-3 sm:gap-8">
        {CONTENT.waysToWear.items.map((item) => (
          <RevealItem as="li" key={item.icon} className="flex flex-col items-start gap-3">
            <Icon name={item.icon} />
            <h3 className="font-display text-display-sm">{item.title}</h3>
            <p className="font-body text-sm leading-relaxed text-foreground-muted">{item.body}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </SectionShell>
  );
}

function Icon({ name }: { name: string }) {
  const common = {
    viewBox: "0 0 48 48",
    className: "h-9 w-9 text-accent",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "wrist") {
    return (
      <svg {...common}>
        <rect x="17" y="6" width="14" height="24" rx="4" />
        <ellipse cx="24" cy="37" rx="9" ry="7" />
        <circle cx="24" cy="44" r="1.6" fill="currentColor" />
      </svg>
    );
  }
  if (name === "hook") {
    return (
      <svg {...common}>
        <path d="M10 10h28" />
        <ellipse cx="24" cy="17" rx="6" ry="5" />
        <rect x="17" y="24" width="14" height="20" rx="4" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M24 6l3.2 9.8H37l-7.9 5.8 3 9.8-8.1-6-8.1 6 3-9.8L11 15.8h9.8z" />
      <circle cx="38" cy="38" r="2.5" />
      <circle cx="11" cy="36" r="1.8" />
    </svg>
  );
}
