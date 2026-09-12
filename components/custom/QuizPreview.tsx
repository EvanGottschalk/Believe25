"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { CONTENT } from "@/config/content";
import { TEASER_QUESTIONS, type QuizOption } from "@/config/forms";
import { EASE } from "@/config/motion";
import { useReducedMotionSafe } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const DEFAULT_SWATCH = ["#F4C6DE", "#E3D4F0", "#CBD9F5"];

/**
 * Three of the six real questions, with a preview that responds live.
 * Interactive proof of the custom process beats a paragraph describing it —
 * and the answers carry through to the full flow at /custom.
 */
export function QuizPreview() {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const reduced = useReducedMotionSafe();

  const swatch = useMemo(() => {
    const palette = TEASER_QUESTIONS.find((q) => q.id === "palette");
    const chosen = answers.palette;
    const option = palette?.options?.find((o: QuizOption) => o.value === chosen);
    return option?.swatch ?? DEFAULT_SWATCH;
  }, [answers]);

  const vibes = Array.isArray(answers.vibe) ? answers.vibe : [];

  /** Answers are passed to /custom so nothing already given is asked twice. */
  const href = useMemo(() => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(answers)) {
      params.set(key, Array.isArray(value) ? value.join(",") : value);
    }
    const qs = params.toString();
    return qs ? `/custom?${qs}` : "/custom";
  }, [answers]);

  function choose(questionId: string, value: string, multi: boolean) {
    setAnswers((prev) => {
      if (!multi) return { ...prev, [questionId]: value };
      const current = Array.isArray(prev[questionId]) ? (prev[questionId] as string[]) : [];
      return {
        ...prev,
        [questionId]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  }

  return (
    <div className="rounded-lg border border-foreground/10 bg-surface p-6 sm:p-8">
      <h3 className="font-display text-display-sm">{CONTENT.custom.quizTeaser.heading}</h3>
      <p className="mt-1.5 font-body text-sm text-foreground-muted">
        {CONTENT.custom.quizTeaser.body}
      </p>

      {/* Live preview */}
      <div className="mt-6 flex items-center gap-4 rounded-lg bg-background p-4">
        <div className="flex -space-x-2">
          {swatch.map((color, i) => (
            <motion.span
              key={`${color}-${i}`}
              layout={!reduced}
              animate={{ backgroundColor: color }}
              transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
              className="h-9 w-9 rounded-pill border-2 border-background shadow-sm"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <p className="font-body text-sm text-foreground-muted">
          {vibes.length > 0 ? (
            <>
              <span className="text-foreground">{vibes.join(", ")}</span>
              {answers.piece ? " · " : ""}
            </>
          ) : null}
          {answers.piece
            ? TEASER_QUESTIONS.find((q) => q.id === "piece")?.options?.find(
                (o) => o.value === answers.piece,
              )?.label
            : vibes.length === 0
              ? "Your piece, taking shape."
              : null}
        </p>
      </div>

      {/* Questions */}
      <div className="mt-7 flex flex-col gap-6">
        {TEASER_QUESTIONS.map((question) => {
          const multi = question.type === "multi";
          const current = answers[question.id];
          return (
            <fieldset key={question.id}>
              <legend className="font-body text-sm font-medium">{question.question}</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {question.options?.slice(0, 6).map((option) => {
                  const active = multi
                    ? Array.isArray(current) && current.includes(option.value)
                    : current === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => choose(question.id, option.value, multi)}
                      className={cn(
                        "inline-flex min-h-[44px] items-center gap-2 rounded-pill border px-4 font-body text-sm",
                        "transition-all duration-300 ease-brand",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                        active
                          ? "border-accent bg-accent-soft/60 text-accent"
                          : "border-foreground/15 bg-background text-foreground hover:border-foreground/40",
                      )}
                    >
                      {option.swatch && (
                        <span className="flex -space-x-1" aria-hidden>
                          {option.swatch.map((c) => (
                            <span
                              key={c}
                              className="h-3.5 w-3.5 rounded-pill border border-background"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </span>
                      )}
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          );
        })}
      </div>

      <Button href={href} variant="primary" size="lg" className="mt-8 w-full">
        {CONTENT.custom.quizTeaser.cta.label}
      </Button>
    </div>
  );
}
