import { SectionShell } from "@/components/ui/SectionShell";
import { LEGAL_DRAFT_NOTICE, LEGAL_IS_DRAFT, type LegalPage as LegalPageConfig } from "@/config/legal";

export function LegalPage({ page }: { page: LegalPageConfig }) {
  const effective = new Date(page.effective).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <SectionShell standalone ground="background">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-display-lg">{page.title}</h1>
        <p className="mt-3 font-body text-sm text-foreground-muted">
          Effective {effective}
        </p>

        {LEGAL_IS_DRAFT && (
          <p
            role="note"
            className="mt-6 rounded-lg border border-gold/30 bg-gold/5 px-5 py-4 font-body text-sm text-foreground-muted"
          >
            <span aria-hidden className="mr-2 text-gold">✦</span>
            {LEGAL_DRAFT_NOTICE}
          </p>
        )}

        <p className="mt-8 font-body text-lg leading-relaxed text-foreground-muted">
          {page.intro}
        </p>

        <div className="mt-12 flex flex-col gap-10">
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-display-sm">{section.heading}</h2>
              <div className="mt-3 flex flex-col gap-3">
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 24)}
                    className="font-body leading-relaxed text-foreground-muted"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
