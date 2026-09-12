"use client";

import { SectionShell, Eyebrow } from "@/components/ui/SectionShell";
import { Reveal } from "@/components/ui/Reveal";
import { QuizPreview } from "@/components/custom/QuizPreview";
import { CONTENT } from "@/config/content";
import type { SectionProps } from "@/lib/types";

export function CustomSection({ standalone = false }: SectionProps) {
  return (
    <SectionShell id="made-for-you" standalone={standalone} ground="background">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        {/* Timeline */}
        <div>
          <Reveal>
            <Eyebrow>{CONTENT.custom.eyebrow}</Eyebrow>
            <h2 className="mt-4 font-display text-display-lg">{CONTENT.custom.heading}</h2>
            <p className="mt-5 max-w-prose font-body text-lg leading-relaxed text-foreground-muted">
              {CONTENT.custom.intro}
            </p>
          </Reveal>

          <ol className="relative mt-12">
            {/* The iridescent spine the steps hang from. */}
            <span
              aria-hidden
              className="absolute left-[13px] top-2 h-[calc(100%-1rem)] w-px bg-iridescent bg-[length:100%_200%] animate-shimmer motion-reduce:animate-none"
            />
            {CONTENT.custom.steps.map((step, i) => (
              <Reveal as="li" key={step.n} delay={i * 0.07} className="relative flex gap-5 pb-8 last:pb-0">
                <span className="relative z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-pill border border-accent/30 bg-background font-body text-[0.6875rem] font-semibold text-accent">
                  {step.n}
                </span>
                <div>
                  <h3 className="font-body text-base font-medium">{step.title}</h3>
                  <p className="mt-1 max-w-prose font-body text-sm leading-relaxed text-foreground-muted">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal className="mt-8">
            <p className="max-w-prose rounded-lg border border-gold/25 bg-gold/5 px-5 py-4 font-body text-sm leading-relaxed text-foreground-muted">
              <span aria-hidden className="mr-2 text-gold">✦</span>
              {CONTENT.custom.freeNote}
            </p>
          </Reveal>
        </div>

        {/* Live teaser */}
        <Reveal delay={0.1}>
          <QuizPreview />
        </Reveal>
      </div>
    </SectionShell>
  );
}
