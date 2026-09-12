import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionShell, Eyebrow } from "@/components/ui/SectionShell";
import { StyleQuiz } from "@/components/custom/StyleQuiz";
import { FORMS } from "@/config/forms";
import { CONTENT } from "@/config/content";

export const metadata: Metadata = {
  title: FORMS.customRequest.title,
  description: CONTENT.custom.intro,
  alternates: { canonical: "/custom" },
};

export default function CustomPage() {
  return (
    <SectionShell standalone ground="background">
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow>{CONTENT.custom.eyebrow}</Eyebrow>
        <h1 className="mt-4 font-display text-display-lg">{FORMS.customRequest.title}</h1>
        <p className="mt-5 font-body text-lg leading-relaxed text-foreground-muted">
          {FORMS.customRequest.intro}
        </p>
      </div>

      <div className="mt-14">
        {/* useSearchParams needs a Suspense boundary during prerender. */}
        <Suspense fallback={<div className="min-h-[24rem]" />}>
          <StyleQuiz />
        </Suspense>
      </div>
    </SectionShell>
  );
}
