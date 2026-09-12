import type { Metadata } from "next";
import { SectionShell } from "@/components/ui/SectionShell";
import { Button } from "@/components/ui/Button";
import { FORMS } from "@/config/forms";
import { CONTENT } from "@/config/content";

export const metadata: Metadata = {
  title: FORMS.customRequest.successTitle,
  robots: { index: false, follow: true },
};

export default function ThankYouPage() {
  return (
    <SectionShell standalone ground="background">
      <div className="mx-auto flex max-w-xl flex-col items-center py-16 text-center">
        <span aria-hidden className="text-4xl text-gold">✦</span>
        <h1 className="mt-6 font-display text-display-lg">
          {FORMS.customRequest.successTitle}
        </h1>
        <p className="mt-5 font-body text-lg leading-relaxed text-foreground-muted">
          {FORMS.customRequest.successBody}
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button href={FORMS.customRequest.successCta.href} variant="primary" size="lg">
            {FORMS.customRequest.successCta.label}
          </Button>
          <Button href={CONTENT.story.cta.href} variant="secondary" size="lg">
            Read the story
          </Button>
        </div>
      </div>
    </SectionShell>
  );
}
