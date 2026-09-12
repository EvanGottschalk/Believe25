import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "onDeep";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-body font-medium tracking-wide " +
  "transition-all duration-300 ease-brand rounded-pill " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-background disabled:opacity-45 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-accent shadow-[0_2px_16px_-6px_rgba(217,115,168,0.8)] hover:shadow-[0_6px_24px_-8px_rgba(123,75,158,0.7)]",
  secondary:
    "border border-foreground/20 text-foreground hover:border-accent hover:text-accent bg-transparent",
  ghost: "text-foreground hover:text-accent bg-transparent",
  onDeep: "bg-on-deep text-surface-deep hover:bg-primary hover:text-white",
};

const sizes: Record<Size, string> = {
  // 44px minimum height throughout — every size is a valid touch target.
  sm: "min-h-[44px] px-5 text-sm",
  md: "min-h-[48px] px-7 text-[0.9375rem]",
  lg: "min-h-[54px] px-9 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };

type AnchorProps = CommonProps & {
  href: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export function Button(props: ButtonProps | AnchorProps) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
    ...rest
  } = props as Omit<ButtonProps, "href"> & Partial<AnchorProps>;

  const classes = cn(base, variants[variant], sizes[size], className);

  if (rest.href) {
    const { href, onClick } = rest;
    const external = href.startsWith("http") || href.startsWith("mailto:");
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          onClick={onClick}
          {...(href.startsWith("http")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
