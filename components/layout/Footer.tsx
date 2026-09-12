import Link from "next/link";
import { SITE } from "@/config/site";
import { FOOTER_COLUMNS } from "@/config/nav";
import { CONTENT } from "@/config/content";
import { COMMERCE } from "@/config/commerce";

/** No animation here, by design — see Site Structure Outline §5. */
export function Footer() {
  const year = new Date().getFullYear();
  const socials = SITE.socials.filter((s) => s.url);

  return (
    <footer className="bg-surface-deep text-on-deep">
      <div className="mx-auto w-full max-w-container px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)] lg:gap-8">
          <div className="max-w-xs">
            <p className="font-display text-display-sm">{SITE.businessName}</p>
            <p className="mt-3 font-body text-sm leading-relaxed text-on-deep-muted">
              {CONTENT.footer.tagline}
            </p>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-3 inline-block py-1.5 font-body text-sm text-on-deep underline underline-offset-4 transition-colors hover:text-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-soft"
            >
              {SITE.email}
            </a>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="font-body text-eyebrow font-medium uppercase tracking-[0.18em] text-on-deep-muted">
                {column.title}
              </h2>
              <ul className="mt-3 flex flex-col gap-1">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block py-1 font-body text-sm text-on-deep/90 transition-colors hover:text-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-soft"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-on-deep/15 pt-8">
          {COMMERCE.assurances.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 font-body text-sm text-on-deep-muted"
            >
              <span aria-hidden className="text-gold">✦</span>
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-xs text-on-deep-muted">
            © {year} {SITE.businessName}. {CONTENT.footer.rightsSuffix}
          </p>

          {socials.length > 0 && (
            <ul className="flex flex-wrap gap-5">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block py-1.5 font-body text-xs uppercase tracking-[0.14em] text-on-deep-muted transition-colors hover:text-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-soft"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
