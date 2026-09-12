import { cn } from "@/lib/utils";

type Ground = "background" | "surface" | "deep";

const grounds: Record<Ground, string> = {
  background: "bg-background text-foreground",
  surface: "bg-surface text-foreground",
  deep: "bg-surface-deep text-on-deep",
};

/**
 * Shared wrapper for every Body and Break section.
 *
 * `standalone` adds the extra vertical room a section needs when it is its own
 * page rather than one stop on a scroll, and clears the sticky header.
 */
export function SectionShell({
  id,
  children,
  ground = "background",
  standalone = false,
  size = "body",
  className,
  contentClassName,
  fullBleed = false,
}: {
  id?: string;
  children: React.ReactNode;
  ground?: Ground;
  standalone?: boolean;
  size?: "body" | "break";
  className?: string;
  contentClassName?: string;
  fullBleed?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        // overflow-x-clip, not overflow-hidden: `hidden` makes the section a
        // scroll container, which silently breaks position:sticky in any
        // child (the phone-chain sequence depends on it). `clip` contains
        // decorative overflow without that side effect.
        "relative w-full overflow-x-clip",
        grounds[ground],
        size === "body"
          ? "py-20 sm:py-24 lg:py-32"
          : "py-14 sm:py-16 lg:py-20",
        standalone && "pt-32 sm:pt-36 lg:pt-44",
        className,
      )}
    >
      {fullBleed ? (
        children
      ) : (
        <div
          className={cn(
            "mx-auto w-full max-w-container px-5 sm:px-8 lg:px-12",
            contentClassName,
          )}
        >
          {children}
        </div>
      )}
    </section>
  );
}

export function Eyebrow({
  children,
  className,
  tone = "default",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "onDeep";
}) {
  return (
    <p
      className={cn(
        "font-body text-eyebrow font-medium uppercase",
        tone === "onDeep" ? "text-on-deep-muted" : "text-accent",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** Thin animated iridescent rule. Decorative only. */
export function IridescentRule({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "h-px w-full bg-iridescent bg-[length:200%_100%] animate-shimmer",
        "motion-reduce:animate-none",
        className,
      )}
    />
  );
}
